import Image from "next/image";
import EditorContainer from "@/components/editor/editor-container";
import LatexRenderer from "@/components/latex-render/latex";
export default function Home() {
  return (
    <main className="flex h-[100vh]">
      <div className="w-1/2">
        <EditorContainer />
      </div>
      <div className="w-1/2">
        <LatexRenderer latex={""} />
      </div>
    </main>
  );
}
