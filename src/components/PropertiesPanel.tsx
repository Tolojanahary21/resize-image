"use client";

import {
  useEditorStore,
} from "@/store/editor-store";

import {
  formatFileSize,
} from "@/utils/file";

import {
  getRotatedSize,
} from "@/utils/render";

export default function PropertiesPanel() {
  const state =
    useEditorStore();

  const image =
    state.image;

  if (!image) {
    return (
      <aside className="border-l border-zinc-200 bg-white p-5">
        <h2 className="font-semibold">
          Propriétés
        </h2>

        <p className="mt-4 text-sm text-zinc-400">
          Aucune image chargée.
        </p>
      </aside>
    );
  }

  const rotated =
    getRotatedSize(
      image.width,
      image.height,
      state.rotation,
    );

  const baseWidth =
    state.cropPixels
      ?.width ??
    rotated.width;

  const baseHeight =
    state.cropPixels
      ?.height ??
    rotated.height;

  const outputWidth =
    state.resizeEnabled
      ? state.resizeWidth
      : Math.round(
          baseWidth,
        );

  const outputHeight =
    state.resizeEnabled
      ? state.resizeHeight
      : Math.round(
          baseHeight,
        );

  return (
    <aside className="border-l border-zinc-200 bg-white p-5">
      <h2 className="font-semibold">
        Propriétés
      </h2>

      <div className="mt-5 space-y-4 text-sm">
        <Property
          label="Format source"
          value={image.sourceFormat.toUpperCase()}
        />

        <Property
          label="Dimensions source"
          value={`${image.width} × ${image.height}`}
        />

        <Property
          label="Poids"
          value={formatFileSize(
            image.size,
          )}
        />

        <div className="border-t border-zinc-200 pt-4" />

        <Property
          label="Sortie"
          value={state.outputFormat.toUpperCase()}
        />

        <Property
          label="Dimensions sortie"
          value={`${outputWidth} × ${outputHeight}`}
        />

        <Property
          label="Rotation"
          value={`${state.rotation}°`}
        />

        <Property
          label="Qualité"
          value={
            state.outputFormat ===
              "jpeg" ||
            state.outputFormat ===
              "webp" ||
            state.outputFormat ===
              "avif"
              ? `${state.quality}%`
              : "—"
          }
        />
      </div>

      <div className="mt-6 rounded-xl bg-zinc-100 p-3">
        <p className="text-xs leading-5 text-zinc-500">
          L’image reste sur cet appareil pendant le traitement.
        </p>
      </div>
    </aside>
  );
}

function Property({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-zinc-500">
        {label}
      </span>

      <span className="max-w-[130px] break-all text-right font-medium text-zinc-800">
        {value}
      </span>
    </div>
  );
}