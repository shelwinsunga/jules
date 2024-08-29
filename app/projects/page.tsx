"use client"
import * as React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, PlusIcon } from "lucide-react"
import ProjectNav from "@/components/projects/project-nav"
import Link from "next/link"
import { db } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"
import DocumentCard from "@/components/projects/document-card"
import { useRouter } from "next/navigation"

export default function Projects() {
  const { user } = db.useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  if(!user) {
    router.push('/login');
    return;
  }
  
  const { isLoading, error, data } = db.useQuery({ projects: {
    $: {
      where: {
        user_id: user?.id || ''
      }
    }
  } });

  if (isLoading) return <ProjectSkeleton />

  const projects = data?.projects || [];
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const recentDocuments = projects.slice(0, 3);
  const allDocuments = projects;

  return (
    <div className="min-h-screen bg-background flex flex-col">
        <ProjectNav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div className="relative flex-grow mr-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              className="pl-10 py-5 text-sm w-full" 
              placeholder="Search LaTeX documents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="whitespace-nowrap" asChild>
            <Link href="/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Document
            </Link>
          </Button>
        </div>

        {allDocuments.length === 0 ? (
          <Card className="p-12 text-center">
            <h2 className="text-xl font-semibold mb-4">No Documents Yet</h2>
            <p className="text-muted-foreground mb-4">Get started by creating your first LaTeX document.</p>
            <Button asChild>
              <Link href="/new">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Your First Document
              </Link>
            </Button>
          </Card>
        ) : searchTerm ? (
          <section>
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProjects.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Recents</h2>
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
          </>
        )}
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © 2023 Your LaTeX Editor. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

const ProjectSkeleton = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <ProjectNav />
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div className="relative flex-grow mr-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <section className="mb-12">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardContent className="flex-grow p-4">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <Skeleton className="h-12 w-12 rounded" />
                  </div>
                  <div className="flex-grow">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardContent className="flex-grow p-4">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <Skeleton className="h-12 w-12 rounded" />
                  </div>
                  <div className="flex-grow">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>

    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-4 text-center">
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
    </footer>
  </div>
)