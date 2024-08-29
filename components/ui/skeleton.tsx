import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-foreground/5 dark:bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
