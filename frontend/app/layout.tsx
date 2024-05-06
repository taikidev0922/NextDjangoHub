"use client";
import { AuthProvider } from "@/context/AuthContext";
import "@grapecity/wijmo.styles/wijmo.css";
import "./globals.css";
import { useEffect } from "react";
import { ToastProvider } from "@/context/Toast/ToastContext";
import { DialogProvider } from "@/context/DialogContext";
import { LoadingProvider } from "@/context/LoadingContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    setTimeout(() => {
      const wijmoEvaluationTag = document.querySelectorAll("a");
      wijmoEvaluationTag.forEach((tag) => {
        if (tag.text.includes("Wijmo Evaluation Version")) {
          tag.parentElement?.remove();
        }
      });
    }, 100);
  }, []);
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <DialogProvider>
            <LoadingProvider>
              <ToastProvider>{children}</ToastProvider>
            </LoadingProvider>
          </DialogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
