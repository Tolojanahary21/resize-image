"use client";

import {
  Link,
  Link2Off,
  RotateCcw,
} from "lucide-react";

import {
  useEditorStore,
} from "@/store/editor-store";

export default function ResizePanel() {
  const image =
    useEditorStore(
      (state) =>
        state.image,
    );

  const width =
    useEditorStore(
      (state) =>
        state.resizeWidth,
    );

  const height =
    useEditorStore(
      (state) =>
        state.resizeHeight,
    );

  const enabled =
    useEditorStore(
      (state) =>
        state.resizeEnabled,
    );

  const lockAspect =
    useEditorStore(
      (state) =>
        state.lockAspect,
    );

  const setWidth =
    useEditorStore(
      (state) =>
        state.setResizeWidth,
    );

  const setHeight =
    useEditorStore(
      (state) =>
        state.setResizeHeight,
    );

  const toggleLock =
    useEditorStore(
      (state) =>
        state.toggleLockAspect,
    );

  const reset =
    useEditorStore(
      (state) =>
        state.resetResize,
    );

  if (!image) {
    return null;
  }

  const presets = [
    [512, 512],
    [1080, 1080],
    [1080, 1920],
    [1920, 1080],
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-semibold">
          Redimensionnement
        </h2>

        <p className="mt-1 text-xs text-zinc-500">
          Modifiez les dimensions de sortie.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
        <label className="text-xs text-zinc-600">
          Largeur

          <input
            type="number"
            min={1}
            value={width}
            onChange={(event) =>
              setWidth(
                Number(
                  event
                    .target
                    .value,
                ),
              )
            }
            className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
        </label>

        <button
          type="button"
          onClick={
            toggleLock
          }
          className="mb-0 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200"
          title="Conserver les proportions"
        >
          {lockAspect ? (
            <Link
              size={
                17
              }
            />
          ) : (
            <Link2Off
              size={
                17
              }
            />
          )}
        </button>

        <label className="text-xs text-zinc-600">
          Hauteur

          <input
            type="number"
            min={1}
            value={height}
            onChange={(event) =>
              setHeight(
                Number(
                  event
                    .target
                    .value,
                ),
              )
            }
            className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
        </label>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-zinc-600">
          Presets
        </p>

        <div className="grid grid-cols-2 gap-2">
          {presets.map(
            ([
              presetWidth,
              presetHeight,
            ]) => (
              <button
                key={`${presetWidth}x${presetHeight}`}
                type="button"
                onClick={() => {
                  setWidth(
                    presetWidth,
                  );

                  if (
                    !lockAspect
                  ) {
                    setHeight(
                      presetHeight,
                    );
                  }
                }}
                className="rounded-lg border border-zinc-200 px-2 py-2 text-xs hover:bg-zinc-100"
              >
                {
                  presetWidth
                }
                ×
                {
                  presetHeight
                }
              </button>
            ),
          )}
        </div>
      </div>

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

        Dimensions originales
      </button>

      <p className="text-xs text-zinc-400">
        Redimensionnement :{" "}
        {enabled
          ? "activé"
          : "désactivé"}
      </p>
    </div>
  );
}