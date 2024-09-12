'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { LogOut } from 'lucide-react'
import { db } from '@/lib/constants'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { useRouter } from 'next/navigation'

export default function ProjectNav() {
  const router = useRouter()
  const { user } = db.useAuth()

  const handleSignOut = () => {
    db.auth.signOut()
    router.push('/')
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link className="text-lg font-bold" href="/">
            Jules
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          <Link className="text-sm text-muted-foreground" href="/projects">
            Projects
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="cursor-pointer w-8 h-8">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500" />
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-64 sm:w-72 p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b">
                  <Avatar className="w-8 h-8">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500" />
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <ModeToggle />
                </div>
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </nav>
      </div>
    </header>
  )
}
