'use server'

import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createStreamableValue } from 'ai/rsc'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai';

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

export async function completion(input: string) {
  const result = await generateText({
    model: openai('gpt-4o-mini'),
    system:
      'You are an AI code assistant that provides accurate and context-aware code completions to help users write code. Given the current code the user is working on, predict the next code they might write, considering syntax, context, and best coding practices. Ensure that the completion is syntactically correct and handles any potential edge cases. The result should be ONLY code that continues from the user\'s input and matches their intent, without any additional explanations or text.',
    prompt: input,
  });

  return result.text;
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
