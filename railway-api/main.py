from flask import Flask, send_file, request
import os
import subprocess
import tempfile
import time  # Added for cleanup function
from flask_cors import CORS

def needs_second_pass(tex_content):
    patterns = [
        r'\\ref{',
        r'\\cite{',
        r'\\bibliography{',
        r'\\tableofcontents',
        r'\\listoffigures',
        r'\\listoftables'
    ]
    return any(pattern in tex_content for pattern in patterns)

def needs_shell_escape(tex_content):
    shell_escape_packages = [
        'minted',
        'epstopdf',
        'svg',
        'animate'
    ]
    return any(f'\\usepackage{{{pkg}}}' in tex_content for pkg in shell_escape_packages)

def cleanup_old_files(temp_dir, max_age_hours=24):
    current_time = time.time()
    for filename in os.listdir(temp_dir):
        filepath = os.path.join(temp_dir, filename)
        if os.path.getmtime(filepath) < current_time - (max_age_hours * 3600):
            try:
                if os.path.isfile(filepath) or os.path.islink(filepath):
                    os.unlink(filepath)
                    print(f"Removed old file {filepath}")
            except Exception as e:
                print(f"Failed to remove old file {filepath}: {e}")

app = Flask(__name__)

CORS(app)

@app.route('/', methods=['POST'])
def latex_to_pdf():
    print("Received request to convert LaTeX to PDF")
    files = request.files

    if 'main.tex' not in files:
        print("No main.tex file provided in the request")
        return {
            "error": "No main.tex file provided",
            "message": "Please upload a main.tex file."
        }, 400

    # Use persistent temp directory instead of temporary one
    temp_dir = os.path.join(os.path.dirname(__file__), 'latex_temp')
    os.makedirs(temp_dir, exist_ok=True)
    cleanup_old_files(temp_dir)  # Clean up old files before processing new ones
    print(f"Using persistent directory at {temp_dir}")
    generated_files = []
    try:
        for filename, file in files.items():
            file_path = os.path.join(temp_dir, filename)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            file.save(file_path)
            generated_files.append(file_path)
            print(f"Saved file {filename} to {file_path}")

        input_file = os.path.join(temp_dir, 'main.tex')
        print(f"Input file path set to {input_file}")

        # Read tex content once for analysis
        with open(input_file, 'r') as f:
            tex_content = f.read()

        # Build pdflatex command based on document requirements
        cmd = ['timeout', '30', 'pdflatex', '-interaction=nonstopmode', '-output-directory', temp_dir, input_file]
        if needs_shell_escape(tex_content):
            print("Document requires shell-escape, adding flag")
            cmd.insert(3, '-shell-escape')

        # First compilation - always required
        print("Running pdflatex for the first time")
        try:
            result = subprocess.run(cmd,
                                check=True,
                                stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE,
                                env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin:/usr/local/bin"),
                                text=True,
                                timeout=30)
            print(f"First pass output: {result.stdout}")
        except subprocess.TimeoutExpired:
            return {
                "error": "Compilation timeout",
                "message": "LaTeX compilation took too long. Check for infinite loops or complex macros.",
                "details": "Process killed after 30 seconds"
            }, 500

        if needs_second_pass(tex_content):
            print("Document requires second pass, running pdflatex again")
            try:
                result = subprocess.run(cmd,
                                    check=True,
                                    stdout=subprocess.PIPE,
                                    stderr=subprocess.PIPE,
                                    env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin:/usr/local/bin"),
                                    text=True,
                                    timeout=30)
                print(f"Second pass output: {result.stdout}")
            except subprocess.TimeoutExpired:
                return {
                    "error": "Compilation timeout",
                    "message": "LaTeX compilation took too long on second pass.",
                    "details": "Process killed after 30 seconds"
                }, 500
        else:
            print("Document does not require second pass, skipping")

        # Track generated files
        for ext in ['.aux', '.log', '.pdf']:
            generated_files.append(os.path.join(temp_dir, f'main{ext}'))

        pdf_path = os.path.join(temp_dir, 'main.pdf')
        if not os.path.exists(pdf_path):
            return {
                "error": "PDF generation failed",
                "message": "No PDF file was generated. Check the LaTeX logs for errors.",
                "details": result.stdout if 'result' in locals() else "No compilation output available"
            }, 500

        print(f"PDF generated successfully at {pdf_path}")
        return send_file(pdf_path,
                         mimetype='application/pdf',
                         as_attachment=True,
                         download_name='output.pdf')

    except subprocess.CalledProcessError as e:
        output = e.stdout + e.stderr
        error_details = output.split('\n')
        error_line = next((line for line in error_details if '!' in line), "Unknown LaTeX error")
        return {
            "error": "LaTeX compilation error",
            "message": error_line,
            "details": output
        }, 500
    except Exception as e:
        return {
            "error": "Unexpected error",
            "message": str(e),
            "details": "An unexpected error occurred during PDF generation"
        }, 500
    finally:
        for file_path in generated_files:
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                    print(f"Removed generated file {file_path}")
            except Exception as e:
                print(f"Failed to remove generated file {file_path}. Reason: {e}")
            except Exception as e:
                print(f"Failed to remove generated file {file_path}. Reason: {e}")

if __name__ == '__main__':
    print("Starting Flask app")
    app.run(debug=True)
