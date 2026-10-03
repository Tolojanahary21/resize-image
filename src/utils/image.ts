import * as UTIF from "utif";

import {
  detectInputFormat,
} from "@/lib/formats";

import type {
  ImageAsset,
  InputFormat,
} from "@/types/image";

import {
  validateImageFile,
} from "@/utils/file";

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/png",
  quality = 1,
): Promise<Blob> {
  return new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Impossible de créer l'image.",
              ),
            );

            return;
          }

          resolve(blob);
        },
        type,
        quality,
      );
    },
  );
}

function sanitizeSvg(
  source: string,
) {
  const parser =
    new DOMParser();

  const document = parser.parseFromString(
    source,
    "image/svg+xml",
  );

  if (
    document.querySelector(
      "parsererror",
    )
  ) {
    throw new Error(
      "Le fichier SVG est invalide.",
    );
  }

  document
    .querySelectorAll(
      "script, foreignObject, iframe, object, embed",
    )
    .forEach((element) =>
      element.remove(),
    );

  document
    .querySelectorAll("*")
    .forEach((element) => {
      for (const attribute of Array.from(
        element.attributes,
      )) {
        const name =
          attribute.name.toLowerCase();

        const value =
          attribute.value
            .trim()
            .toLowerCase();

        if (
          name.startsWith("on")
        ) {
          element.removeAttribute(
            attribute.name,
          );

          continue;
        }

        if (
          name === "href" ||
          name === "xlink:href"
        ) {
          const safeReference =
            value.startsWith("#") ||
            value.startsWith(
              "data:image/png",
            ) ||
            value.startsWith(
              "data:image/jpeg",
            ) ||
            value.startsWith(
              "data:image/webp",
            );

          if (!safeReference) {
            element.removeAttribute(
              attribute.name,
            );
          }
        }

        if (
          name === "style" &&
          (value.includes("javascript:") ||
            value.includes("expression("))
        ) {
          element.removeAttribute(
            attribute.name,
          );
        }
      }
    });

  const svg =
    document.documentElement;

  svg.setAttribute(
    "xmlns",
    "http://www.w3.org/2000/svg",
  );

  return new XMLSerializer().serializeToString(
    svg,
  );
}

async function prepareSvg(
  file: File,
) {
  const source =
    await file.text();

  const sanitized =
    sanitizeSvg(source);

  return new Blob(
    [sanitized],
    {
      type: "image/svg+xml",
    },
  );
}

async function prepareTiff(
  file: File,
) {
  const buffer =
    await file.arrayBuffer();

  const ifds =
    UTIF.decode(buffer);

  if (!ifds.length) {
    throw new Error(
      "Impossible de lire ce TIFF.",
    );
  }

  const page = ifds[0];

  UTIF.decodeImage(
    buffer,
    page,
  );

  const rgba =
    UTIF.toRGBA8(page);

  const canvas =
    document.createElement("canvas");

  canvas.width =
    page.width;

  canvas.height =
    page.height;

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Canvas indisponible.",
    );
  }

  const data =
    new Uint8ClampedArray(
      rgba.buffer.slice(
        rgba.byteOffset,
        rgba.byteOffset +
          rgba.byteLength,
      ),
    );

  const imageData =
    new ImageData(
      data,
      page.width,
      page.height,
    );

  context.putImageData(
    imageData,
    0,
    0,
  );

  return canvasToBlob(
    canvas,
    "image/png",
  );
}

async function prepareAvifFallback(
  file: File,
) {
  const { decode } =
    await import(
      "@jsquash/avif"
    );

  const decoded =
    await decode(
      await file.arrayBuffer(),
    );

  const canvas =
    document.createElement("canvas");

  canvas.width =
    decoded.width;

  canvas.height =
    decoded.height;

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Canvas indisponible.",
    );
  }

  context.putImageData(
    decoded as ImageData,
    0,
    0,
  );

  return canvasToBlob(
    canvas,
    "image/png",
  );
}

async function canDecode(
  blob: Blob,
) {
  try {
    const bitmap =
      await createImageBitmap(blob);

    bitmap.close();

    return true;
  } catch {
    return false;
  }
}

async function getDimensions(
  blob: Blob,
): Promise<{
  width: number;
  height: number;
}> {
  try {
    const bitmap =
      await createImageBitmap(blob);

    const dimensions = {
      width: bitmap.width,
      height: bitmap.height,
    };

    bitmap.close();

    return dimensions;
  } catch {
    return new Promise(
      (resolve, reject) => {
        const url =
          URL.createObjectURL(blob);

        const image =
          new Image();

        image.onload = () => {
          const dimensions = {
            width:
              image.naturalWidth,
            height:
              image.naturalHeight,
          };

          URL.revokeObjectURL(
            url,
          );

          resolve(
            dimensions,
          );
        };

        image.onerror = () => {
          URL.revokeObjectURL(
            url,
          );

          reject(
            new Error(
              "Impossible de décoder l'image.",
            ),
          );
        };

        image.src = url;
      },
    );
  }
}

async function getWorkingBlob(
  file: File,
  format: InputFormat,
) {
  if (format === "svg") {
    return prepareSvg(file);
  }

  if (format === "tiff") {
    return prepareTiff(file);
  }

  if (
    format === "avif" &&
    !(await canDecode(file))
  ) {
    return prepareAvifFallback(
      file,
    );
  }

  return file;
}

export async function prepareImageFile(
  file: File,
): Promise<ImageAsset> {
  const validation =
    validateImageFile(file);

  if (!validation.valid) {
    throw new Error(
      validation.error ??
        "Fichier invalide.",
    );
  }

  const format =
    detectInputFormat(file);

  if (!format) {
    throw new Error(
      "Format non supporté.",
    );
  }

  const workingBlob =
    await getWorkingBlob(
      file,
      format,
    );

  const dimensions =
    await getDimensions(
      workingBlob,
    );

  if (
    dimensions.width <= 0 ||
    dimensions.height <= 0
  ) {
    throw new Error(
      "Dimensions invalides.",
    );
  }

  const url =
    URL.createObjectURL(
      workingBlob,
    );

  return {
    id:
      crypto.randomUUID(),

    originalFile: file,

    workingBlob,

    url,

    name: file.name,

    sourceFormat:
      format,

    mime:
      file.type ||
      `image/${format}`,

    size:
      file.size,

    width:
      dimensions.width,

    height:
      dimensions.height,
  };
}

export function buildFilterCss(
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    grayscale: number;
    sepia: number;
    blur: number;
  },
) {
  return [
    `brightness(${filters.brightness}%)`,
    `contrast(${filters.contrast}%)`,
    `saturate(${filters.saturation}%)`,
    `grayscale(${filters.grayscale}%)`,
    `sepia(${filters.sepia}%)`,
    `blur(${filters.blur}px)`,
  ].join(" ");
}

export function loadHtmlImage(
  url: string,
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const image =
        new Image();

      image.onload = () =>
        resolve(image);

      image.onerror = () =>
        reject(
          new Error(
            "Impossible de charger l'image.",
          ),
        );

      image.src = url;
    },
  );
}