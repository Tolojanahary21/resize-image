export type InputFormat = "jpeg" | "png" | "webp" | "avif" | "svg" | "gif" | "bmp" | "tiff";
export type OutputFormat = "jpeg" | "png" | "webp" | "avif" | "tiff" | "svg" | "pdf";
export type EditorTool = "upload" | "resize" | "crop" | "transform" | "filters" | "export";

export type Point = { x: number; y: number };
export type CropPixels = { x: number; y: number; width: number; height: number };
export type FilterSettings = {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
  blur: number;
};

export type ImageAsset = {
  id: string;
  originalFile: File;
  workingBlob: Blob;
  url: string;
  name: string;
  sourceFormat: InputFormat;
  mime: string;
  size: number;
  width: number;
  height: number;
};

export type ImageFile = {
  file: File;
  url: string;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
};
