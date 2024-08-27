'use client'
import React, { useState } from 'react';
import { Tree } from 'react-arborist';
import { File, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

const FileTreeNode = ({ node, style, dragHandle }) => (
    <div 
        className={cn(
            "flex items-center gap-2 p-2 rounded-md",
            node.isSelected && "bg-accent"
        )}
        style={style} 
        ref={dragHandle}
    >
        {!node.isLeaf && (
            <button onClick={() => node.toggle()} className="focus:outline-none">
                {node.isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
        )}
        {node.isLeaf ? (
            <File className="w-4 h-4" />
        ) : node.isOpen ? (
            <FolderOpen className="w-4 h-4" />
        ) : (
            <Folder className="w-4 h-4" />
        )}
        <span className="text-sm">{node.data.name}</span>
    </div>
);

const FileTree = ({ initialData }) => {
    const [data, setData] = useState([
        {
            id: '1',
            name: 'Project',
            children: [
                {
                    id: '2',
                    name: 'src',
                    children: [
                        { id: '3', name: 'index.js' },
                        { id: '4', name: 'styles.css' }
                    ]
                },
                {
                    id: '5',
                    name: 'public',
                    children: [
                        { id: '6', name: 'index.html' },
                        { id: '7', name: 'favicon.ico' }
                    ]
                },
                { id: '8', name: 'package.json' },
                { id: '9', name: 'README.md' }
            ]
        }
    ]);

    const handleCreate = ({ parentId, index, type }) => {
        setData(prevData => {
            const newNode = {
                id: Date.now().toString(),
                name: type === 'file' ? 'New File' : 'New Folder',
                children: type === 'folder' ? [] : undefined
            };
            const updatedData = JSON.parse(JSON.stringify(prevData));
            const parent = findNodeById(updatedData, parentId);
            if (parent) {
                parent.children.splice(index, 0, newNode);
            } else {
                updatedData.splice(index, 0, newNode);
            }
            return updatedData;
        });
    };

    const handleRename = ({ id, name }) => {
        setData(prevData => {
            const updatedData = JSON.parse(JSON.stringify(prevData));
            const node = findNodeById(updatedData, id);
            if (node) {
                node.name = name;
            }
            return updatedData;
        });
    };

    const handleMove = ({ dragIds, parentId, index }) => {
        setData(prevData => {
            const updatedData = JSON.parse(JSON.stringify(prevData));
            const nodesToMove = dragIds.map(id => {
                const node = findNodeById(updatedData, id);
                removeNodeById(updatedData, id);
                return node;
            });
            const parent = parentId ? findNodeById(updatedData, parentId) : { children: updatedData };
            parent.children.splice(index, 0, ...nodesToMove);
            return updatedData;
        });
    };

    const handleDelete = ({ ids }) => {
        setData(prevData => {
            const updatedData = JSON.parse(JSON.stringify(prevData));
            ids.forEach(id => removeNodeById(updatedData, id));
            return updatedData;
        });
    };

    const handleToggle = ({ id, isOpen }) => {
        setData(prevData => {
            const updatedData = JSON.parse(JSON.stringify(prevData));
            const node = findNodeById(updatedData, id);
            if (node && node.children) {
                node.isOpen = isOpen;
            }
            return updatedData;
        });
    };

    const findNodeById = (nodes, id) => {
        for (let node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const removeNodeById = (nodes, id) => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) {
                nodes.splice(i, 1);
                return true;
            }
            if (nodes[i].children && removeNodeById(nodes[i].children, id)) {
                return true;
            }
        }
        return false;
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <Tree
                data={data}
                onCreate={handleCreate}
                onRename={handleRename}
                onMove={handleMove}
                onDelete={handleDelete}
                onToggle={handleToggle}
                className="text-foreground"
            >
                {FileTreeNode}
            </Tree>
        </div>
    );
};

export default FileTree;
