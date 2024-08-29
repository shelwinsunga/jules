'use client'

import { useState } from 'react';
import ProjectNav from "@/components/nav/project-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function NewDocument() {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log({ title });
    };

    return (
        <div className="min-h-screen bg-background">
            <ProjectNav />
            <main className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Create New LaTeX Document</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter document title"
                                />
                            </div>
                            <Button type="submit" className="w-full">Create Document</Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}