"use client";

import {
  ImageIcon,
  RotateCcw,
  Trash2,
} from "lucide-react";

import {
  useEditorStore,
} from "@/store/editor-store";

export default function Header() {
  const image =
    useEditorStore(
      (state) =>
        state.image,
    );

  const resetAll =
    useEditorStore(
      (state) =>
        state.resetAll,
    );

  const clearImage =
    useEditorStore(
      (state) =>
        state.clearImage,
    );

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
          <ImageIcon size={20} />
        </div>

        <div>
          <h1 className="text-lg font-bold">
            KID
          </h1>

          <p className="text-xs text-zinc-500">
            Image Toolkit
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-zinc-400 sm:block">
          100% local
        </span>

        {image && (
          <>
            <button
              type="button"
              onClick={
                resetAll
              }
              className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-600 transition hover:bg-zinc-100"
            >
              <RotateCcw
                size={16}
              />

              <span className="hidden md:inline">
                Réinitialiser
              </span>
            </button>

            <button
              type="button"
              onClick={
                clearImage
              }
              className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <Trash2
                size={16}
              />

              <span className="hidden md:inline">
                Nouvelle image
              </span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}