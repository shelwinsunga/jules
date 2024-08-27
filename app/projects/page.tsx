import EditorContainer from "@/components/editor/editor-container";
import LatexRenderer from "@/components/latex-render/latex";

export const maxDuration = 30;

export default function Home() {
  return (
    <main className="flex flex-col px-4">
      <div className="flex flex-row justify-between">
      </div>
      <div className="flex flex-row space-x-4 h-[calc(100vh-100px)] rounded-md shadow-md">
        <div className="w-1/2 flex flex-col border justify-start px-0 rounded-md bg-secondary/20 items-center">
          <EditorContainer />
        </div>
        <div className="w-1/2 flex flex-col border justify-start px-0 rounded-md bg-secondary/20 items-center">
          <LatexRenderer />
        </div>
      </div>
    </main>
  );
}
