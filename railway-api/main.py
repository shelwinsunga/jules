from flask import Flask, send_file, request
import os
import subprocess
import tempfile
import time  # Added for cleanup function
import re  # Added for regex pattern matching
from flask_cors import CORS

def needs_second_pass(tex_content):
    patterns = [
        r'\\ref{',
        r'\\cite{',
        r'\\tableofcontents',
        r'\\listoffigures',
        r'\\listoffigures',
        r'\\bibliography{',
        r'\\index{'
    ]
    return any(re.search(pattern, tex_content) for pattern in patterns)

def needs_shell_escape(tex_content):
    patterns = [
        r'\\write18{',
        r'\\immediate\\write18{',
        r'\\includegraphics',
        r'\\usepackage{minted}'
    ]
    return any(re.search(pattern, tex_content) for pattern in patterns)

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

    # Use persistent temp directory
    temp_dir = os.path.join(os.path.dirname(__file__), 'latex_temp')
    os.makedirs(temp_dir, exist_ok=True)
    cleanup_old_files(temp_dir)
    print(f"Using persistent directory at {temp_dir}")

    def cleanup_files():
        """Clean up generated files in temp directory"""
        for ext in ['.aux', '.log', '.pdf']:
            filepath = os.path.join(temp_dir, f'main{ext}')
            try:
                if os.path.isfile(filepath):
                    os.unlink(filepath)
                    print(f"Removed generated file {filepath}")
            except Exception as e:
                print(f"Failed to remove file {filepath}: {e}")

    def handle_error(output):
        """Format error message from LaTeX output"""
        error_details = output.split('\n')
        error_line = next((line for line in error_details if '!' in line), "Unknown LaTeX error")
        return {
            "error": "LaTeX compilation error",
            "message": error_line,
            "details": output
        }, 500

    try:
        # Save and read input file
        input_file = os.path.join(temp_dir, 'main.tex')
        files['main.tex'].save(input_file)
        with open(input_file, 'r') as f:
            tex_content = f.read()

        # Base command
        cmd = ['pdflatex', '-interaction=nonstopmode', '-output-directory', temp_dir, input_file]

        # Add shell-escape if needed
        if needs_shell_escape(tex_content):
            print("Document requires shell-escape, adding flag")
            cmd.insert(1, '-shell-escape')

        # First pass - always required
        print("Running pdflatex for the first time")
        try:
            result = subprocess.run(cmd,
                                  capture_output=True,
                                  text=True,
                                  env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin:/usr/local/bin"),
                                  timeout=30)
            if result.returncode != 0:
                cleanup_files()
                return handle_error(result.stdout)
        except subprocess.TimeoutExpired:
            cleanup_files()
            return {
                "error": "Compilation timeout",
                "message": "LaTeX compilation took too long. Check for infinite loops or complex macros.",
                "details": "Process killed after 30 seconds"
            }, 500

        # Second pass only if needed
        if needs_second_pass(tex_content):
            print("Document requires second pass, running pdflatex again")
            try:
                result = subprocess.run(cmd,
                                      capture_output=True,
                                      text=True,
                                      env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin:/usr/local/bin"),
                                      timeout=30)
                if result.returncode != 0:
                    cleanup_files()
                    return handle_error(result.stdout)
            except subprocess.TimeoutExpired:
                cleanup_files()
                return {
                    "error": "Compilation timeout",
                    "message": "LaTeX compilation took too long on second pass.",
                    "details": "Process killed after 30 seconds"
                }, 500
        else:
            print("Document does not require second pass, skipping")

        # Check if PDF was generated
        pdf_path = os.path.join(temp_dir, 'main.pdf')
        if not os.path.exists(pdf_path):
            cleanup_files()
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

    except Exception as e:
        cleanup_files()
        return {
            "error": "Unexpected error",
            "message": str(e),
            "details": "An unexpected error occurred during PDF generation"
        }, 500

if __name__ == '__main__':
    print("Starting Flask app")
    app.run(debug=True)
