import Image from "next/image";
import { CodeEditor } from "@/components/editor/editor";

export default function Home() {
  return (
    <main className="flex h-[100vh]">
      <div className="w-1/2">
        <CodeEditor onChange={undefined} value={undefined} />
      </div>
      <div className="w-1/2">
        {/* Right side content */}
      </div>
    </main>
  );
}
