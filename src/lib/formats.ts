import type {
  InputFormat,
  OutputFormat,
} from "@/types/image";

export const MAX_FILE_SIZE =
  50 * 1024 * 1024;

export const DROPZONE_ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
  "image/svg+xml": [".svg"],
  "image/gif": [".gif"],
  "image/bmp": [".bmp"],
  "image/tiff": [".tif", ".tiff"],
};

export const OUTPUT_FORMATS: Array<{
  value: OutputFormat;
  label: string;
  extension: string;
}> = [
  {
    value: "jpeg",
    label: "JPEG",
    extension: "jpg",
  },
  {
    value: "png",
    label: "PNG",
    extension: "png",
  },
  {
    value: "webp",
    label: "WebP",
    extension: "webp",
  },
  {
    value: "avif",
    label: "AVIF",
    extension: "avif",
  },
  {
    value: "tiff",
    label: "TIFF",
    extension: "tiff",
  },
  {
    value: "svg",
    label: "SVG",
    extension: "svg",
  },
  {
    value: "pdf",
    label: "PDF",
    extension: "pdf",
  },
];

export function detectInputFormat(
  file: File,
): InputFormat | null {
  const extension =
    file.name.split(".").pop()?.toLowerCase();

  if (
    file.type === "image/jpeg" ||
    extension === "jpg" ||
    extension === "jpeg"
  ) {
    return "jpeg";
  }

  if (
    file.type === "image/png" ||
    extension === "png"
  ) {
    return "png";
  }

  if (
    file.type === "image/webp" ||
    extension === "webp"
  ) {
    return "webp";
  }

  if (
    file.type === "image/avif" ||
    extension === "avif"
  ) {
    return "avif";
  }

  if (
    file.type === "image/svg+xml" ||
    extension === "svg"
  ) {
    return "svg";
  }

  if (
    file.type === "image/gif" ||
    extension === "gif"
  ) {
    return "gif";
  }

  if (
    file.type === "image/bmp" ||
    extension === "bmp"
  ) {
    return "bmp";
  }

  if (
    file.type === "image/tiff" ||
    extension === "tif" ||
    extension === "tiff"
  ) {
    return "tiff";
  }

  return null;
}

export function getSuggestedOutputFormat(
  input: InputFormat,
): OutputFormat {
  switch (input) {
    case "jpeg":
      return "jpeg";

    case "png":
      return "png";

    case "webp":
      return "webp";

    case "avif":
      return "avif";

    default:
      return "png";
  }
}

export function getExtension(
  format: OutputFormat,
) {
  return (
    OUTPUT_FORMATS.find(
      (item) => item.value === format,
    )?.extension ?? "png"
  );
}