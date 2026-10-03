"use client";

import Cropper from "react-easy-crop";

import {
  ImagePlus,
  Maximize2,
  Minus,
  Plus,
  Upload,
} from "lucide-react";

import {
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useDropzone,
} from "react-dropzone";

import {
  toast,
} from "sonner";

import {
  DROPZONE_ACCEPT,
} from "@/lib/formats";

import {
  useEditorStore,
} from "@/store/editor-store";

import {
  buildFilterCss,
  prepareImageFile,
} from "@/utils/image";

import {
  formatFileSize,
} from "@/utils/file";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

export default function EditorCanvas() {
  const image =
    useEditorStore(
      (state) =>
        state.image,
    );

  const setImage =
    useEditorStore(
      (state) =>
        state.setImage,
    );

  const activeTool =
    useEditorStore(
      (state) =>
        state.activeTool,
    );

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

  const filters =
    useEditorStore(
      (state) =>
        state.filters,
    );

  const crop =
    useEditorStore(
      (state) =>
        state.crop,
    );

  const cropZoom =
    useEditorStore(
      (state) =>
        state.cropZoom,
    );

  const cropAspect =
    useEditorStore(
      (state) =>
        state.cropAspect,
    );

  const setCrop =
    useEditorStore(
      (state) =>
        state.setCrop,
    );

  const setCropZoom =
    useEditorStore(
      (state) =>
        state.setCropZoom,
    );

  const setCropPixels =
    useEditorStore(
      (state) =>
        state.setCropPixels,
    );

  const [zoom, setZoom] =
    useState(1);

  const [
    position,
    setPosition,
  ] = useState({
    x: 0,
    y: 0,
  });

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);

  const dragStart =
    useRef({
      pointerX: 0,
      pointerY: 0,
      imageX: 0,
      imageY: 0,
    });

  const resetPreview =
    useCallback(() => {
      setZoom(1);

      setPosition({
        x: 0,
        y: 0,
      });
    }, []);

  useEffect(() => {
    resetPreview();
  }, [
    image?.id,
    resetPreview,
  ]);

  const handleFile =
    useCallback(
      async (
        file: File,
      ) => {
        try {
          const prepared =
            await prepareImageFile(
              file,
            );

          setImage(
            prepared,
          );

          toast.success(
            "Image chargée.",
          );
        } catch (error) {
          toast.error(
            error instanceof
              Error
              ? error.message
              : "Impossible de charger cette image.",
          );
        }
      },
      [setImage],
    );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    accept:
      DROPZONE_ACCEPT,

    multiple: false,

    maxFiles: 1,

    onDropAccepted:
      (files) => {
        if (
          files[0]
        ) {
          void handleFile(
            files[0],
          );
        }
      },

    onDropRejected:
      () => {
        toast.error(
          "Fichier non supporté ou trop volumineux.",
        );
      },
  });

  function zoomIn() {
    setZoom(
      (current) =>
        Math.min(
          MAX_ZOOM,
          current + 0.1,
        ),
    );
  }

  function zoomOut() {
    setZoom(
      (current) =>
        Math.max(
          MIN_ZOOM,
          current - 0.1,
        ),
    );
  }

  function handleWheel(
    event: ReactWheelEvent<HTMLDivElement>,
  ) {
    if (
      activeTool ===
      "crop"
    ) {
      return;
    }

    event.preventDefault();

    const delta =
      event.deltaY < 0
        ? 0.1
        : -0.1;

    setZoom(
      (current) =>
        Math.min(
          MAX_ZOOM,
          Math.max(
            MIN_ZOOM,
            current +
              delta,
          ),
        ),
    );
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (
      activeTool ===
        "crop" ||
      event.button !== 0
    ) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    dragStart.current = {
      pointerX:
        event.clientX,

      pointerY:
        event.clientY,

      imageX:
        position.x,

      imageY:
        position.y,
    };

    setIsDragging(
      true,
    );
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (
      !isDragging ||
      activeTool ===
        "crop"
    ) {
      return;
    }

    setPosition({
      x:
        dragStart
          .current
          .imageX +
        event.clientX -
        dragStart
          .current
          .pointerX,

      y:
        dragStart
          .current
          .imageY +
        event.clientY -
        dragStart
          .current
          .pointerY,
    });
  }

  function handlePointerUp(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    setIsDragging(
      false,
    );
  }

  if (!image) {
    return (
      <main className="flex min-h-[520px] items-center justify-center bg-zinc-100 p-4 md:p-6">
        <div
          {...getRootProps()}
          className={`flex min-h-[460px] w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed bg-white p-8 text-center transition ${
            isDragActive
              ? "border-black bg-zinc-50"
              : "border-zinc-300 hover:border-zinc-500"
          }`}
        >
          <input
            {...getInputProps()}
          />

          <div className="flex max-w-md flex-col items-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <ImagePlus
                size={30}
              />
            </div>

            <h2 className="text-xl font-semibold">
              {isDragActive
                ? "Déposez l’image ici"
                : "Importez votre image"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Traitement entièrement local dans votre navigateur.
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white">
              <Upload
                size={18}
              />

              Choisir une image
            </div>

            <p className="mt-4 text-xs text-zinc-400">
              JPG · PNG · WEBP · AVIF · SVG · GIF · BMP · TIFF
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Maximum 50 MB
            </p>
          </div>
        </div>
      </main>
    );
  }

  const filterCss =
    buildFilterCss(
      filters,
    );

  return (
    <main className="flex min-h-[520px] min-w-0 flex-col bg-zinc-100 p-4 md:p-6">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
          <div className="min-w-0">
            <p className="max-w-[350px] truncate text-sm font-medium">
              {
                image.name
              }
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {
                image.width
              }
              ×
              {
                image.height
              } px ·{" "}
              {formatFileSize(
                image.size,
              )}
            </p>
          </div>

          {activeTool !==
            "crop" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={
                  zoomOut
                }
                className="editor-button"
              >
                <Minus
                  size={16}
                />
              </button>

              <span className="min-w-14 text-center text-xs">
                {Math.round(
                  zoom *
                    100,
                )}
                %
              </span>

              <button
                type="button"
                onClick={
                  zoomIn
                }
                className="editor-button"
              >
                <Plus
                  size={16}
                />
              </button>

              <button
                type="button"
                onClick={
                  resetPreview
                }
                className="editor-button"
                title="Ajuster"
              >
                <Maximize2
                  size={16}
                />
              </button>
            </div>
          )}
        </div>

        <div
          onWheel={
            handleWheel
          }
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
          onPointerCancel={() =>
            setIsDragging(
              false,
            )
          }
          onDoubleClick={
            resetPreview
          }
          className={`relative min-h-[430px] flex-1 overflow-hidden bg-[linear-gradient(45deg,#e4e4e7_25%,transparent_25%),linear-gradient(-45deg,#e4e4e7_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e4e4e7_75%),linear-gradient(-45deg,transparent_75%,#e4e4e7_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] ${
            activeTool ===
            "crop"
              ? ""
              : isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
          }`}
        >
          {activeTool ===
          "crop" ? (
            <Cropper
              image={
                image.url
              }
              crop={
                crop
              }
              zoom={
                cropZoom
              }
              rotation={
                rotation
              }
              aspect={
                cropAspect ??
                image.width /
                  image.height
              }
              minZoom={1}
              maxZoom={3}
              showGrid
              objectFit="contain"
              onCropChange={
                setCrop
              }
              onZoomChange={
                setCropZoom
              }
              onCropComplete={(
                _,
                pixels,
              ) =>
                setCropPixels(
                  pixels,
                )
              }
            />
          ) : (
            <div className="flex h-full min-h-[430px] items-center justify-center p-8">
              <img
                src={
                  image.url
                }
                alt={
                  image.name
                }
                draggable={
                  false
                }
                className="max-h-[70vh] max-w-full object-contain will-change-transform"
                style={{
                  filter:
                    filterCss,

                  transform: `
                    translate(${position.x}px, ${position.y}px)
                    scale(${zoom})
                    rotate(${rotation}deg)
                    scaleX(${flipX ? -1 : 1})
                    scaleY(${flipY ? -1 : 1})
                  `,
                }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between border-t border-zinc-200 px-4 py-2 text-xs text-zinc-400">
          {activeTool ===
          "crop" ? (
            <>
              <span>
                Déplacez l’image pour cadrer
              </span>

              <span>
                Molette : zoom
              </span>
            </>
          ) : (
            <>
              <span>
                Glisser : déplacer
              </span>

              <span>
                Molette : zoom · Double clic : recentrer
              </span>
            </>
          )}
        </div>
      </div>
    </main>
  );
}