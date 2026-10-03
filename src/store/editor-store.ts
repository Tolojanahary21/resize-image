import { create } from "zustand";

import {
  getSuggestedOutputFormat,
} from "@/lib/formats";

import type {
  CropPixels,
  EditorTool,
  FilterSettings,
  ImageAsset,
  OutputFormat,
  Point,
} from "@/types/image";

import {
  removeExtension,
} from "@/utils/file";

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
};

const DEFAULT_CROP: Point = {
  x: 0,
  y: 0,
};

function normalizeRotation(
  value: number,
) {
  let result =
    value % 360;

  if (result > 180) {
    result -= 360;
  }

  if (result < -180) {
    result += 360;
  }

  return result;
}

export type EditorStoreState = {
  image: ImageAsset | null;

  activeTool: EditorTool;

  resizeEnabled: boolean;
  resizeWidth: number;
  resizeHeight: number;
  lockAspect: boolean;

  rotation: number;
  flipX: boolean;
  flipY: boolean;

  filters: FilterSettings;

  crop: Point;
  cropZoom: number;
  cropAspect: number | null;
  cropPixels: CropPixels | null;

  outputFormat: OutputFormat;
  quality: number;
  exportName: string;

  isProcessing: boolean;

  setImage:
    (image: ImageAsset) => void;

  clearImage:
    () => void;

  setActiveTool:
    (tool: EditorTool) => void;

  setResizeWidth:
    (width: number) => void;

  setResizeHeight:
    (height: number) => void;

  setResizeEnabled:
    (enabled: boolean) => void;

  toggleLockAspect:
    () => void;

  resetResize:
    () => void;

  rotateBy:
    (degrees: number) => void;

  setRotation:
    (degrees: number) => void;

  toggleFlipX:
    () => void;

  toggleFlipY:
    () => void;

  resetTransform:
    () => void;

  setFilter:
    (
      key: keyof FilterSettings,
      value: number,
    ) => void;

  resetFilters:
    () => void;

  setCrop:
    (crop: Point) => void;

  setCropZoom:
    (zoom: number) => void;

  setCropAspect:
    (aspect: number | null) => void;

  setCropPixels:
    (
      crop: CropPixels | null,
    ) => void;

  resetCrop:
    () => void;

  setOutputFormat:
    (
      format: OutputFormat,
    ) => void;

  setQuality:
    (quality: number) => void;

  setExportName:
    (name: string) => void;

  setProcessing:
    (value: boolean) => void;

  resetAll:
    () => void;
};

export const useEditorStore =
  create<EditorStoreState>(
    (set) => ({
      image: null,

      activeTool:
        "upload",

      resizeEnabled:
        false,

      resizeWidth: 0,
      resizeHeight: 0,

      lockAspect: true,

      rotation: 0,

      flipX: false,
      flipY: false,

      filters:
        DEFAULT_FILTERS,

      crop:
        DEFAULT_CROP,

      cropZoom: 1,

      cropAspect: null,

      cropPixels: null,

      outputFormat:
        "png",

      quality: 90,

      exportName:
        "kid-image",

      isProcessing:
        false,

      setImage: (
        image,
      ) =>
        set((state) => {
          if (
            state.image?.url
          ) {
            URL.revokeObjectURL(
              state.image.url,
            );
          }

          return {
            image,

            activeTool:
              "resize",

            resizeEnabled:
              false,

            resizeWidth:
              image.width,

            resizeHeight:
              image.height,

            lockAspect:
              true,

            rotation: 0,

            flipX: false,
            flipY: false,

            filters: {
              ...DEFAULT_FILTERS,
            },

            crop: {
              ...DEFAULT_CROP,
            },

            cropZoom: 1,

            cropAspect:
              null,

            cropPixels:
              null,

            outputFormat:
              getSuggestedOutputFormat(
                image.sourceFormat,
              ),

            quality: 90,

            exportName:
              removeExtension(
                image.name,
              ),
          };
        }),

      clearImage: () =>
        set((state) => {
          if (
            state.image?.url
          ) {
            URL.revokeObjectURL(
              state.image.url,
            );
          }

          return {
            image: null,

            activeTool:
              "upload",

            resizeEnabled:
              false,

            resizeWidth: 0,
            resizeHeight: 0,

            rotation: 0,

            flipX: false,
            flipY: false,

            filters: {
              ...DEFAULT_FILTERS,
            },

            crop: {
              ...DEFAULT_CROP,
            },

            cropZoom: 1,

            cropAspect:
              null,

            cropPixels:
              null,
          };
        }),

      setActiveTool:
        (tool) =>
          set({
            activeTool:
              tool,
          }),

      setResizeWidth:
        (width) =>
          set((state) => {
            const safeWidth =
              Math.max(
                1,
                Math.round(
                  width,
                ),
              );

            let height =
              state.resizeHeight;

            if (
              state.lockAspect &&
              state.image
            ) {
              const sourceWidth =
                state.cropPixels
                  ?.width ??
                state.image
                  .width;

              const sourceHeight =
                state.cropPixels
                  ?.height ??
                state.image
                  .height;

              const ratio =
                sourceWidth /
                sourceHeight;

              height =
                Math.max(
                  1,
                  Math.round(
                    safeWidth /
                      ratio,
                  ),
                );
            }

            return {
              resizeEnabled:
                true,

              resizeWidth:
                safeWidth,

              resizeHeight:
                height,
            };
          }),

      setResizeHeight:
        (height) =>
          set((state) => {
            const safeHeight =
              Math.max(
                1,
                Math.round(
                  height,
                ),
              );

            let width =
              state.resizeWidth;

            if (
              state.lockAspect &&
              state.image
            ) {
              const sourceWidth =
                state.cropPixels
                  ?.width ??
                state.image
                  .width;

              const sourceHeight =
                state.cropPixels
                  ?.height ??
                state.image
                  .height;

              const ratio =
                sourceWidth /
                sourceHeight;

              width =
                Math.max(
                  1,
                  Math.round(
                    safeHeight *
                      ratio,
                  ),
                );
            }

            return {
              resizeEnabled:
                true,

              resizeWidth:
                width,

              resizeHeight:
                safeHeight,
            };
          }),

      setResizeEnabled:
        (enabled) =>
          set({
            resizeEnabled:
              enabled,
          }),

      toggleLockAspect:
        () =>
          set((state) => ({
            lockAspect:
              !state.lockAspect,
          })),

      resetResize: () =>
        set((state) => ({
          resizeEnabled:
            false,

          resizeWidth:
            state.image
              ?.width ?? 0,

          resizeHeight:
            state.image
              ?.height ?? 0,
        })),

      rotateBy:
        (degrees) =>
          set((state) => ({
            rotation:
              normalizeRotation(
                state.rotation +
                  degrees,
              ),

            crop: {
              ...DEFAULT_CROP,
            },

            cropZoom: 1,

            cropPixels:
              null,
          })),

      setRotation:
        (degrees) =>
          set({
            rotation:
              normalizeRotation(
                degrees,
              ),

            crop: {
              ...DEFAULT_CROP,
            },

            cropZoom: 1,

            cropPixels:
              null,
          }),

      toggleFlipX:
        () =>
          set((state) => ({
            flipX:
              !state.flipX,
          })),

      toggleFlipY:
        () =>
          set((state) => ({
            flipY:
              !state.flipY,
          })),

      resetTransform:
        () =>
          set({
            rotation: 0,

            flipX: false,
            flipY: false,

            crop: {
              ...DEFAULT_CROP,
            },

            cropZoom: 1,

            cropPixels:
              null,
          }),

      setFilter:
        (
          key,
          value,
        ) =>
          set((state) => ({
            filters: {
              ...state.filters,
              [key]: value,
            },
          })),

      resetFilters:
        () =>
          set({
            filters: {
              ...DEFAULT_FILTERS,
            },
          }),

      setCrop:
        (crop) =>
          set({
            crop,
          }),

      setCropZoom:
        (cropZoom) =>
          set({
            cropZoom,
          }),

      setCropAspect:
        (cropAspect) =>
          set({
            cropAspect,

            crop: {
              ...DEFAULT_CROP,
            },

            cropZoom: 1,

            cropPixels:
              null,
          }),

      setCropPixels:
        (cropPixels) =>
          set({
            cropPixels,
          }),

      resetCrop:
        () =>
          set({
            crop: {
              ...DEFAULT_CROP,
            },

            cropZoom: 1,

            cropAspect:
              null,

            cropPixels:
              null,
          }),

      setOutputFormat:
        (outputFormat) =>
          set({
            outputFormat,
          }),

      setQuality:
        (quality) =>
          set({
            quality:
              Math.min(
                100,
                Math.max(
                  1,
                  quality,
                ),
              ),
          }),

      setExportName:
        (exportName) =>
          set({
            exportName,
          }),

      setProcessing:
        (isProcessing) =>
          set({
            isProcessing,
          }),

      resetAll: () =>
        set((state) => {
          if (
            !state.image
          ) {
            return {};
          }

          return {
            resizeEnabled:
              false,

            resizeWidth:
              state.image
                .width,

            resizeHeight:
              state.image
                .height,

            rotation: 0,

            flipX: false,
            flipY: false,

            filters: {
              ...DEFAULT_FILTERS,
            },

            crop: {
              ...DEFAULT_CROP,
            },

            cropZoom: 1,

            cropAspect:
              null,

            cropPixels:
              null,
          };
        }),
    }),
  );