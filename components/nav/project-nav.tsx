'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Settings, Sun, Moon } from 'lucide-react';
import { db } from '@/lib/constants';
import { useTheme } from 'next-themes';

export default function ProjectNav() {
  const { user } = db.useAuth();
  const { setTheme } = useTheme();
  
  return (
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link className="text-lg font-bold" href="#">
          Yomi
        </Link>
        {user && (
          <span className="ml-2 text-sm text-muted-foreground">
            / {user.email}
          </span>
        )}
      </div>
      
      <nav className="flex items-center space-x-4">
        <Link className="text-sm hover:text-muted-foreground transition-colors" href="#">
          Changelog
        </Link>
        <Link className="text-sm hover:text-muted-foreground transition-colors" href="#">
          Docs
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => db.auth.signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
};
