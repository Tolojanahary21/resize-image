import {
  detectInputFormat,
  MAX_FILE_SIZE,
} from "@/lib/formats";

export function validateImageFile(
  file: File,
) {
  const format =
    detectInputFormat(file);

  if (!format) {
    return {
      valid: false,
      error:
        "Ce format d'image n'est pas supporté.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error:
        "Le fichier dépasse la limite de 50 MB.",
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "Le fichier est vide.",
    };
  }

  return {
    valid: true,
    error: null,
  };
}

export function formatFileSize(
  bytes: number,
) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.min(
    Math.floor(
      Math.log(bytes) / Math.log(1024),
    ),
    units.length - 1,
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(
    index === 0 ? 0 : 2,
  )} ${units[index]}`;
}

export function removeExtension(
  filename: string,
) {
  return filename.replace(
    /\.[^/.]+$/,
    "",
  );
}

export function sanitizeFilename(
  filename: string,
) {
  return filename
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}