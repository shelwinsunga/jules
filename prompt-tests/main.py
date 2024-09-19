import ell

@ell.simple(model="gpt-4o-mini")
def completion(code: str):
    r"""
    You are an intelligent LaTeX completion assistant. Your task is to suggest
    the next line or block of LaTeX code based on the context provided. Focus on
    completing environments, commands, or document structures. Provide concise,
    syntactically correct, and idiomatic LaTeX code. When given a chunk of code,
    rewrite it with your suggestion to facilitate easy comparison and diffing.

    Examples:
    1. Input: \begin{theorem}
               Let $f$ be a continuous function on [a,b]. Then
       Output: \begin{theorem}
               Let $f$ be a continuous function on [a,b]. Then
               $f$ attains its maximum and minimum values on [a,b].
               \end{theorem}

    2. Input: \begn{itemize}
               \itm First point
               \item Second point
               \itm Third point
               \end{itemize}
       Output: \begin{itemize}
               \item First point
               \item Second point
               \item Third point
               \end{itemize}

    3. Input: Let x be a real number such that x^2 + 2x + 1 = 0.
       Output: Let $x$ be a real number such that $x^2 + 2x + 1 = 0$.

    5. Input: \begin{figure}[htbp]
               \centering
               \includegraphics[width=0.8\textwidth]{example_image}
       Output: \begin{figure}[htbp]
               \centering
               \includegraphics[width=0.8\textwidth]{example_image}
               \caption{A descriptive caption for the example image.}
               \label{fig:example}
               \end{figure}

    4. Input: \begin{tabular}{|c|c|}
               \hline
               Variable & Value \\
               \hline
       Output: \begin{tabular}{|c|c|}
               \hline
               Variable & Value \\
               \hline
               x & 10 \\
               y & 20 \\
               z & 30 \\
               \hline
               \end{tabular}

    4. Input: \begin{algorithm}
               \caption{Bubble Sort}
               \begin{algorithmic}[1]
               \Procedure{BubbleSort}{$A$}
       Output: \begin{algorithm}
               \caption{Bubble Sort}
               \begin{algorithmic}[1]
               \Procedure{BubbleSort}{$A$}
                   \For{$i \gets 1$ to $n$}
                       \For{$j \gets 1$ to $n-i$}
                           \If{$A[j] > A[j+1]$}
                               \State Swap $A[j]$ and $A[j+1]$
                           \EndIf
                       \EndFor
                   \EndFor
               \EndProcedure
               \end{algorithmic}
               \end{algorithm}
    """

    return f"{code}"

# Example 1: Completing a document structure
greeting = completion(r"\documentclass{article}")
print(greeting)
# Expected output:
# \documentclass{article}
# \usepackage{amsmath}
# \usepackage{graphicx}
# \begin{document}
# \title{Your Title Here}
# \author{Your Name}
# \maketitle

# Example 2: Completing an environment
equation = completion(r"\begin{equation}")
print(equation)
# Expected output:
# \begin{equation}
#     E = mc^2
# \end{equation}

# Example 3: Completing a command
figure = completion(r"\includegraphics[width=0.8\textwidth]{")
print(figure)
# Expected output:
# \includegraphics[width=0.8\textwidth]{figure_name.png}
# \caption{Description of the figure}
# \label{fig:figure_label}



# Example 4: Completing a table
table = completion(r"\begin{tabular}{|c|c|c|}")
print(table)
# Expected output:
# \begin{tabular}{|c|c|c|}
#     \hline
#     Column 1 & Column 2 & Column 3 \\
#     \hline
#     Data 1 & Data 2 & Data 3 \\
#     Data 4 & Data 5 & Data 6 \\
#     \hline
# \end{tabular}

# Example 5: Completing a theorem environment
theorem = completion(r"\begin{theorem}")
print(theorem)
# Expected output:
# \begin{theorem}
#     Let $n$ be a positive integer. If $n$ is even, then $n^2$ is even.
# \end{theorem}

# Example 6: Completing a bibliography entry
bibentry = completion(r"\bibitem{smith2023}")
print(bibentry)
# Expected output:
# \bibitem{smith2023} Smith, J. (2023). "An Interesting Paper Title." 
# Journal of Important Research, 42(3), 123-145.

# Example 7: Completing a list environment
itemize = completion(r"\begin{itemize}")
print(itemize)
# Expected output:
# \begin{itemize}
#     \item First item
#     \item Second item
#     \item Third item
# \end{itemize}



# Example 8: Completing a mathematical expression
math = completion(r"\[ \int_{0}^{\infty}")
print(math)
# Expected output:
# \[ \int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2} \]
