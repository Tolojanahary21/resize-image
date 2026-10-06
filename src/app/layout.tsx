import type {
  Metadata,
} from "next";

import {
  Toaster,
} from "sonner";

import { ThemeProvider } from "@/components/ThemeProvider";

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
        <ThemeProvider>
          {children}

          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
