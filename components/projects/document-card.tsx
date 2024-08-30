'use client'
import { useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  XIcon
} from "lucide-react";
import { db } from "@/lib/constants"
import { tx } from '@instantdb/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import Link from 'next/link';
import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { id } from "@instantdb/react";
import Image from 'next/image';
import { generateProjectPathname } from '@/lib/client-utils';

export default function DocumentCard({ doc, detailed = false }: { doc: any, detailed?: boolean }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(doc.title);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [imageError, setImageError] = useState(false);
  const { email, id: userId } = db.useAuth().user || {};

  useEffect(() => {
    if (email && userId) {
      const pathname = generateProjectPathname(email, userId, doc.title, doc.id);
      
      db.storage
        .getDownloadUrl(pathname + 'preview.webp')
        .then((signedUrl) => setImageURL(signedUrl))
        .catch((err) => {
          console.error('Failed to get file URL', err);
          setImageError(true);
        });
    }
  }, [doc.id, doc.title, email, userId]);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    db.transact([tx.projects[doc.id].delete()])
    setIsDropdownOpen(false);
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDialogOpen(true);
    setIsDropdownOpen(false);
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    db.transact([
      tx.projects[id()].update({
        title: `${doc.title} (Copy)`,
        project_content: doc.project_content,
        document_class: doc.document_class,
        template: doc.template,
        user_id: doc.user_id,
        created_at: new Date(),
        last_compiled: new Date(),
        word_count: 0,
        page_count: 0
      })
    ]);
    setIsDropdownOpen(false);
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setIsDropdownOpen(false);
    }
  }

  return (
    <>
      <Link href={`/project/${doc.id}`} passHref>
        <Card className="flex flex-col overflow-hidden">
          <div className="relative">
            <Image 
              src={!imageError && imageURL ? imageURL : "/placeholder.svg"} 
              alt={`Preview of ${doc.title}`} 
              className="w-full h-40 object-cover" 
              width={300} 
              height={160} 
              loader={({ src }) => src} 
              onError={() => setImageError(true)}
            />
            <div className="absolute top-2 right-2">
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <DropdownMenuItem onClick={handleDelete}>
                    <XIcon className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit2Icon className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <CopyIcon className="mr-2 h-4 w-4" />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Add download functionality here
                    setIsDropdownOpen(false);
                  }}>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardContent className="flex-grow p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-primary">{doc.document_class || doc.template}</Badge>
            </div>
            <h3 className="font-semibold truncate text-lg mb-1">{doc.title}</h3>
            <p className="text-sm text-muted-foreground mb-1">Last compiled: {new Date(doc.last_compiled).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{doc.word_count} words | {doc.page_count} pages</p>
          </CardContent>
          {detailed && (
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">Open</Button>
            </CardFooter>
          )}
        </Card>
      </Link>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document Title</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new title"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => handleDialogOpenChange(false)}>Cancel</Button>
            <Button onClick={() => {
              db.transact([tx.projects[doc.id].update({ title: newTitle })]);
              handleDialogOpenChange(false);
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}