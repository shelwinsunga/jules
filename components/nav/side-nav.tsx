'use client'
import { useState } from 'react'
import FileTree from '@/components/file-tree/file-tree'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, HelpCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function SideNav() {
    const [projectName, setProjectName] = useState('My Project')

    return (
        <div className="w-full h-full flex flex-col  bg-muted/25">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">AnyTeX</span>
                    <span className="text-sm text-muted-foreground">{projectName}</span>
                </div>
                <ModeToggle />
            </div>
            
            <div className="p-4 flex space-x-2">
                <Input placeholder="Search files..." className="flex-grow" />
                <Button size="icon">
                    <Search className="h-4 w-4" />
                </Button>
            </div>
            
            <ScrollArea className="flex-grow">
                <FileTree initialData={[]} />
            </ScrollArea>
            
            <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Avatar>
                            <AvatarImage src="/avatar.png" />
                            <AvatarFallback>UN</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">User Name</p>
                            <p className="text-xs text-muted-foreground">user@example.com</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <HelpCircle className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
