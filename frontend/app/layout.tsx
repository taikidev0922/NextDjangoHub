"use client";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-100">
        <AuthProvider>
          <Header />
          <main className="p-5">
            <nav>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/login">login</Link>
                </li>
                <li>
                  <Link href="/sample">sample</Link>
                </li>
              </ul>
            </nav>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
