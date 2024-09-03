import { Skeleton } from '@/components/ui/skeleton'

const FileTreeSkeleton = () => {
  return (
    <div className="flex flex-col grow h-full shadow-sm w-full">
      <div className="flex items-center justify-between px-4 border-b py-2">
        <Skeleton className="h-5 w-16" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
      <div className="flex-grow w-full overflow-hidden py-1 px-4">
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
          <div className="pl-4 space-y-2">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileTreeSkeleton
