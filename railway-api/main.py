from flask import Flask, send_file, request
import os
import subprocess
import tempfile
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Dummy LaTeX content
DUMMY_LATEX = r"""
\documentclass{article}
\begin{document}
Hello, world! This is a simple LaTeX document.

\section{A Section}
This is a section in our document.

\subsection{A Subsection}
This is a subsection with some math: $E = mc^2$
\end{document}
"""
@app.route('/', methods=['POST'])
def latex_to_pdf():
    print("Received a request to convert LaTeX to PDF.")
    files = request.files

    if 'main.tex' not in files:
        print("No main.tex file provided in the request.")
        return {
            "error": "No main.tex file provided",
            "message": "Please upload a main.tex file."
        }, 400

    with tempfile.TemporaryDirectory() as temp_dir:
        print(f"Created a temporary directory at {temp_dir}.")
        for filename, file in files.items():
            file_path = os.path.join(temp_dir, filename)
            file.save(file_path)
            print(f"Saved file {filename} to {file_path}.")
        
        input_file = os.path.join(temp_dir, 'main.tex')
        print(f"Input file path set to {input_file}.")
        
        try:
            print("Running pdflatex to generate PDF.")
            result = subprocess.run(['pdflatex', '-output-directory', temp_dir, input_file], 
                                    check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                    env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin"),
                                    text=True)
            print("pdflatex command executed successfully.")
            
            pdf_path = os.path.join(temp_dir, 'main.pdf')
            print(f"Generated PDF located at {pdf_path}.")
            # Save the generated PDF locally
            # local_pdf_path = os.path.join(os.getcwd(), 'output.pdf')
            # with open(pdf_path, 'rb') as pdf_file:
            #     with open(local_pdf_path, 'wb') as local_file:
            #         local_file.write(pdf_file.read())
            # print(f"Saved the generated PDF locally at {local_pdf_path}.")
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
            print(f"Error generating PDF: {e}\nOutput: {output}")
            # Return a more detailed error message
            return {
                "error": "Error generating PDF",
                "message": str(e),
                "details": output
            }, 500

if __name__ == '__main__':
    print("Starting the Flask application.")
    app.run(debug=True)