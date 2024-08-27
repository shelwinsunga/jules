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
            # Run pdflatex with optimization flags
            result = subprocess.run([
                'pdflatex',
                '-draftmode',                # Faster, draft-quality output
                '-output-directory', temp_dir,
                input_file
            ], 
            check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            env=dict(os.environ, PATH=f"{os.environ['PATH']}:/usr/bin"),
            text=True)
            
            # Send the generated PDF
            return send_file(os.path.join(temp_dir, 'input.pdf'), 
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