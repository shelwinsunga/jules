import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, SearchIcon } from "lucide-react"

export default function Projects() {
  const projects = [
    { id: 1, name: "Project Alpha", description: "A cutting-edge web application", lastUpdated: "2 days ago" },
    { id: 2, name: "Project Beta", description: "Mobile app for productivity", lastUpdated: "1 week ago" },
    { id: 3, name: "Project Gamma", description: "Data visualization dashboard", lastUpdated: "3 days ago" },
    { id: 4, name: "Project Delta", description: "E-commerce platform", lastUpdated: "1 day ago" },
    { id: 5, name: "Project Epsilon", description: "AI-powered chatbot", lastUpdated: "4 days ago" },
    { id: 6, name: "Project Zeta", description: "Social media analytics tool", lastUpdated: "2 weeks ago" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Project Selection</h1>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input className="pl-8" placeholder="Search projects..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Last updated: {project.lastUpdated}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Open Project</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © 2023 Your Company Name. All rights reserved.
        </div>
      </footer>
    </div>
  )
}