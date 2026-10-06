"use client";

import {
  Download,
  LoaderCircle,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  OUTPUT_FORMATS,
} from "@/lib/formats";

import {
  useEditorStore,
} from "@/store/editor-store";

import type {
  OutputFormat,
} from "@/types/image";

import {
  formatFileSize,
} from "@/utils/file";

import {
  exportCurrentImage,
} from "@/utils/export";

export default function ExportPanel() {
  const format =
    useEditorStore(
      (state) =>
        state.outputFormat,
    );

  const quality =
    useEditorStore(
      (state) =>
        state.quality,
    );

  const exportName =
    useEditorStore(
      (state) =>
        state.exportName,
    );

  const processing =
    useEditorStore(
      (state) =>
        state.isProcessing,
    );

  const setFormat =
    useEditorStore(
      (state) =>
        state.setOutputFormat,
    );

  const setQuality =
    useEditorStore(
      (state) =>
        state.setQuality,
    );

  const setExportName =
    useEditorStore(
      (state) =>
        state.setExportName,
    );

  const lossy =
    format === "jpeg" ||
    format === "webp" ||
    format === "avif";

  async function handleExport() {
    try {
      const result =
        await exportCurrentImage();

      toast.success(
        `Export terminé · ${result.width}×${result.height} · ${formatFileSize(result.size)}`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur pendant l'export.",
      );
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-semibold">
          Exportation
        </h2>

        <p className="mt-1 text-xs text-zinc-500">
          Conversion et compression finales.
        </p>
      </div>

      <label className="block text-xs font-medium text-zinc-600">
        Nom du fichier

        <input
          value={
            exportName
          }
          onChange={(event) =>
            setExportName(
              event.target
                .value,
            )
          }
          className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
      </label>

      <div>
        <p className="mb-2 text-xs font-medium text-zinc-600">
          Format
        </p>

        <div className="grid grid-cols-2 gap-2">
          {OUTPUT_FORMATS.map(
            (
              output,
            ) => (
              <button
                key={
                  output.value
                }
                type="button"
                onClick={() =>
                  setFormat(
                    output.value as OutputFormat,
                  )
                }
                className={`rounded-lg border px-3 py-2 text-sm ${
                  format ===
                  output.value
                    ? "border-black bg-black text-white dark-surface"
                    : "border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                {
                  output.label
                }
              </button>
            ),
          )}
        </div>
      </div>

      {lossy && (
        <label className="block text-xs font-medium text-zinc-600">
          Qualité :{" "}
          {quality}%

          <input
            type="range"
            min="1"
            max="100"
            value={
              quality
            }
            onChange={(event) =>
              setQuality(
                Number(
                  event.target
                    .value,
                ),
              )
            }
            className="mt-3 w-full"
          />
        </label>
      )}

      {format ===
        "svg" && (
        <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-700">
          Le SVG exporté contient l’image modifiée sous forme raster intégrée. Ce n’est pas une vectorisation automatique.
        </p>
      )}

      <button
        type="button"
        disabled={
          processing
        }
        onClick={
          handleExport
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60 dark-surface"
      >
        {processing ? (
          <>
            <LoaderCircle
              size={18}
              className="animate-spin"
            />

            Traitement...
          </>
        ) : (
          <>
            <Download
              size={18}
            />

            Télécharger
          </>
        )}
      </button>
    </div>
  );
}
