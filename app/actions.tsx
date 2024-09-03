'use server'

import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createStreamableValue } from 'ai/rsc'
import { anthropic } from '@ai-sdk/anthropic'
export async function generate(input: string) {
  const stream = createStreamableValue({ content: '', isComplete: false })

  ;(async () => {
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
