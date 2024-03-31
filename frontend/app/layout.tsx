"use client";
import { AuthProvider } from "@/context/AuthContext";
import "@grapecity/wijmo.styles/wijmo.css";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  setTimeout(() => {
    const wijmoEvaluationTag = document.querySelectorAll("a");
    wijmoEvaluationTag.forEach((tag) => {
      if (tag.text.includes("Wijmo Evaluation Version")) {
        tag.parentElement?.remove();
      }
    });
  }, 100);
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <body>{children}</body>
        </AuthProvider>
      </body>
    </html>
  );
}
