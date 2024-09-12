import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import ProjectNav from '@/components/projects/project-nav'

export default function ProjectSkeleton() {
  return (
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
    </div>
  )
}
