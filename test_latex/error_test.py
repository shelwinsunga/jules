import sys
import json
from benchmark import run_compilation

# Test error cases
error_templates = {
    "missing_package": r"""\documentclass{article}
\usepackage{nonexistentpackage}
\begin{document}
Test
\end{document}""",

    "unclosed_env": r"""\documentclass{article}
\begin{document}
\begin{itemize}
Item
\end{document}""",

    "syntax_error": r"""\documentclass{article}
\begin{document}
\badcommand{test}
\end{document}""",

    "missing_brace": r"""\documentclass{article}
\begin{document}
\newcommand{\test}[1]{{\bf #1}

\section{\test{Complex Test}
More text here to ensure compilation fails
\end{document}"""
}

def test_error_cases():
    results = {}
    for name, content in error_templates.items():
        print(f"\nTesting error case: {name}")
        try:
            result = run_compilation(content)
            print(f"Unexpected success for {name}")
            results[name] = {"status": "success", "time": result}
        except Exception as e:
            print(f"Expected error caught: {str(e)}")
            results[name] = {"status": "error", "message": str(e)}

    print("\nError Test Results:")
    print("=" * 50)
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    test_error_cases()
