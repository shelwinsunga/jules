import Image from "next/image";
import EditorContainer from "@/components/editor/editor-container";
export default function Home() {
  return (
    <main className="flex h-[100vh]">
      <div className="w-1/2">
        <EditorContainer />
      </div>
      <div className="w-1/2">
        {/* Right side content */}
      </div>
    </main>
  );
}
