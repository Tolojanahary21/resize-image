import * as UTIF from "utif";

import {
  PDFDocument,
} from "pdf-lib";

import {
  getExtension,
} from "@/lib/formats";

import {
  useEditorStore,
} from "@/store/editor-store";

import type {
  OutputFormat,
} from "@/types/image";

import {
  sanitizeFilename,
} from "@/utils/file";

import {
  renderEditedCanvas,
} from "@/utils/render";

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number,
): Promise<Blob> {
  return new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Impossible d'encoder l'image.",
              ),
            );

            return;
          }

          resolve(blob);
        },
        mime,
        quality,
      );
    },
  );
}

function flattenOnWhite(
  source: HTMLCanvasElement,
) {
  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width =
    source.width;

  canvas.height =
    source.height;

  const context =
    canvas.getContext(
      "2d",
    );

  if (!context) {
    throw new Error(
      "Canvas indisponible.",
    );
  }

  context.fillStyle =
    "#ffffff";

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  context.drawImage(
    source,
    0,
    0,
  );

  return canvas;
}

async function encodeAvif(
  canvas: HTMLCanvasElement,
  quality: number,
) {
  const context =
    canvas.getContext(
      "2d",
    );

  if (!context) {
    throw new Error(
      "Canvas indisponible.",
    );
  }

  const imageData =
    context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

  const { encode } =
    await import(
      "@jsquash/avif"
    );

  const cqLevel =
    Math.round(
      ((100 - quality) /
        100) *
        63,
    );

  const buffer =
    await encode(
      imageData,
      {
        quality: Math.max(0, Math.min(100, quality)),
        speed: 6,
      },
    );

  return new Blob(
    [new Uint8Array(buffer)],
    {
      type: "image/avif",
    },
  );
}

async function encodeTiff(
  canvas: HTMLCanvasElement,
) {
  const context =
    canvas.getContext(
      "2d",
    );

  if (!context) {
    throw new Error(
      "Canvas indisponible.",
    );
  }

  const data =
    context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

  const rgba =
    new Uint8Array(
      data.data,
    );

  const buffer =
    UTIF.encodeImage(
      rgba.buffer,
      canvas.width,
      canvas.height,
    );

  return new Blob(
    [buffer],
    {
      type: "image/tiff",
    },
  );
}

async function blobToDataUrl(
  blob: Blob,
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () =>
        resolve(
          String(
            reader.result,
          ),
        );

      reader.onerror = () =>
        reject(
          new Error(
            "Impossible de lire le fichier.",
          ),
        );

      reader.readAsDataURL(
        blob,
      );
    },
  );
}

async function encodeSvg(
  canvas: HTMLCanvasElement,
) {
  const png =
    await canvasToBlob(
      canvas,
      "image/png",
    );

  const dataUrl =
    await blobToDataUrl(
      png,
    );

  const svg = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${canvas.width}"
  height="${canvas.height}"
  viewBox="0 0 ${canvas.width} ${canvas.height}"
>
  <image
    href="${dataUrl}"
    width="${canvas.width}"
    height="${canvas.height}"
  />
</svg>`;

  return new Blob(
    [svg],
    {
      type: "image/svg+xml",
    },
  );
}

async function encodePdf(
  canvas: HTMLCanvasElement,
) {
  const png =
    await canvasToBlob(
      canvas,
      "image/png",
    );

  const pngBytes =
    new Uint8Array(
      await png.arrayBuffer(),
    );

  const pdf =
    await PDFDocument.create();

  const embedded =
    await pdf.embedPng(
      pngBytes,
    );

  const page =
    pdf.addPage([
      canvas.width,
      canvas.height,
    ]);

  page.drawImage(
    embedded,
    {
      x: 0,
      y: 0,
      width:
        canvas.width,
      height:
        canvas.height,
    },
  );

  const bytes =
    await pdf.save();

  return new Blob(
    [new Uint8Array(bytes)],
    {
      type: "application/pdf",
    },
  );
}

async function encodeCanvas(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number,
) {
  switch (format) {
    case "jpeg": {
      const flattened =
        flattenOnWhite(
          canvas,
        );

      return canvasToBlob(
        flattened,
        "image/jpeg",
        quality / 100,
      );
    }

    case "png":
      return canvasToBlob(
        canvas,
        "image/png",
      );

    case "webp":
      return canvasToBlob(
        canvas,
        "image/webp",
        quality / 100,
      );

    case "avif":
      return encodeAvif(
        canvas,
        quality,
      );

    case "tiff":
      return encodeTiff(
        canvas,
      );

    case "svg":
      return encodeSvg(
        canvas,
      );

    case "pdf":
      return encodePdf(
        canvas,
      );
  }
}

function downloadBlob(
  blob: Blob,
  filename: string,
) {
  const url =
    URL.createObjectURL(
      blob,
    );

  const anchor =
    document.createElement(
      "a",
    );

  anchor.href =
    url;

  anchor.download =
    filename;

  document.body.appendChild(
    anchor,
  );

  anchor.click();

  anchor.remove();

  setTimeout(() => {
    URL.revokeObjectURL(
      url,
    );
  }, 1000);
}

export async function exportCurrentImage() {
  const state =
    useEditorStore.getState();

  if (!state.image) {
    throw new Error(
      "Aucune image à exporter.",
    );
  }

  state.setProcessing(
    true,
  );

  try {
    const canvas =
      await renderEditedCanvas(
        state,
      );

    const blob =
      await encodeCanvas(
        canvas,
        state.outputFormat,
        state.quality,
      );

    if (!blob) {
      throw new Error("Impossible d'encoder l'image.");
    }

    const baseName =
      sanitizeFilename(
        state.exportName,
      ) || "kid-image";

    const extension =
      getExtension(
        state.outputFormat,
      );

    downloadBlob(
      blob,
      `${baseName}.${extension}`,
    );

    return {
      size: blob.size,

      width:
        canvas.width,

      height:
        canvas.height,
    };
  } finally {
    useEditorStore
      .getState()
      .setProcessing(
        false,
      );
  }
}
