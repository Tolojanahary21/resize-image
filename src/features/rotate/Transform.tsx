"use client";

import {
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  RotateCw,
} from "lucide-react";

import {
  useEditorStore,
} from "@/store/editor-store";

export default function TransformPanel() {
  const rotation =
    useEditorStore(
      (state) =>
        state.rotation,
    );

  const flipX =
    useEditorStore(
      (state) =>
        state.flipX,
    );

  const flipY =
    useEditorStore(
      (state) =>
        state.flipY,
    );

  const rotateBy =
    useEditorStore(
      (state) =>
        state.rotateBy,
    );

  const setRotation =
    useEditorStore(
      (state) =>
        state.setRotation,
    );

  const toggleFlipX =
    useEditorStore(
      (state) =>
        state.toggleFlipX,
    );

  const toggleFlipY =
    useEditorStore(
      (state) =>
        state.toggleFlipY,
    );

  const reset =
    useEditorStore(
      (state) =>
        state.resetTransform,
    );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-semibold">
          Rotation & miroir
        </h2>

        <p className="mt-1 text-xs text-zinc-500">
          Tournez ou retournez l’image.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() =>
            rotateBy(-90)
          }
          className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 py-3 text-sm"
        >
          <RotateCcw
            size={17}
          />

          -90°
        </button>

        <button
          type="button"
          onClick={() =>
            rotateBy(90)
          }
          className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 py-3 text-sm"
        >
          <RotateCw
            size={17}
          />

          +90°
        </button>
      </div>

      <label className="block text-xs font-medium text-zinc-600">
        Rotation :{" "}
        {rotation}°

        <input
          type="range"
          min="-180"
          max="180"
          value={
            rotation
          }
          onChange={(event) =>
            setRotation(
              Number(
                event.target
                  .value,
              ),
            )
          }
          className="mt-3 w-full"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={
            toggleFlipX
          }
          className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-sm ${
            flipX
              ? "border-black bg-black text-white dark-surface"
              : "border-zinc-200"
          }`}
        >
          <FlipHorizontal
            size={17}
          />

          Horizontal
        </button>

        <button
          type="button"
          onClick={
            toggleFlipY
          }
          className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-sm ${
            flipY
              ? "border-black bg-black text-white dark-surface"
              : "border-zinc-200"
          }`}
        >
          <FlipVertical
            size={17}
          />

          Vertical
        </button>
      </div>

      <button
        type="button"
        onClick={
          reset
        }
        className="w-full rounded-lg border border-zinc-200 py-2 text-sm"
      >
        Réinitialiser
      </button>
    </div>
  );
}
