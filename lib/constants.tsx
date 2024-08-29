'use client'
import { init } from '@instantdb/react';

export const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID as string;
export const db = init({ appId: APP_ID });

export const defaultContent = `\\documentclass{article}
\\begin{document}
Hello, world! This is a simple LaTeX document.

\\section{A Section}
This is a section in our document.

\\subsection{A Subsection}
This is a subsection with some math: $E = mc^2$
\\end{document}`