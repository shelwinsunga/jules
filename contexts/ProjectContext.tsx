// contexts/ProjectContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useProjectData, useProjectFiles } from '@/hooks/data';

const ProjectContext = createContext<any>(null);

export function ProjectProvider({ children, projectId }: { children: ReactNode, projectId: string }) {
  const { data: projectData, isLoading: projectIsLoading, error: projectError } = useProjectData(projectId);
  const { data: filesData, isLoading: filesIsLoading, error: filesError } = useProjectFiles(projectId);
  console.log(filesData);

  return (
    <ProjectContext.Provider value={{ project: projectData?.projects[0], files: filesData?.files, isLoading: projectIsLoading || filesIsLoading, error: projectError || filesError }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}