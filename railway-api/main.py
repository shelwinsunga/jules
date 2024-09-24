from flask import Flask, send_file, request
import os
import subprocess
import tempfile
from flask_cors import CORS

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

    with tempfile.TemporaryDirectory() as temp_dir:
        print(f"Created temporary directory at {temp_dir}")
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
            try:
                print("Running pdflatex for the first time")
                subprocess.run(['pdflatex', '-shell-escape', '-output-directory', temp_dir, input_file], 
                               check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin:/usr/local/bin"),
                               text=True)
                
                print("Running pdflatex for the second time")
                result = subprocess.run(['pdflatex', '-shell-escape', '-output-directory', temp_dir, input_file], 
                                        check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                        env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin:/usr/local/bin"),
                                        text=True)
                
                # Track generated files
                for ext in ['.aux', '.log', '.pdf']:
                    generated_files.append(os.path.join(temp_dir, f'main{ext}'))
                                        
                pdf_path = os.path.join(temp_dir, 'main.pdf')
                print(f"PDF generated successfully at {pdf_path}")
                return send_file(pdf_path, 
                                 mimetype='application/pdf',
                                 as_attachment=True,
                                 download_name='output.pdf')
            except subprocess.CalledProcessError as e:
                output = e.stdout + e.stderr
                print(f"Error generating PDF: {e}\nOutput: {output}")
                return {
                    "error": "Error generating PDF",
                    "message": str(e),
                    "details": output
                }, 500
        finally:
            # Manually remove tracked temporary files
            for file_path in generated_files:
                try:
                    if os.path.isfile(file_path) or os.path.islink(file_path):
                        os.unlink(file_path)
                    elif os.path.isdir(file_path):
                        os.rmdir(file_path)
                    print(f"Removed temporary file {file_path}")
                except Exception as e:
                    print(f"Failed to remove temporary file {file_path}. Reason: {e}")

if __name__ == '__main__':
    print("Starting Flask app")
    app.run(debug=True)