import EditorCanvas from "@/components/EditorCanvas";
import Header from "@/components/Header";
import PropertiesPanel from "@/components/PropertiesPanel";
import Sidebar from "@/components/Sidebar";
import ToolPanel from "@/components/ToolPanel";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-100">
      <Header />

      <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 xl:grid-cols-[88px_300px_minmax(0,1fr)_260px]">
        <Sidebar />

        <ToolPanel />

        <EditorCanvas />

        <PropertiesPanel />
      </div>
    </div>
  );
}