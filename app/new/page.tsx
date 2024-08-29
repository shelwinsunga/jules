'use client'

import { useState } from 'react';
import ProjectNav from "@/components/nav/project-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function NewDocument() {
    const [template, setTemplate] = useState('');
    const [title, setTitle] = useState('');

    const templates = [
        { value: 'article', label: 'Article', description: 'For short academic papers' },
        { value: 'report', label: 'Report', description: 'For longer technical documents' },
        { value: 'book', label: 'Book', description: 'For multi-chapter documents' },
        { value: 'beamer', label: 'Beamer', description: 'For presentations' },
        { value: 'letter', label: 'Letter', description: 'For formal correspondence' },
        { value: 'resume', label: 'Resume', description: 'For job applications' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log({ template, title });
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
                                <Label htmlFor="template">Template</Label>
                                <Select value={template} onValueChange={setTemplate}>
                                    <SelectTrigger id="template">
                                        <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>
                                                <div className="flex flex-col">
                                                    <span>{t.label}</span>
                                                    <span className="text-xs text-muted-foreground">{t.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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