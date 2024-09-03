import React, { createContext, useContext, ReactNode } from 'react';
import { useProjectData, useProjectFiles } from '@/hooks/data';

// TODO: Add better types
interface ProjectContextType {
  project: any;
  files: any;
  isLoading: boolean;
  error: any;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children, projectId }: { children: ReactNode, projectId: string }) {
  const { data: projectData, isLoading: projectIsLoading, error: projectError } = useProjectData(projectId);
  const { data: filesData, isLoading: filesIsLoading, error: filesError } = useProjectFiles(projectId);

  return (
    <ProjectContext.Provider value={{ project: projectData?.projects[0], files: filesData?.files, isLoading: projectIsLoading || filesIsLoading, error: projectError || filesError }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}