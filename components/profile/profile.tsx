'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { db } from '@/lib/constants'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter()
  const { user } = db.useAuth()

  const handleSignOut = () => {
    db.auth.signOut()
    router.push('/')
  }

  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500" />
                </AvatarFallback>
              </Avatar>
              <p className="text-xs font-medium">{user?.email}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="flex flex-col space-y-4 p-2">
              <Button variant="outline" className="w-full" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
