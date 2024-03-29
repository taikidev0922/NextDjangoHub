import { useAuth } from "@/context/AuthContext";
import React from "react";

function Header() {
  const { user } = useAuth();
  return (
    <header className="flex justify-between items-center bg-slate-400">
      <h1>header</h1>
      <h1>{user?.username}</h1>
    </header>
  );
}

export default Header;
