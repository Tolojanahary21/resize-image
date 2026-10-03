import type {
  Metadata,
} from "next";

import {
  Toaster,
} from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title:
    "KID — Image Toolkit",

  description:
    "Modifier, convertir, redimensionner et compresser vos images localement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}

        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}