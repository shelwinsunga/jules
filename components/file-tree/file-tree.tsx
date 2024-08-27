'use client'
import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

type FileTreeItem = {
    name: string;
    type: 'file' | 'folder';
    children?: FileTreeItem[];
};

const mockFileTree: FileTreeItem[] = [
    {
        name: 'src',
        type: 'folder',
        children: [
            {
                name: 'components', type: 'folder', children: [
                    { name: 'Button.tsx', type: 'file' },
                    { name: 'Input.tsx', type: 'file' },
                ]
            },
            {
                name: 'pages', type: 'folder', children: [
                    { name: 'index.tsx', type: 'file' },
                    { name: 'about.tsx', type: 'file' },
                ]
            },
            {
                name: 'styles', type: 'folder', children: [
                    { name: 'globals.css', type: 'file' },
                ]
            },
        ],
    },
    { name: 'package.json', type: 'file' },
    { name: 'tsconfig.json', type: 'file' },
];

const FileTreeNode: React.FC<{ item: FileTreeItem; depth: number; onToggle: (path: string) => void; openFolders: Set<string> }> = ({ item, depth, onToggle, openFolders }) => {
    const path = `${depth}-${item.name}`;
    const isOpen = openFolders.has(path);

    const toggleOpen = () => {
        if (item.type === 'folder') {
            onToggle(path);
        }
    };

    return (
        <div style={{ marginLeft: `${depth * 16}px` }}>
            <div onClick={toggleOpen} className="flex items-center cursor-pointer py-1">
                {item.type === 'folder' && (
                    isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                )}
                {item.type === 'folder' ? <Folder size={16} className="mr-2" /> : <File size={16} className="mr-2" />}
                <span>{item.name}</span>
            </div>
            {isOpen && item.children && (
                <div>
                    {item.children.map((child, index) => (
                        <FileTreeNode key={index} item={child} depth={depth + 1} onToggle={onToggle} openFolders={openFolders} />
                    ))}
                </div>
            )}
        </div>
    );
};

const FileTree: React.FC = () => {
    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

    const handleToggle = (path: string) => {
        setOpenFolders(prevOpenFolders => {
            const newOpenFolders = new Set(prevOpenFolders);
            if (newOpenFolders.has(path)) {
                newOpenFolders.delete(path);
            } else {
                newOpenFolders.add(path);
            }
            return newOpenFolders;
        });
    };

    return (
        <div className="p-4 bg-background text-foreground">
            <h2 className="text-lg font-semibold mb-4">File Tree</h2>
            {mockFileTree.map((item, index) => (
                <FileTreeNode key={index} item={item} depth={0} onToggle={handleToggle} openFolders={openFolders} />
            ))}
        </div>
    );
};

export default FileTree;
