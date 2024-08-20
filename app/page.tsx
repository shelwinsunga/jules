'use client'
import EditorContainer from "@/components/editor/editor-container";
import LatexRenderer from "@/components/latex-render/latex";
import { useFrontend } from "@/contexts/FrontendContext";
export default function Home() {
  const { latex } = useFrontend();
  return (
    <main className="flex h-[100vh]">
      <div className="rounded-md border w-1/2">
        <EditorContainer />
      </div>
      <div className="w-1/2">
        <LatexRenderer latex={latex} />
      </div>
    </main>
  );
}
