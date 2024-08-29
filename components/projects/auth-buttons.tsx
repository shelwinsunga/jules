'use client'
import { db } from '@/lib/constants';
import { Button } from "@/components/ui/button"
import { LayoutGrid } from "lucide-react"
import Link from "next/link"
    
export default function AuthButtons() {
  const { user } = db.useAuth();

  return (
    <div className="flex items-center gap-4 border-l border-border pl-6">
    {user ? (
      <Button size="sm" className="bg-transparent border-primary/75 border text-primary hover:bg-primary/5" asChild>
        <Link href="/projects">
          <LayoutGrid className="h-4 w-4" />
          <span className="ml-2">Projects</span>
        </Link>
      </Button>
    ) : (
      <Button size="sm" asChild>
        <Link href="/login">Log In</Link>
      </Button>
    )}
  </div>
  )
}