'use client'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

function parseLatexError(error: string): string {
  if (error.includes("Missing File: No main.tex file found")) {
    return "Missing File: No main.tex file found\n\nDetails: The main.tex file is required for LaTeX compilation.";
  }
  const lines = error.split('\n')
  const relevantLines = lines.filter(
    (line) => line.startsWith('!') || line.match(/^l\.\d+/) || line.trim().startsWith('?')
  )
  return relevantLines.join('\n')
}

export default function LatexError({ error }: { error: string }) {
  console.log("LatexError", error)
  const parsedError = parseLatexError(error);

  return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="text-red-200">LaTeX Error</AlertTitle>
      <AlertDescription>
        <pre className="whitespace-pre-wrap dark:text-red-500 font-mono text-sm">{parsedError}</pre>
      </AlertDescription>
    </Alert>
  )
}