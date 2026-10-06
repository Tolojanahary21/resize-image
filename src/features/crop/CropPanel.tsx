"use client";

import {
  RotateCcw,
} from "lucide-react";

import {
  useEditorStore,
} from "@/store/editor-store";

export default function CropPanel() {
  const image =
    useEditorStore(
      (state) =>
        state.image,
    );

  const zoom =
    useEditorStore(
      (state) =>
        state.cropZoom,
    );

  const aspect =
    useEditorStore(
      (state) =>
        state.cropAspect,
    );

  const setZoom =
    useEditorStore(
      (state) =>
        state.setCropZoom,
    );

  const setAspect =
    useEditorStore(
      (state) =>
        state.setCropAspect,
    );

  const reset =
    useEditorStore(
      (state) =>
        state.resetCrop,
    );

  if (!image) {
    return null;
  }

  const ratios = [
    {
      label: "Original",
      value: null,
    },
    {
      label: "1:1",
      value: 1,
    },
    {
      label: "4:3",
      value: 4 / 3,
    },
    {
      label: "3:2",
      value: 3 / 2,
    },
    {
      label: "16:9",
      value: 16 / 9,
    },
    {
      label: "9:16",
      value: 9 / 16,
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-semibold">
          Recadrage
        </h2>

        <p className="mt-1 text-xs text-zinc-500">
          Déplacez directement l’image dans l’éditeur.
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-zinc-600">
          Ratio
        </p>

        <div className="grid grid-cols-3 gap-2">
          {ratios.map(
            (ratio) => {
              const selected =
                ratio.value ===
                aspect;

              return (
                <button
                  key={
                    ratio.label
                  }
                  type="button"
                  onClick={() =>
                    setAspect(
                      ratio.value,
                    )
                  }
                  className={`rounded-lg border px-2 py-2 text-xs ${
                    selected
                      ? "border-black bg-black text-white dark-surface"
                      : "border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  {
                    ratio.label
                  }
                </button>
              );
            },
          )}
        </div>
      </div>

      <label className="block text-xs font-medium text-zinc-600">
        Zoom{" "}
        {zoom.toFixed(
          1,
        )}
        ×

        <input
          type="range"
          min="1"
          max="3"
          step="0.01"
          value={zoom}
          onChange={(event) =>
            setZoom(
              Number(
                event.target
                  .value,
              ),
            )
          }
          className="mt-3 w-full"
        />
      </label>

      <button
        type="button"
        onClick={
          reset
        }
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-sm"
      >
        <RotateCcw
          size={16}
        />

        Annuler le recadrage
      </button>
    </div>
  );
}
