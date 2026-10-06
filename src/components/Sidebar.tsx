"use client";

import {
  Crop,
  FileImage,
  Maximize2,
  RotateCw,
  SlidersHorizontal,
  Download,
} from "lucide-react";

import {
  useEditorStore,
} from "@/store/editor-store";

import type {
  EditorTool,
} from "@/types/image";

const tools: Array<{
  id: EditorTool;
  label: string;
  icon: typeof FileImage;
}> = [
  {
    id: "upload",
    label: "Image",
    icon: FileImage,
  },
  {
    id: "resize",
    label: "Resize",
    icon: Maximize2,
  },
  {
    id: "crop",
    label: "Crop",
    icon: Crop,
  },
  {
    id: "transform",
    label: "Rotation",
    icon: RotateCw,
  },
  {
    id: "filters",
    label: "Réglages",
    icon: SlidersHorizontal,
  },
  {
    id: "export",
    label: "Exporter",
    icon: Download,
  },
];

export default function Sidebar() {
  const image =
    useEditorStore(
      (state) =>
        state.image,
    );

  const activeTool =
    useEditorStore(
      (state) =>
        state.activeTool,
    );

  const setActiveTool =
    useEditorStore(
      (state) =>
        state.setActiveTool,
    );

  return (
    <aside className="border-r border-zinc-200 bg-white p-2">
      <nav className="flex gap-2 overflow-x-auto xl:flex-col">
        {tools.map(
          ({
            id,
            label,
            icon: Icon,
          }) => {
            const disabled =
              !image &&
              id !==
                "upload";

            const active =
              activeTool ===
              id;

            return (
              <button
                key={id}
                type="button"
                disabled={
                  disabled
                }
                onClick={() =>
                  setActiveTool(
                    id,
                  )
                }
                className={`flex min-w-[76px] flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs transition ${
                  active
                    ? "bg-black text-white dark-surface"
                    : "text-zinc-600 hover:bg-zinc-100"
                } ${
                  disabled
                    ? "cursor-not-allowed opacity-30"
                    : ""
                }`}
              >
                <Icon
                  size={
                    19
                  }
                />

                {label}
              </button>
            );
          },
        )}
      </nav>
    </aside>
  );
}
