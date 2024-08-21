'use client'
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { useFrontend } from '@/contexts/FrontendContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface LatexRendererProps {
    latex: string;
}

export default function LatexRenderer({ latex }: LatexRendererProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchPdf = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('https://fastapi-production-6904.up.railway.app/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ latex: latex }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setPdfUrl(url);
        } catch (error) {
            console.error('Error fetching PDF:', error);
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        let debounceTimer: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (latex && latex.trim() !== '') {
                    fetchPdf();
                }
            }, 10);
        };

        resetTimer();

        return () => clearTimeout(debounceTimer);
    }, [latex]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-center items-center border-b shadow-sm py-2">
                <Button variant="outline" onClick={fetchPdf}>
                    Generate PDF
                </Button>
            </div>
            <ScrollArea className="flex-grow w-full h-full bg-foreground/5">
                {isLoading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <Skeleton className="w-full h-full max-w-4xl" />
                    </div>
                ) : error ? (
                    <Alert variant="destructive" className="m-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : pdfUrl ? (
                    <div className="flex justify-center w-full">
                        <Document
                            file={pdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            className="flex flex-col items-center w-full max-w-4xl"
                            loading={<Skeleton className="w-full h-full max-w-4xl" />}
                        >
                            {Array.from(
                                new Array(numPages),
                                (el, index) => (
                                    <Page
                                        key={`page_${index + 1}`}
                                        pageNumber={index + 1}
                                        className="mb-4 shadow-lg"
                                        width={Math.min(window.innerWidth - 80, 800)}
                                        loading={<Skeleton className="w-full h-[calc(100vh-80px)] mb-4" />}
                                    />
                                ),
                            )}
                        </Document>
                    </div>
                ) : null}
            </ScrollArea>
        </div>
    );
};
