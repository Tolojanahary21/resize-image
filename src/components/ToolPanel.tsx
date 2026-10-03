"use client";

import {
  useEditorStore,
} from "@/store/editor-store";

import CropPanel from "@/features/crop/CropPanel";
import ExportPanel from "@/features/export/ExportPanel";
import FiltersPanel from "@/features/filters/FiltersPanel";
import ResizePanel from "@/features/resize/ResizePanel";
import TransformPanel from "@/features/rotate/Transform";

export default function ToolPanel() {
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

  return (
    <section className="border-r border-zinc-200 bg-white p-5">
      {!image ? (
        <div>
          <h2 className="font-semibold">
            Importer
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Sélectionnez ou glissez une image dans la zone centrale.
          </p>
        </div>
      ) : (
        <>
          {activeTool ===
            "upload" && (
            <div>
              <h2 className="font-semibold">
                Image
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Votre image est chargée. Utilisez les outils à gauche pour la modifier.
              </p>
            </div>
          )}

          {activeTool ===
            "resize" && (
            <ResizePanel />
          )}

          {activeTool ===
            "crop" && (
            <CropPanel />
          )}

          {activeTool ===
            "transform" && (
            <TransformPanel />
          )}

          {activeTool ===
            "filters" && (
            <FiltersPanel />
          )}

          {activeTool ===
            "export" && (
            <ExportPanel />
          )}
        </>
      )}
    </section>
  );
}