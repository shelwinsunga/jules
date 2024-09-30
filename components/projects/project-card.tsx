'use client'
import { useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CopyIcon, DownloadIcon, Edit2Icon, MoreVertical, XIcon } from 'lucide-react'
import { db } from '@/lib/constants'
import { tx } from '@instantdb/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Link from 'next/link'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { id } from '@instantdb/react'
import Image from 'next/image'
import { savePdfToStorage, savePreviewToStorage } from '@/lib/utils/db-utils'
import { createPathname } from '@/lib/utils/client-utils'
import { getAllProjectFiles } from '@/hooks/data'
import { useFrontend } from '@/contexts/FrontendContext';
import { deleteFileFromStorage } from '@/lib/utils/db-utils';

export default function ProjectCard({ project, detailed = false }: { project: any; detailed?: boolean }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(project.title)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [imageURL, setImageURL] = useState('')
  const [imageError, setImageError] = useState(false)
  const { user } = useFrontend();
  const { email, id: userId } = user
  const [downloadURL, setDownloadURL] = useState('');
  const { data: files} = getAllProjectFiles(project.id, userId)

  useEffect(() => {
    if (email && userId) {
      const pathname = createPathname(userId, project.id)
      if (project.cachedPdfExpiresAt < Date.now() || project.cachedPreviewExpiresAt < Date.now()) {
        const expiresAt = Date.now() + 30 * 60 * 1000;
        db.storage.getDownloadUrl(pathname + 'main.pdf').then((url) => {
          db.transact(tx.projects[project.id].update({ cachedPdfUrl: url, cachedPdfExpiresAt: expiresAt })).then(() => {
            db.storage.getDownloadUrl(pathname + 'main.pdf').then((validatedUrl) => {
              setDownloadURL(validatedUrl)
            })
          })
        })
        db.storage.getDownloadUrl(pathname + 'preview.webp').then((url) => {
          db.transact(tx.projects[project.id].update({ cachedPreviewUrl: url, cachedPreviewExpiresAt: expiresAt })).then(() => {
            db.storage.getDownloadUrl(pathname + 'preview.webp').then((validatedUrl) => {
              setImageURL(validatedUrl)
            })
          })
        })
      } else {
        setImageURL(project.cachedPreviewUrl)
        setDownloadURL(project.cachedPdfUrl)
      }
    }
  }, [project.id, project.title, email, userId])

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation();

    db.transact([tx.projects[project.id].delete()]);
    if (files && files.files) {
      files.files.map((file) => db.transact([tx.files[file.id].delete()]))
    }
    deleteFileFromStorage(`${userId}/${project.id}/main.pdf`)
    deleteFileFromStorage(`${userId}/${project.id}/preview.webp`)
    setIsDropdownOpen(false)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDialogOpen(true)
    setIsDropdownOpen(false)
  }

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDropdownOpen(false);
    if (!files) {
      return;
    }

    const newProjectId = id();

    // Create a mapping of old file IDs to new file IDs
    const fileIdMapping = new Map();
    files.files.forEach((file) => {
      fileIdMapping.set(file.id, id());
    });

    const fileContents = files.files.map((file) => {
      return {
        id: fileIdMapping.get(file.id),
        name: file.name,
        content: file.content,
        pathname: file.pathname,
        project_id: newProjectId,
        created_at: new Date(),
        parent_id: file.parent_id ? fileIdMapping.get(file.parent_id) : null,
        updated_at: new Date(),
        isOpen: file.isOpen,
        isExpanded: file.isExpanded,
        type: file.type,
        main_file: file.main_file,
      }
    })
    
    if (downloadURL) {
      try {
        const response = await fetch(downloadURL)
        const blob = await response.blob()
        const pathname = createPathname(userId, newProjectId)
        await savePreviewToStorage(blob, pathname + 'preview.webp', newProjectId)
        await savePdfToStorage(blob, pathname + 'main.pdf', newProjectId)
      } catch (error) {
        console.error('Error downloading file:', error)
      }
    }

    db.transact([
      tx.projects[newProjectId].update({
        title: `${project.title} (Copy)`,
        project_content: project.project_content,
        document_class: project.document_class,
        template: project.template,
        user_id: project.user_id,
        created_at: new Date(),
        last_compiled: new Date(),
        word_count: 0,
        page_count: 0,
        cachedPdfUrl: project.cachedPdfUrl,
        cachedPreviewUrl: project.cachedPreviewUrl,
        cachedPdfExpiresAt: project.cachedPdfExpiresAt,
        cachedPreviewExpiresAt: project.cachedPreviewExpiresAt,
      }),
      ...fileContents.map((file) =>
        tx.files[file.id].update({
          user_id: userId,
          projectId: newProjectId,
          name: file.name,
          pathname: file.pathname,
          content: file.content,
          created_at: new Date(),
          updated_at: new Date(),
          isOpen: file.isOpen,
          isExpanded: file.isExpanded,
          type: file.type,
          main_file: file.main_file,
          parent_id: file.parent_id,
        })
      )
    ])
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (downloadURL) {
      fetch(downloadURL)
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = `${project.title}.pdf`
          link.click()
          window.URL.revokeObjectURL(blobUrl)
        })
        .catch((error) => {
          console.error('Error downloading file:', error)
        })
    } else {
      console.error('Download URL is not available')
    }
    setIsDropdownOpen(false)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setIsDropdownOpen(false)
    }
  }

  return (
    <>
      <Link href={`/project/${project.id}`} passHref>
        <Card className="flex flex-col overflow-hidden">
          <div className="relative">
            <Image
              src={!imageError && imageURL ? imageURL : '/placeholder.svg'}
              alt={`Preview of ${project.title}`}
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
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
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
                  <DropdownMenuItem onClick={handleDownload}>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardContent className="flex-grow p-4">
            <h3 className="font-semibold truncate text-lg mb-1">{project.title}</h3>
            <p className="text-sm text-muted-foreground mb-1">
              {project.last_compiled 
                ? `Last updated: ${getTimeAgo(new Date(project.last_compiled))}`
                : "Not compiled yet"}
            </p>
          </CardContent>
          {detailed && (
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">
                Open
              </Button>
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  db.transact([tx.projects[project.id].update({ title: newTitle })])
                  handleDialogOpenChange(false)
                }
              }} 
            />
          </div>
          <DialogFooter>
            <Button onClick={() => handleDialogOpenChange(false)}>Cancel</Button>
            <Button
              onClick={() => {
                db.transact([tx.projects[project.id].update({ title: newTitle })])
                handleDialogOpenChange(false)
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}