'use server'

import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createStreamableValue } from 'ai/rsc'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function generate(input: string) {
  const stream = createStreamableValue({ content: '', isComplete: false });
  
  (async () => {
    const { textStream } = await streamText({
      model: anthropic('claude-3-5-sonnet-20240620'),
      system:
        'Imagine you are embedded in a latex editor. You only write latex. You do not write anything else or converse; you only write latex.' +
        "Do not write in backticks like this: ```latex ...```. Write your latex directly. You must consider the context of where you're starting from and ending from. For example, if you start in the middle of the document, would not write documentclass{article} or \begin{document} and add packages. You must consider the context of where you're starting from and ending from.",
      prompt: input,
    })

    for await (const delta of textStream) {
      stream.update({ content: delta, isComplete: false })
    }

    stream.update({ content: '', isComplete: true })
    stream.done()
  })()

  return { output: stream.value }
}


const completionSystemPrompt = `
    You are an intelligent LaTeX completion assistant. Your task is to suggest
    the next line or block of LaTeX code based on the context provided. Focus on
    completing environments, commands, or document structures. Provide concise,
    syntactically correct, and idiomatic LaTeX code. When given a chunk of code,
    rewrite it with your suggestion to facilitate easy comparison and diffing.

    Examples:
    1. Input: \\begin{theorem}
               Let $f$ be a continuous function on [a,b]. Then
       Output: \\begin{theorem}
               Let $f$ be a continuous function on [a,b]. Then
               $f$ attains its maximum and minimum values on [a,b].
               \\end{theorem}

    2. Input: \\begin{itemize}
               \\item First point
               \\item Second point
               \\item Third point
               \\end{itemize}
       Output: \\begin{itemize}
               \\item First point
               \\item Second point
               \\item Third point
               \\end{itemize}

    3. Input: Let x be a real number such that x^2 + 2x + 1 = 0.
       Output: Let $x$ be a real number such that $x^2 + 2x + 1 = 0$.

    4. Input: \\begin{figure}[htbp]
               \\centering
               \\includegraphics[width=0.8\\textwidth]{example_image}
       Output: \\begin{figure}[htbp]
               \\centering
               \\includegraphics[width=0.8\\textwidth]{example_image}
               \\caption{A descriptive caption for the example image.}
               \\label{fig:example}
               \\end{figure}

    5. Input: \\begin{tabular}{|c|c|}
               \\hline
               Variable & Value \\\\
               \\hline
       Output: \\begin{tabular}{|c|c|}
               \\hline
               Variable & Value \\\\
               \\hline
               x & 10 \\\\
               y & 20 \\\\
               z & 30 \\\\
               \\hline
               \\end{tabular}

    6. Input: \\begin{algorithm}
               \\caption{Bubble Sort}
               \\begin{algorithmic}[1]
               \\Procedure{BubbleSort}{$A$}
       Output: \\begin{algorithm}
               \\caption{Bubble Sort}
               \\begin{algorithmic}[1]
               \\Procedure{BubbleSort}{$A$}
                   \\For{$i \\gets 1$ to $n$}
                       \\For{$j \\gets 1$ to $n-i$}
                           \\If{$A[j] > A[j+1]$}
                               \\State Swap $A[j]$ and $A[j+1]$
                           \\EndIf
                       \\EndFor
                   \\EndFor
               \\EndProcedure
               \\end{algorithmic}
               \\end{algorithm}
`

export async function completion(input: string) {
  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    system: completionSystemPrompt,
    schema: z.object({
      latex: z.string(),
    }),
    prompt: input,
  });

  return result.object.latex;
}

// 'use server';

// import { createStreamableValue } from 'ai/rsc';

// export async function generate(input: string) {
//   const stream = createStreamableValue({content: '', isComplete: false});

//   (async () => {
//     const fakeLatexContent = `section{Introduction}
// This is a sample introduction to demonstrate the fake stream.

// \\subsection{Background}
// Here's some background information about the topic.

// \\section{Methodology}
// We used the following methods in our study:
// \\begin{itemize}
//   \\item Method 1
//   \\item Method 2
//   \\item Method 3
// \\end{itemize}

// \\section{Results}
// Our results show that...`;

//     for (const char of fakeLatexContent) {
//       await new Promise(resolve => setTimeout(resolve, 1)); // Simulate delay
//       stream.update({content: char, isComplete: false});
//     }

//     stream.update({content: '', isComplete: true});
//     stream.done();
//   })();

//   return { output: stream.value};
// }
