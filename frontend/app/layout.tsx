import { AuthProvider } from "@/context/AuthContext";
import "@grapecity/wijmo.styles/wijmo.css";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
