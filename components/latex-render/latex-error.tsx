'use client'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function LatexError({ error }: { error: string }) {
    return (
        <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                <pre className="whitespace-pre-wrap">{error}</pre>
            </AlertDescription>
        </Alert>
    );
}