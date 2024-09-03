import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function LoadingSideNav() {
  return (
    <div className="w-full h-full flex flex-col bg-muted/25">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="p-4 flex space-x-2">
        <Skeleton className="flex-grow h-9" />
        <Skeleton className="h-9 w-9" />
      </div>

      <div className="flex-grow overflow-auto p-2">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-6 w-3/5 mb-2" />
        <Skeleton className="h-6 w-4/5 mb-2" />
      </div>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  )
}
