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
    latex_content = request.json.get('latex')
    with tempfile.TemporaryDirectory() as temp_dir:
        input_file = os.path.join(temp_dir, 'input.tex')
        with open(input_file, 'w') as f:
            f.write(latex_content)
        
        try:
            # Run pdflatex using texlive-latex-base
            subprocess.run(['pdflatex', '-output-directory', temp_dir, input_file], 
                           check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                           env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin"))
            
            # Send the generated PDF
            return send_file(os.path.join(temp_dir, 'input.pdf'), 
                             mimetype='application/pdf',
                             as_attachment=True,
                             download_name='output.pdf')
        except subprocess.CalledProcessError as e:
            return f"Error generating PDF: {e}", 500

if __name__ == '__main__':
    app.run(debug=True)