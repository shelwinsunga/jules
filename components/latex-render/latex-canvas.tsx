import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Document, Page, pdfjs } from 'react-pdf'
import { Skeleton } from "@/components/ui/skeleton"

export default function LatexCanvas({
  pdfUrl,
  onDocumentLoadSuccess,
  options,
  isDocumentReady,
  numPages,
  scale
}: {
  pdfUrl: string;
  onDocumentLoadSuccess: (result: { numPages: number }) => void;
  options: any;
  isDocumentReady: boolean;
  numPages: number;
  scale: number;
}) {
  return (
    <ScrollArea className="flex-grow w-full h-full bg-foreground/5">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center w-full"
        loading={<Skeleton className="w-full h-full max-w-4xl" />}
        options={options}
      >
        {isDocumentReady &&
          Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              className="mb-4 shadow-lg"
              scale={scale}
              width={Math.min(window.innerWidth - 80, 800)}
              loading={<Skeleton className="w-full h-[calc(100vh-80px)] mb-4" />}
            />
          ))}
      </Document>
      <ScrollBar orientation="horizontal" />
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}