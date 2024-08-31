from flask import Flask, send_file, request
import os
import subprocess
import tempfile
from flask_cors import CORS
from werkzeug.utils import secure_filename

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
    if 'files' not in request.files:
        return {"error": "No file part"}, 400
    
    files = request.files.getlist('files')
    
    if not files:
        return {"error": "No selected files"}, 400
    
    with tempfile.TemporaryDirectory() as temp_dir:
        main_file = None
        for file in files:
            filename = secure_filename(file.filename)
            file_path = os.path.join(temp_dir, filename)
            file.save(file_path)
            if filename == 'main.tex':
                main_file = file_path
        
        if not main_file:
            return {"error": "main.tex file not found"}, 400
        
        try:
            # Run pdflatex using texlive-latex-base
            result = subprocess.run(['pdflatex', '-output-directory', temp_dir, main_file], 
                                    check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                    env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin"),
                                    text=True)
            
            # Send the generated PDF
            pdf_filename = 'main.pdf'
            return send_file(os.path.join(temp_dir, pdf_filename), 
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