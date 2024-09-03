import React, { createContext, useContext, ReactNode } from 'react'
import { useProjectData, useProjectFiles } from '@/hooks/data'

// TODO: Add better types
interface ProjectContextType {
  project: any
  files: any
  isLoading: boolean
  error: any
}

const ProjectContext = createContext<any>(undefined)

export function ProjectProvider({ children, projectId }: { children: ReactNode; projectId: string }) {
  const { data: projectData, isLoading: isProjectLoading, error: projectError } = useProjectData(projectId)
  const { data: filesData, isLoading: isFilesLoading, error: filesError } = useProjectFiles(projectId)
  const currentlyOpen = filesData?.files?.find((file) => file.isOpen === true)
  const editorContent = currentlyOpen?.content

  const value = {
    projectId,
    project: projectData?.projects[0],
    files: filesData?.files,
    isProjectLoading,
    isFilesLoading,
    currentlyOpen,
    editorContent,
    error: projectError || filesError,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProject() {
  return useContext(ProjectContext)
}
