"use client";

import {
  RotateCcw,
} from "lucide-react";

import {
  useEditorStore,
} from "@/store/editor-store";

const sliders = [
  {
    key: "brightness",
    label: "Luminosité",
    min: 0,
    max: 200,
    unit: "%",
  },
  {
    key: "contrast",
    label: "Contraste",
    min: 0,
    max: 200,
    unit: "%",
  },
  {
    key: "saturation",
    label: "Saturation",
    min: 0,
    max: 200,
    unit: "%",
  },
  {
    key: "grayscale",
    label: "Noir & blanc",
    min: 0,
    max: 100,
    unit: "%",
  },
  {
    key: "sepia",
    label: "Sépia",
    min: 0,
    max: 100,
    unit: "%",
  },
  {
    key: "blur",
    label: "Flou",
    min: 0,
    max: 20,
    unit: "px",
  },
] as const;

export default function FiltersPanel() {
  const filters =
    useEditorStore(
      (state) =>
        state.filters,
    );

  const setFilter =
    useEditorStore(
      (state) =>
        state.setFilter,
    );

  const reset =
    useEditorStore(
      (state) =>
        state.resetFilters,
    );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-semibold">
          Réglages
        </h2>

        <p className="mt-1 text-xs text-zinc-500">
          Corrigez l’apparence de l’image.
        </p>
      </div>

      {sliders.map(
        ({
          key,
          label,
          min,
          max,
          unit,
        }) => (
          <label
            key={key}
            className="block"
          >
            <div className="flex justify-between text-xs">
              <span className="font-medium text-zinc-600">
                {label}
              </span>

              <span className="text-zinc-400">
                {
                  filters[
                    key
                  ]
                }
                {unit}
              </span>
            </div>

            <input
              type="range"
              min={min}
              max={max}
              value={
                filters[
                  key
                ]
              }
              onChange={(event) =>
                setFilter(
                  key,
                  Number(
                    event
                      .target
                      .value,
                  ),
                )
              }
              className="mt-2 w-full"
            />
          </label>
        ),
      )}

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

        Réinitialiser les filtres
      </button>
    </div>
  );
}