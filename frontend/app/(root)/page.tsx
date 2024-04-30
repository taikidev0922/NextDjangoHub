"use client";
import { MdError, MdOutlineWarning, MdInfo } from "react-icons/md";

export default function Page() {
  return (
    <div>
      <MdError className="text-red-500" />
      <MdOutlineWarning className="text-orange-500" />
      <MdInfo className="text-blue-500" />
    </div>
  );
}
