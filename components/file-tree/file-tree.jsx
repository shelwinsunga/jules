'use client'
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Tree } from 'react-arborist';
import { File, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import Tex from '@/public/tex.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db } from '@/lib/constants';
import { tx, id } from '@instantdb/react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilePlus2 } from 'lucide-react';
import { FolderPlus } from 'lucide-react';

const FileTreeNode = ({ node, style, dragHandle }) => {
    const [nodeStyle, setNodeStyle] = useState({ base: style });
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(node.data.name);
    const inputRef = useRef(null);
    const [isNewItem, setIsNewItem] = useState(false);

    const onMouseOver = () => {
        if (node.data.hover) {
            setNodeStyle(() => ({
                base: { ...style, ...{ backgroundColor: "hsl(var(--muted))" } }
            }));
        }
    };

    const onMouseLeave = () => {
        if (node.data.hover) {
            setNodeStyle(() => ({ base: style }));
        }
    };

    const handleToggleClick = (e) => {
        e.stopPropagation();
        node.toggle();
        node.tree.props.onToggle({ id: node.id, isExpanded: !node.data.isExpanded });
    };

    const handleRenameClick = (e) => {
        e.stopPropagation();
        setIsRenaming(true);
        setNewName(node.data.name);
    };

    useEffect(() => {
        if (isRenaming) {
            const timeoutId = setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.setSelectionRange(newName.length, newName.length);
                }
            }, 50);

            return () => clearTimeout(timeoutId);
        }
    }, [isRenaming, newName]);

    useEffect(() => {
        if (node.tree.props.newItemType && node.id === node.tree.props.newItemParentId) {
            const newItemIndex = node.children.findIndex(child => !child.data.id);
            if (newItemIndex !== -1) {
                setIsNewItem(true);
                setIsRenaming(true);
                setNewName(node.children[newItemIndex].data.name);
            }
        }
    }, [node, node.tree.props.newItemType, node.tree.props.newItemParentId]);

    const handleRenameSubmit = () => {
        if (newName.trim() !== '') {
            if (isNewItem) {
                node.tree.props.onRename({ id: node.children[node.children.length - 1].id, name: newName.trim() });
                setIsNewItem(false);
            } else {
                node.tree.props.onRename({ id: node.id, name: newName.trim() });
            }
        }
        setIsRenaming(false);
    };

    const handleDelete = () => {
        node.tree.props.onDelete({ ids: [node.id], type: node.data.type });
    };

    const handleAddFile = () => {
        node.tree.props.onAddItem('file', node.id);
    };

    if (isRenaming) {
        return (
            <div
                onClick={(e) => e.stopPropagation()}
                style={style}
                className="flex items-center gap-2 p-1 rounded-md"
            >
                <Input
                    ref={inputRef}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleRenameSubmit}
                    onKeyDown={(e) => {
                        e.stopPropagation(); // Add this line
                        if (e.key === 'Enter') handleRenameSubmit();
                        if (e.key === 'Escape') setIsRenaming(false);
                    }}
                    className="h-6 py-0 px-1 text-sm"
                />
            </div>
        );
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div 
                    className={cn(
                        "flex items-center gap-2 p-1 rounded-md cursor-pointer",
                        node.isSelected && "bg-accent",
                    )}
                    style={nodeStyle.base} 
                    ref={dragHandle}
                    onMouseOver={onMouseOver}
                    onMouseLeave={onMouseLeave}
                    onClick={!node.isLeaf ? handleToggleClick : undefined}
                >
                    <div className="flex items-center justify-between w-full p-1 rounded-md text-foreground">
                        <div className="flex items-center gap-2">
                            {node.isLeaf ? (
                                node.data.name && node.data.name.endsWith('.tex') ? (
                                    <Tex />
                                ) : (
                                    <File className="w-4 h-4" />
                                )
                            ) : node.data.isExpanded ? (
                                <FolderOpen className="w-4 h-4" />
                            ) : (
                                <Folder className="w-4 h-4" />
                            )}
                            {isRenaming ? (
                                <Input
                                    ref={inputRef}
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onBlur={handleRenameSubmit}
                                    onKeyDown={(e) => {
                                        e.stopPropagation(); // Add this line
                                        if (e.key === 'Enter') handleRenameSubmit();
                                        if (e.key === 'Escape') setIsRenaming(false);
                                    }}
                                    onClick={(e) => e.stopPropagation()} // Add this line
                                    className="h-6 py-0 px-1 text-sm"
                                />
                            ) : (
                                <span className="text-sm">{node.data.name}</span>
                            )}
                        </div>
                        {!node.isLeaf && (
                            <div className="focus:outline-none">
                                {node.data.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </div>
                        )}
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={handleRenameClick}>
                    <Edit className="w-4 h-4 mr-2" />
                    Rename
                </ContextMenuItem>
                <ContextMenuItem onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </ContextMenuItem>
                {!node.isLeaf && (
                    <>
                        <ContextMenuItem onClick={handleAddFile}>
                            <FilePlus2 className="w-4 h-4 mr-2" />
                            Add File
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => node.tree.props.onAddItem('folder', node.id)}>
                            <FolderPlus className="w-4 h-4 mr-2" />
                            Add Folder
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
};

const FileTree = ({ projectId }) => {
    const { data: filesData, error, isLoading} = db.useQuery({
        files: {
            $: {
                where: {
                    projectId: projectId
                }
            }
        }
    });

    const transformedData = useMemo(() => {
        if (!filesData?.files) return [];

        const buildTree = (parentId = null) => {
            return filesData.files
                .filter(file => file.parent_id === parentId)
                .map(file => ({
                    id: file.id,
                    name: file.name,
                    type: file.type,
                    hover: true,
                    isExpanded: file.isExpanded ?? false,
                    ...(file.type === 'folder' && {
                        children: buildTree(file.id)
                    })
                }));
        };

        return buildTree();
    }, [filesData]);

    const initialOpenState = useMemo(() => {
        if (!filesData?.files) return {};
        
        return filesData.files.reduce((acc, file) => {
            acc[file.id] = file.isExpanded ?? false;
            return acc;
        }, {});
    }, [filesData]);

    const treeContainerRef = useRef(null);
    const [treeContainer, setTreeContainer] = useState({
        width: 256,
        height: 735
    });

    const [newItemType, setNewItemType] = useState(null);
    const [newItemParentId, setNewItemParentId] = useState(null);

    const handleAddItem = useCallback((type, parentId = null) => {
        const newItemId = id();
        const newItem = {
            id: newItemId,
            name: type === 'file' ? 'untitled.tex' : 'Untitled Folder',
            type: type,
            parent_id: parentId,
            projectId: projectId,
            isExpanded: type === 'folder' ? true : null,
            content: '',
            createdAt: new Date(),
        };

        db.transact([
            tx.files[newItemId].update(newItem)
        ]);

        setNewItemType(type);
        setNewItemParentId(parentId);
    }, [projectId]);

    const handleRename = ({ id, name }) => {
        console.log(name);
        db.transact([
            tx.files[id].update({ name: name })
        ]);
    };

    const handleMove = ({ dragIds, parentId, index }) => {
        const updates = dragIds.map(id => ({
            id: id,
            parent_id: parentId
        }));

        // Get all files with the same parent_id
        const siblingFiles = filesData.files.filter(file => file.parent_id === parentId);

        // Insert the moved files at the specified index
        const updatedSiblings = [
            ...siblingFiles.slice(0, index),
            ...updates,
            ...siblingFiles.slice(index)
        ];

        // Update the order of all affected files
        const orderUpdates = updatedSiblings.map((file, i) => ({
            id: file.id,
            order: i
        }));

        // Combine all updates
        const allUpdates = [...updates, ...orderUpdates];

        // Perform the database transaction
        db.transact(
            allUpdates.map(update => 
                tx.files[update.id].update(update)
            )
        );
    };

    const handleDelete = ({ ids, type }) => {
        if(type === 'file') {
            db.transact([
                tx.files[ids[0]].delete()
            ]);
        } else if (type === 'folder') {
            // Recursive function to collect all child files and folders
            const collectChildren = (folderId) => {
                return filesData.files.filter(file => file.parent_id === folderId).flatMap(child => {
                    if (child.type === 'folder') {
                        return [child.id, ...collectChildren(child.id)];
                    }
                    return child.id;
                });
            };

            const childrenIds = collectChildren(ids[0]);

            // Delete the folder and all its children
            db.transact([
                ...childrenIds.map(id => tx.files[id].delete()),
                tx.files[ids[0]].delete()
            ]);
        }
    };

    const handleToggle = ({ id, isExpanded }) => {
        console.log(isExpanded);
        db.transact([
            tx.files[id].update({ isExpanded: isExpanded })
        ]);
    };

  
    useEffect(() => {
        console.log("Effect running");

        const resizeObserver = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setTreeContainer({
                width: width - 32,
                height: height 
            });
        });

        const observeElement = () => {
            if (treeContainerRef.current) {
                resizeObserver.observe(treeContainerRef.current);
            } else {
                setTimeout(observeElement, 100); 
            }
        };

        observeElement();

        return () => {
            console.log("Cleanup: disconnecting ResizeObserver");
            resizeObserver.disconnect();
        };
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div ref={treeContainerRef} className="flex flex-col grow h-full shadow-sm w-full">
            <div className="flex items-center justify-between  px-4 border-b py-2">
                <div className="text-sm font-medium">Files</div>
                <div className="flex items-center">
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleAddItem('file')}>
                                <FilePlus2 className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add file</TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleAddItem('folder')}>
                                <FolderPlus className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add folder</TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <ScrollArea className="flex-grow w-full px-4 py-2">
                <Tree
                    data={transformedData}
                    onMove={handleMove}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onRename={handleRename}
                    className="text-foreground"
                    width={treeContainer.width}
                    height={treeContainer.height}
                    rowHeight={36}
                    initialOpenState={initialOpenState}
                    newItemType={newItemType}
                    newItemParentId={newItemParentId}
                    onAddItem={handleAddItem}
                >
                    {FileTreeNode}
                </Tree>
            </ScrollArea>
        </div>
    );
};

export default FileTree;
