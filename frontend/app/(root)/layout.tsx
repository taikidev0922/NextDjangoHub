"use client";
import Header from "@/components/Header";
import { LoadingProvider } from "@/context/LoadingContext";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <LoadingProvider>
      <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
      <main
        className={`p-5 h-screen bg-slate-100 transition-all duration-300 ease-in-out ${
          isNavOpen ? "translate-x-64" : ""
        }`}
        style={{ width: isNavOpen ? "calc(100% - 16rem)" : "100%" }}
      >
        {children}
      </main>
    </LoadingProvider>
  );
}
