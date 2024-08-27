import EditorContainer from "@/components/editor/editor-container";
import LatexRenderer from "@/components/latex-render/latex";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export const maxDuration = 30;

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <EditorContainer />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <LatexRenderer />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
