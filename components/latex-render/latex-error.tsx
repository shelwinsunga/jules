'use client'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

function parseLatexError(error: string): string {
  const errorMessages: { [key: string]: string } = {
    "Missing File: No main.tex file found": "Missing File: No main.tex file found\n\nDetails: The main.tex file is required for LaTeX compilation."
  };

  return errorMessages[error] || error;
}

export default function LatexError({ error }: { error: string }) {
  const parsedError = parseLatexError(error);

  return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="text-red-600 dark:text-red-200">LaTeX Error</AlertTitle>
      <AlertDescription className="max-h-[85vh] overflow-y-auto">
        <pre className="whitespace-pre-wrap dark:text-red-500 font-mono text-sm">{parsedError}</pre>
      </AlertDescription>
    </Alert>
  )
}