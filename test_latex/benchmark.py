import os
import subprocess
import time
import json
import argparse
from typing import Dict, Optional

def run_compilation(content: str, shell_escape: bool = False, force_second_pass: bool = False) -> Dict[str, float]:
    """Run LaTeX compilation and return timing results."""
    temp_dir = os.path.join(os.path.dirname(__file__), 'temp')
    os.makedirs(temp_dir, exist_ok=True)

    # Cleanup before compilation
    for ext in ['.aux', '.log', '.pdf', '.tex']:
        try:
            os.unlink(os.path.join(temp_dir, f'test{ext}'))
        except:
            pass

    input_file = os.path.join(temp_dir, 'test.tex')
    with open(input_file, 'w') as f:
        f.write(content)

    cmd = ['pdflatex', '-interaction=nonstopmode', '-output-directory', temp_dir, input_file]
    if shell_escape:
        cmd.insert(1, '-shell-escape')

    times = {'first': 0.0, 'second': 0.0}

    error_patterns = [
        '!',                     # Standard LaTeX errors
        'Emergency stop',        # Fatal errors
        'Fatal error occurred',  # Fatal compilation errors
        'Runaway argument',      # Missing closing brace
        'missing \\}',           # Missing closing brace
        'missing \\$',           # Missing math mode closure
        'missing \\end',         # Missing environment closure
        'Runaway definition',    # Missing brace in definition
        'Paragraph ended'        # Missing brace causing paragraph end
    ]

    def check_for_errors(output_text, log_file):
        # Check command output
        for line in output_text.split('\n'):
            if any(pattern in line for pattern in error_patterns):
                return line.strip()

        # Check log file
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                log_content = f.read()
                for line in log_content.split('\n'):
                    if any(pattern in line for pattern in error_patterns):
                        return line.strip()
        return None

    # First pass
    start = time.time()
    result = subprocess.run(cmd, capture_output=True, text=True)
    error = check_for_errors(result.stdout, os.path.join(temp_dir, 'test.log'))
    if error or result.returncode != 0:
        raise Exception(f"LaTeX Error: {error or 'Unknown compilation error'}")
    times['first'] = time.time() - start

    # Second pass if needed
    if force_second_pass:
        start = time.time()
        result = subprocess.run(cmd, capture_output=True, text=True)
        error = check_for_errors(result.stdout, os.path.join(temp_dir, 'test.log'))
        if error or result.returncode != 0:
            raise Exception(f"LaTeX Error: {error or 'Unknown compilation error'}")
        times['second'] = time.time() - start

    return times

# Template contents
TEMPLATES = {
    'blank': r"""\documentclass{article}
\begin{document}
Hello, World!
\end{document}""",

    'resume': r"""\documentclass{article}
\usepackage{graphicx}
\begin{document}
\section*{Resume}
\subsection*{Education}
\begin{itemize}
\item University of Example
\item Degree in Computer Science
\end{itemize}
\end{document}""",

    'complex': r"""\documentclass{article}
\usepackage{amsmath}
\usepackage{graphicx}
\begin{document}
\section{Complex Document}
\begin{equation}
E = mc^2
\end{equation}
\end{document}""",

    'report': r"""\documentclass{report}
\begin{document}
\chapter{Introduction}
This is a report.
\end{document}""",

    'letter': r"""\documentclass{letter}
\begin{document}
\begin{letter}{Recipient}
\opening{Dear Sir/Madam,}
This is a letter.
\closing{Sincerely,}
\end{letter}
\end{document}""",

    'proposal': r"""\documentclass{article}
\begin{document}
\section{Proposal}
This is a proposal document.
\end{document}"""
}

def main():
    parser = argparse.ArgumentParser(description='Run LaTeX compilation benchmarks')
    parser.add_argument('--template', choices=list(TEMPLATES.keys()), help='Specific template to test')
    args = parser.parse_args()

    print("Starting LaTeX compilation benchmarks...\n")
    results = {}

    templates_to_test = [args.template] if args.template else TEMPLATES.keys()

    for template_name in templates_to_test:
        print(f"Benchmarking {template_name.title()} template...")
        results[template_name] = {}

        configs = {
            'basic': {'shell_escape': False, 'force_second_pass': False},
            'shell_escape': {'shell_escape': True, 'force_second_pass': False},
            'force_second': {'shell_escape': False, 'force_second_pass': True},
            'both': {'shell_escape': True, 'force_second_pass': True}
        }

        for config_name, config in configs.items():
            try:
                times = run_compilation(TEMPLATES[template_name], **config)
                total = times['first'] + times['second']
                print(f"  {config_name:11} - Total: {total:.3f}s (1st: {times['first']:.3f}s, 2nd: {times['second']:.3f}s)")
            except Exception as e:
                print(f"  {config_name:11} - Error: {str(e)}")

        print()

if __name__ == '__main__':
    main()
