'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';

export async function generate(input: string) {
  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = await streamText({
      model: openai('gpt-4o'),
      system: 'Imagine you are embedded in a latex editor. You only write latex. You do not write anything else or converse; you only write latex.'
      + 'Do not write in backticks like this: ```latex ...```. Write your latex directly. You must consider the context of where you\'re starting from and ending from. For example, if you start in the middle of the document, would not write \documentclass{article} or \begin{document} and add packages. You must consider the context of where you\'re starting from and ending from.',
      prompt: input,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}