import * as React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { FileIcon, SearchIcon, PlusIcon, BookOpenIcon, FileTextIcon, GraduationCapIcon, MoreVertical, Edit2Icon, CopyIcon, DownloadIcon } from "lucide-react"
import ProjectNav from "@/components/nav/project-nav"

export default function Projects() {
  const recentDocuments = [
    { id: 1, name: "thesis-chapter-3.tex", lastCompiled: "2 hours ago", preview: "/placeholder.svg?height=100&width=80", wordCount: 2500, pageCount: 15, documentClass: "report" },
    { id: 2, name: "conference-paper.tex", lastCompiled: "Yesterday", preview: "/placeholder.svg?height=100&width=80", wordCount: 3000, pageCount: 8, documentClass: "article" },
    { id: 3, name: "research-proposal.tex", lastCompiled: "3 days ago", preview: "/placeholder.svg?height=100&width=80", wordCount: 1800, pageCount: 5, documentClass: "article" },
  ]

  const allDocuments = [
    ...recentDocuments,
    { id: 4, name: "literature-review.tex", lastCompiled: "1 week ago", preview: "/placeholder.svg?height=100&width=80", wordCount: 5000, pageCount: 20, documentClass: "report" },
    { id: 5, name: "journal-submission.tex", lastCompiled: "2 weeks ago", preview: "/placeholder.svg?height=100&width=80", wordCount: 4500, pageCount: 12, documentClass: "article" },
    { id: 6, name: "presentation-slides.tex", lastCompiled: "1 month ago", preview: "/placeholder.svg?height=100&width=80", wordCount: 1000, pageCount: 15, documentClass: "beamer" },
  ]

  const DocumentCard = ({ doc, detailed = false }: { doc: any, detailed?: boolean }) => (
    <Card className="flex flex-col">
      <CardContent className="flex-grow p-4">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-primary">{doc.documentClass}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit2Icon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CopyIcon className="mr-2 h-4 w-4" />
                <span>Copy</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DownloadIcon className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {detailed ? (
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <img src={doc.preview} alt={`Preview of ${doc.name}`} className="w-20 h-25 object-cover rounded" />
            </div>
            <div>
              <h3 className="font-semibold truncate">{doc.name}</h3>
              <p className="text-sm text-muted-foreground">Last compiled: {doc.lastCompiled}</p>
              <p className="text-sm text-muted-foreground">{doc.wordCount} words | {doc.pageCount} pages</p>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-semibold truncate text-sm">{doc.name}</h3>
            <p className="text-xs text-muted-foreground">Compiled: {doc.lastCompiled}</p>
            <p className="text-xs text-muted-foreground">{doc.wordCount} words | {doc.pageCount} pages</p>
          </>
        )}
      </CardContent>
      {detailed && (
        <CardFooter className="p-4 pt-0">
          <Button variant="outline" className="w-full">Open</Button>
        </CardFooter>
      )}
    </Card>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
          <ProjectNav />
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div className="relative flex-grow mr-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input className="pl-10 py-5 text-sm w-full" placeholder="Search LaTeX documents..." />
          </div>
          <Button className="whitespace-nowrap">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Document
          </Button>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Recently Compiled</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDocuments.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} detailed={true} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">All Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allDocuments.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © 2023 Your LaTeX Editor. All rights reserved.
        </div>
      </footer>
    </div>
  )
}