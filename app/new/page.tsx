'use client'

import { useState } from 'react'
import ProjectNav from '@/components/projects/project-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/constants'
import { tx, id } from '@instantdb/react'
import { CheckIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { templateContent } from '@/lib/constants/templates'
import { useFrontend } from '@/contexts/FrontendContext'

const templates = [
  { id: 'blank', title: 'Blank', image: '/blank_preview.webp' },
  { id: 'article', title: 'Article', image: '/article_preview.webp' },
  { id: 'report', title: 'Report', image: '/report_preview.webp' },
  { id: 'resume', title: 'Resume', image: '/resume_preview.webp' },
  { id: 'letter', title: 'Letter', image: '/letter_preview.webp' },
  { id: 'proposal', title: 'Proposal', image: '/proposal_preview.webp' },
]

type TemplateKey = keyof typeof templateContent

export default function NewDocument() {
  const { user } = useFrontend()
  const router = useRouter()
  const [title, setTitle] = useState('New Document')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('blank')
  const [titleError, setTitleError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('Title cannot be empty')
      return
    }
    setTitleError('')
    const newProjectId = id()

    const createFileStructure = () => {

      return [
        {
          name: 'main.tex',
          type: 'file',
          parent_id: null,
          content: templateContent[selectedTemplate],
          isExpanded: null,
          pathname: 'main.tex',
          user_id: user.id,
        },
      ]
    }

    const fileStructure = createFileStructure()

    db.transact([
      tx.projects[newProjectId].update({
        user_id: user?.id,
        title: title.trim(),
        project_content: templateContent[selectedTemplate], // remove later because its stored in files table
        template: selectedTemplate,
        last_compiled: new Date(),
        word_count: 0,
        page_count: 0,
        document_class: selectedTemplate,
        created_at: new Date(),
      }),
      ...fileStructure.map((node) =>
        tx.files[id()].update({
          user_id: user?.id,
          projectId: newProjectId,
          name: node.name,
          type: node.type,
          parent_id: node.parent_id,
          content: node.content || '',
          created_at: new Date(),
          isExpanded: node.isExpanded,
          isOpen: node.name === 'main.tex' ? true : false,
          main_file: node.name === 'main.tex' ? true : false,
          pathname: node.pathname,
        })
      ),
    ])

    router.push(`/project/${newProjectId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <ProjectNav />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <Button
                      variant="ghost"
                      className="w-full h-full p-0 hover:bg-transparent"
                      onClick={() => setSelectedTemplate(template.id as TemplateKey)}
                    >
                      <div className="space-y-2">
                        <div className="relative aspect-[4/5] w-full">
                          <img
                            src={template.image}
                            alt={`${template.title} template`}
                            className="object-cover rounded-sm h-full w-full"
                          />
                          {selectedTemplate === template.id && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center rounded-md justify-center">
                              <CheckIcon className="text-primary w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-center">{template.title}</p>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Create a new Document</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      if (titleError) setTitleError('')
                    }}
                    placeholder="Enter document title"
                    className={titleError ? 'border-red-500' : ''}
                  />
                  {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select value={selectedTemplate} onValueChange={(value: TemplateKey) => setSelectedTemplate(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Create Document
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
