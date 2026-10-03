import type {
  EditorStoreState,
} from "@/store/editor-store";

import {
  buildFilterCss,
  loadHtmlImage,
} from "@/utils/image";

export function getRotatedSize(
  width: number,
  height: number,
  degrees: number,
) {
  const radians =
    (degrees *
      Math.PI) /
    180;

  return {
    width: Math.ceil(
      Math.abs(
        width *
          Math.cos(
            radians,
          ),
      ) +
        Math.abs(
          height *
            Math.sin(
              radians,
            ),
        ),
    ),

    height: Math.ceil(
      Math.abs(
        width *
          Math.sin(
            radians,
          ),
      ) +
        Math.abs(
          height *
            Math.cos(
              radians,
            ),
        ),
    ),
  };
}

export async function renderEditedCanvas(
  state: EditorStoreState,
) {
  const image =
    state.image;

  if (!image) {
    throw new Error(
      "Aucune image chargée.",
    );
  }

  const source =
    await loadHtmlImage(
      image.url,
    );

  const rotated =
    getRotatedSize(
      image.width,
      image.height,
      state.rotation,
    );

  const rotatedCanvas =
    document.createElement(
      "canvas",
    );

  rotatedCanvas.width =
    rotated.width;

  rotatedCanvas.height =
    rotated.height;

  const rotatedContext =
    rotatedCanvas.getContext(
      "2d",
    );

  if (!rotatedContext) {
    throw new Error(
      "Canvas indisponible.",
    );
  }

  rotatedContext.save();

  rotatedContext.translate(
    rotated.width / 2,
    rotated.height / 2,
  );

  rotatedContext.rotate(
    (state.rotation *
      Math.PI) /
      180,
  );

  rotatedContext.drawImage(
    source,
    -image.width / 2,
    -image.height / 2,
    image.width,
    image.height,
  );

  rotatedContext.restore();

  const crop =
    state.cropPixels;

  let sourceX = 0;
  let sourceY = 0;

  let sourceWidth =
    rotatedCanvas.width;

  let sourceHeight =
    rotatedCanvas.height;

  if (crop) {
    sourceX =
      Math.max(
        0,
        Math.round(
          crop.x,
        ),
      );

    sourceY =
      Math.max(
        0,
        Math.round(
          crop.y,
        ),
      );

    sourceWidth =
      Math.min(
        Math.round(
          crop.width,
        ),
        rotatedCanvas.width -
          sourceX,
      );

    sourceHeight =
      Math.min(
        Math.round(
          crop.height,
        ),
        rotatedCanvas.height -
          sourceY,
      );
  }

  sourceWidth =
    Math.max(
      1,
      sourceWidth,
    );

  sourceHeight =
    Math.max(
      1,
      sourceHeight,
    );

  const croppedCanvas =
    document.createElement(
      "canvas",
    );

  croppedCanvas.width =
    sourceWidth;

  croppedCanvas.height =
    sourceHeight;

  const cropContext =
    croppedCanvas.getContext(
      "2d",
    );

  if (!cropContext) {
    throw new Error(
      "Canvas indisponible.",
    );
  }

  cropContext.drawImage(
    rotatedCanvas,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    sourceWidth,
    sourceHeight,
  );

  const finalWidth =
    state.resizeEnabled
      ? Math.max(
          1,
          state.resizeWidth,
        )
      : sourceWidth;

  const finalHeight =
    state.resizeEnabled
      ? Math.max(
          1,
          state.resizeHeight,
        )
      : sourceHeight;

  const finalCanvas =
    document.createElement(
      "canvas",
    );

  finalCanvas.width =
    finalWidth;

  finalCanvas.height =
    finalHeight;

  const context =
    finalCanvas.getContext(
      "2d",
    );

  if (!context) {
    throw new Error(
      "Canvas indisponible.",
    );
  }

  context.imageSmoothingEnabled =
    true;

  context.imageSmoothingQuality =
    "high";

  context.save();

  context.filter =
    buildFilterCss(
      state.filters,
    );

  context.translate(
    finalWidth / 2,
    finalHeight / 2,
  );

  context.scale(
    state.flipX ? -1 : 1,
    state.flipY ? -1 : 1,
  );

  context.drawImage(
    croppedCanvas,
    -finalWidth / 2,
    -finalHeight / 2,
    finalWidth,
    finalHeight,
  );

  context.restore();

  return finalCanvas;
}