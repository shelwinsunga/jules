'use client'
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { useFrontend } from '@/contexts/FrontendContext';

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
    
    const fetchPdf = async () => {
        const response = await fetch('http://127.0.0.1:8000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latex: latex }),
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        setPdfUrl(url); 
    }

    useEffect(() => {
        if (latex && latex.trim() !== '') {
            fetchPdf();
        }
    }, [latex]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-center items-center border-b shadow-sm py-2    ">
                <Button variant="outline" onClick={fetchPdf}>
                    Generate PDF
                </Button>
            </div>
            {pdfUrl && (
                <div className="flex-grow overflow-auto w-full h-full">
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="flex flex-col items-center w-full h-full"
                    >
                        {Array.from(
                            new Array(numPages),
                            (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    className="mb-4 shadow-lg"
                                    width={window.innerWidth / 2 - 40}
                                    height={window.innerHeight - 80}
                                />
                            ),
                        )}
                    </Document>
                </div>
            )}
        </div>
    );
};
