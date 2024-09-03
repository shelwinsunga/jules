'use client'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import SideNav from '@/components/nav/side-nav'
import LatexRenderer from '@/components/latex-render/latex'
import EditorContainer from '@/components/editor/editor-container'
import { ProjectProvider } from '@/contexts/ProjectContext'
import { useParams } from 'next/navigation'
import { useFrontend } from '@/contexts/FrontendContext'
export const maxDuration = 30

export default function Home() {
  const { id } = useParams<{ id: string }>()
  const sideNavSize = typeof window !== 'undefined' ? (window.innerWidth < 1440 ? 20 : 16) : 16

  return (
    <ProjectProvider projectId={id}>
      <main className="flex flex-col h-screen">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={sideNavSize} collapsible={true}>
            <SideNav />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={44}>
            <EditorContainer />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={44}>
            <LatexRenderer />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </ProjectProvider>
  )
}
