'use client'
import React, { createContext, useContext, ReactNode } from 'react'
import { useProjectData, useProjectFiles } from '@/hooks/data';
import { useFrontend } from '@/contexts/FrontendContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// TODO: Add better types
interface ProjectContextType {
  project: any
  files: any
  isLoading: boolean
  error: any
}

const ProjectContext = createContext<any>(undefined)

export function ProjectProvider({ children, projectId }: { children: ReactNode; projectId: string }) {
  const { user } = useFrontend();
  const { data: projectData, isLoading: isProjectLoading, error: projectError } = useProjectData(projectId, user.id)
  const { data: filesData, isLoading: isFilesLoading, error: filesError } = useProjectFiles(projectId, user.id)
  const currentlyOpen = filesData?.files?.find((file) => file.isOpen === true)

  const router = useRouter();
  useEffect(() => {
    if (!isProjectLoading && !projectData?.projects.length && !isFilesLoading && !filesData?.files.length) {
      router.push('/404');
    }
  }, [isProjectLoading, projectData, isFilesLoading, filesData, router]);

  const value = {
    projectId,
    project: projectData?.projects[0],
    files: filesData?.files,
    isProjectLoading,
    isFilesLoading,
    currentlyOpen,
    error: projectError || filesError,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProject() {
  return useContext(ProjectContext)
}
