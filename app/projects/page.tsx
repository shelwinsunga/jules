'use client'
import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon, PlusIcon } from 'lucide-react'
import ProjectNav from '@/components/projects/project-nav'
import Link from 'next/link'
import ProjectSkeleton from '@/components/projects/project-skeleton'
import ProjectCard from '@/components/projects/project-card'
import { useFrontend } from '@/contexts/FrontendContext'
import { getAllProjects } from '@/hooks/data'

export default function Projects() {
  const { user } = useFrontend();
  const [searchTerm, setSearchTerm] = useState('');
  const { isLoading, error, data } = getAllProjects(user.id);

  if (isLoading) return <ProjectSkeleton />

  const projects = data?.projects || []
  const filteredProjects = projects.filter((project) => project.title.toLowerCase().includes(searchTerm.toLowerCase()))
  const recentProjects = projects.slice(0, 3)
  const allProjects = projects

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProjectNav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div className="relative flex-grow mr-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10 py-5 text-sm w-full"
              placeholder="Search Jules Projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="whitespace-nowrap" asChild>
            <Link href="/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Project
            </Link>
          </Button>
        </div>

        {allProjects.length === 0 ? (
          <Card className="p-12 text-center">
            <h2 className="text-xl font-semibold mb-4">No Projects Yet</h2>
            <p className="text-muted-foreground mb-4">Get started by creating your first LaTeX project.</p>
            <Button asChild>
              <Link href="/new">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Your First Project
              </Link>
            </Button>
          </Card>
        ) : searchTerm ? (
          <section>
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Recents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} detailed={true} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">All Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
