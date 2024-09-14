import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { File, Folder, FolderOpen, ChevronRight, ChevronDown, Edit, Trash2, FilePlus2, FolderPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import Tex from '@/public/tex'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Input } from '@/components/ui/input'

const FileTreeNode = ({ node, style, dragHandle }) => {
  const [nodeStyle, setNodeStyle] = useState({ base: style })
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(node.data.name)
  const inputRef = useRef(null)
  const [isNewItem, setIsNewItem] = useState(false)
  const [inputValue, setInputValue] = useState(node.data.name)

  const onMouseOver = () => {
    if (node.data.hover && !node.data.isOpen) {
      setNodeStyle(() => ({
        base: { ...style, ...{ backgroundColor: 'hsl(var(--muted))' } },
      }))
    }
  }

  const onMouseLeave = () => {
    if (node.data.hover && !node.data.isOpen) {
      setNodeStyle(() => ({ base: style }))
    }
  }

  const handleToggleClick = (e) => {
    e.stopPropagation()
    node.toggle()
    node.tree.props.onToggle({
      id: node.id,
      isExpanded: !node.data.isExpanded,
      type: node.data.type,
      isOpen: node.data.isOpen,
    })
  }

  const handleRenameClick = (e) => {
    e.stopPropagation()
    setIsRenaming(true)
    setNewName(node.data.name)
  }

  useEffect(() => {
    if (node.data.isOpen) {
      setNodeStyle(() => ({
        base: { ...style, ...{ backgroundColor: 'hsl(var(--accent))' } },
      }))
    } else {
      setNodeStyle(() => ({ base: style }))
    }
  }, [node.data.isOpen, style])

  useEffect(() => {
    if (isRenaming) {
      const timeoutId = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.setSelectionRange(newName.length, newName.length)
        }
      }, 50)

      return () => clearTimeout(timeoutId)
    }
  }, [isRenaming, newName])

  useEffect(() => {
    if (node.tree.props.newItemType && node.id === node.tree.props.newItemParentId) {
      const newItemIndex = node.children.findIndex((child) => !child.data.id)
      if (newItemIndex !== -1) {
        setIsNewItem(true)
        setIsRenaming(true)
        setNewName(node.children[newItemIndex].data.name)
      }
    }
  }, [node, node.tree.props.newItemType, node.tree.props.newItemParentId])

  const handleRenameSubmit = () => {
    if (inputValue.trim() !== '') {
      if (isNewItem) {
        node.tree.props.onRename({ id: node.children[node.children.length - 1].id, name: inputValue.trim() })
        setIsNewItem(false)
      } else {
        node.tree.props.onRename({ id: node.id, name: inputValue.trim() })
      }
    }
    setIsRenaming(false)
  }

  const handleDelete = () => {
    node.tree.props.onDelete({ ids: [node.id], type: node.data.type })
  }

  const handleAddFile = () => {
    node.tree.props.onAddItem('file', node.id)
  }

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value)
  }, [])


  if (isRenaming) {
    return (
      <div className="px-4">
        <div onClick={(e) => e.stopPropagation()} style={style} className="flex items-center gap-2 p-1 rounded-md">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Enter') handleRenameSubmit()
              if (e.key === 'Escape') {
                setIsRenaming(false)
                setInputValue(node.data.name) // Reset input value
              }
            }}
            className="h-6 py-0 px-1 text-sm"
          />
        </div>
      </div>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="px-4">
          <div
            className={cn(
              'flex items-center gap-2 p-1 rounded-md cursor-pointer',
              node.isSelected && 'bg-accent',
              node.data.isOpen && 'bg-red-500'
            )}
            style={nodeStyle.base}
            ref={dragHandle}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onClick={handleToggleClick}
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
                      e.stopPropagation()
                      if (e.key === 'Enter') handleRenameSubmit()
                      if (e.key === 'Escape') setIsRenaming(false)
                    }}
                    onClick={(e) => e.stopPropagation()}
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
  )
}

export default React.memo(FileTreeNode)
