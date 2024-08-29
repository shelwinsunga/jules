'use client'

import { useState } from 'react';
import ProjectNav from "@/components/nav/project-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db } from '@/lib/constants';
import { tx, id } from '@instantdb/react';
import { CheckIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { v4 as uuidv4 } from 'uuid';
  
const templates = [
  { id: "blank", title: "Blank", image: "/placeholder.svg" },
  { id: "article", title: "Article", image: "/placeholder.svg" },
  { id: "report", title: "Report", image: "/placeholder.svg" },
  { id: "resume", title: "Resume", image: "/placeholder.svg" },
  { id: "letter", title: "Letter", image: "/placeholder.svg" },
  { id: "proposal", title: "Proposal", image: "/placeholder.svg" },
];


export default function NewDocument() {
    const [title, setTitle] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('blank');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        db.transact(
            tx.projects[id()].update({
                title: title,
                id: uuidv4(),
                template: selectedTemplate,
                last_compiled: new Date(),
                word_count: 0,
                page_count: 0,
                document_class: selectedTemplate,
                createdAt: new Date(),
            })
        );
        console.log({ title, selectedTemplate });
    };

    return (
        <div className="min-h-screen bg-background">
            <ProjectNav />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {templates.map((template) => (
                                <Card
                                    key={template.id}
                                    className={`cursor-pointer transition-all ${
                                        selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                                    }`}
                                >
                                    <CardContent className="p-4">
                                        <Button
                                            variant="ghost"
                                            className="w-full h-full p-0 hover:bg-transparent"
                                            onClick={() => setSelectedTemplate(template.id)}
                                        >
                                            <div className="space-y-2">
                                                <div className="relative aspect-[4/5] w-full">
                                                    <img
                                                        src={template.image}
                                                        alt={`${template.title} template`}
                                                        className="object-cover rounded-sm h-full w-full"
                                                    />
                                                    {selectedTemplate === template.id && (
                                                        <div className="absolute inset-0 bg-primary/20 flex items-center rounded-md justify-center">
                                                            <CheckIcon className="text-primary w-8 h-8" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-center">{template.title}</p>
                                            </div>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create a new Document</CardTitle>
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
                                <div className="space-y-2">
                                    <Label htmlFor="template">Template</Label>
                                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templates.map((template) => (
                                                <SelectItem key={template.id} value={template.id}>
                                                    {template.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="w-full">Create Document</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}