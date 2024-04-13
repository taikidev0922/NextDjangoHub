"use client";
import Header from "@/components/Header";
import { LoadingProvider } from "@/context/LoadingContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { request } from "@/lib/axiosUtils";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { setUser } = useAuth();
  useEffect(() => {
    request({
      url: "/api/v1/auth/user/",
      method: "get",
    })
      .then((res) => {
        setUser(res.data);
        setIsLoggedIn(true);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, []);
  if (!isLoggedIn) {
    return <div></div>;
  }
  return (
    <LoadingProvider>
      <Header title="" isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
      <main
        className={`px-3 py-1 h-screen bg-slate-100 transition-all duration-300 ease-in-out ${
          isNavOpen ? "translate-x-64" : ""
        }`}
        style={{ width: isNavOpen ? "calc(100% - 16rem)" : "100%" }}
      >
        {children}
      </main>
    </LoadingProvider>
  );
}
