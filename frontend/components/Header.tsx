import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React from "react";
import { MdMenu, MdAccountCircle } from "react-icons/md";
import { useRouter } from "next/navigation";
import Menu from "./Menu";
import { request } from "@/lib/axiosUtils";

type Props = {
  isNavOpen: boolean;
  title: string;
  setIsNavOpen: (value: boolean) => void;
};

function Header({ isNavOpen, setIsNavOpen, title }: Props) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleNav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsNavOpen(!isNavOpen);
  };

  const menuItems = [
    {
      label: "ログアウト",
      onClick: async () => {
        try {
          await request({
            url: "/api/v1/auth/logout/",
            method: "post",
          });
        } finally {
          logout();
          router.replace("/login");
        }
      },
    },
  ];

  return (
    <>
      <header className="flex justify-between items-center bg-slate-700 h-10 px-4">
        <button onClick={toggleNav} className="m-2">
          <MdMenu size={27} color="white" />
        </button>
        <h1 className="text-white text-xl font-bold flex-grow text-center">
          {title}
        </h1>
        <Menu items={menuItems}>
          <div className="text-white text-xl font-bold mr-3">
            {user?.username}
          </div>
          <MdAccountCircle size={27} color="white" />
        </Menu>
      </header>

      <nav
        onClick={(e) => e.stopPropagation()}
        className={`absolute left-0 w-64 h-full bg-slate-700 z-20 shadow-xl top-10 transition-all duration-300 ease-in-out ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="text-white text-lg">
          <li className="link">
            <Link href="/">Home</Link>
          </li>
          <li className="link">
            <Link href="/sample">Sample</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Header;
