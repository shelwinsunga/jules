// latexSuggestions.ts

export const latexSuggestions = [
    {
      label: '\\textbf',
      insertText: '\\textbf{$1}$0',
      documentation: 'Bold text'
    },
    {
      label: '\\textit',
      insertText: '\\textit{$1}$0',
      documentation: 'Italic text'
    },
    {
      label: '\\begin{equation}',
      insertText: '\\begin{equation}\n\t$1\n\\end{equation}$0',
      documentation: 'Equation environment'
    },
    {
      label: '\\frac',
      insertText: '\\frac{$1}{$2}$0',
      documentation: 'Fraction'
    },
    {
      label: '\\sum',
      insertText: '\\sum_{$1}^{$2}$0',
      documentation: 'Summation'
    },
  ];