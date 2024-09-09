from flask import Flask, send_file, request
import os
import subprocess
import tempfile
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
@app.route('/', methods=['POST'])
def latex_to_pdf():
    files = request.files

    if 'main.tex' not in files:
        return {
            "error": "No main.tex file provided",
            "message": "Please upload a main.tex file."
        }, 400

    with tempfile.TemporaryDirectory() as temp_dir:
        for filename, file in files.items():
            file_path = os.path.join(temp_dir, filename)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            file.save(file_path)
        
        input_file = os.path.join(temp_dir, 'main.tex')
        
        # Print the directory structure for debugging
        # for root, dirs, files in os.walk(temp_dir):
        #     for name in files:
        #         print(os.path.join(root, name))
        
        try:
            # First run: Generate Pygments output
            subprocess.run(['pdflatex', '-shell-escape', '-output-directory', temp_dir, input_file], 
                           check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                           env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin:/usr/local/bin"),
                           text=True)
            
            # Second run: Generate PDF with Pygments output
            result = subprocess.run(['pdflatex', '-shell-escape', '-output-directory', temp_dir, input_file], 
                                    check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                    env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin:/usr/local/bin"),
                                    text=True)
                                    
            pdf_path = os.path.join(temp_dir, 'main.pdf')
            # Send the generated PDF
            return send_file(pdf_path, 
                             mimetype='application/pdf',
                             as_attachment=True,
                             download_name='output.pdf')
        except subprocess.CalledProcessError as e:
            # Capture both stdout and stderr
            output = e.stdout + e.stderr
            # Log the full error
            app.logger.error(f"Error generating PDF: {e}\nOutput: {output}")
            # Return a more detailed error message
            return {
                "error": "Error generating PDF",
                "message": str(e),
                "details": output
            }, 500

if __name__ == '__main__':
    app.run(debug=True)