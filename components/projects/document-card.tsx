'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CopyIcon,
  DownloadIcon,
  Edit2Icon,
  MoreVertical,
} from "lucide-react";
import { db } from "@/lib/constants"
import { tx } from '@instantdb/react';
import { XIcon } from "lucide-react"
import Link from 'next/link';

export default function DocumentCard({ doc, detailed = false }: { doc: any, detailed?: boolean }) {

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    db.transact([tx.projects[doc.id].delete()])
  }

  return (
    <Link href={`/project/${doc.id}`} passHref>
      <Card className="flex flex-col cursor-pointer hover:shadow-md hover:bg-foreground/5 hover:border-foreground/20 transition-shadow">
        <CardContent className="flex-grow p-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="text-primary">{doc.document_class || doc.template}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.preventDefault()}>
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.preventDefault()}>
                <DropdownMenuItem onClick={handleDelete}>
                  <XIcon className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit2Icon className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CopyIcon className="mr-2 h-4 w-4" />
                  <span>Duplicate</span>
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
                <img src="/placeholder.svg?height=100&width=80" alt={`Preview of ${doc.title}`} className="w-20 h-25 object-cover rounded" />
              </div>
              <div>
                <h3 className="font-semibold truncate">{doc.title}</h3>
                <p className="text-sm text-muted-foreground">Last compiled: {new Date(doc.last_compiled).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{doc.word_count} words | {doc.page_count} pages</p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-semibold truncate text-sm">{doc.title}</h3>
              <p className="text-xs text-muted-foreground">Compiled: {new Date(doc.last_compiled).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{doc.word_count} words | {doc.page_count} pages</p>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}