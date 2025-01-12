"use client";

import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
