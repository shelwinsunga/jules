import EditorContainer from "@/components/editor/editor-container";
import LatexRenderer from "@/components/latex-render/latex";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import SideNav from "@/components/nav/side-nav"

export const maxDuration = 30;

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={16} collapsible={true}>
          <SideNav />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={44}>
          <div className="w-full h-full bg-background flex items-center justify-center">
            <p className="text-foreground">Editor Container Placeholder</p>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={44}>
          <div className="w-full h-full bg-background flex items-center justify-center">
            <p className="text-foreground">LaTeX Renderer Placeholder</p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
