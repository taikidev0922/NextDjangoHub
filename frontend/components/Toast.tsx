import React from "react";
import { MdOutlineCheck, MdOutlineError } from "react-icons/md";

function Toast({ message, type }: { message: string; type: string }) {
  return (
    <div className="mx-auto sm:w-3/4 md:w-2/4 fixed inset-x-0 top-5 z-50 animate-slideDown">
      <div
        className={`${
          type === "success" ? "bg-green-200" : "bg-red-200"
        } px-6 py-4 my-4 rounded-md text-lg flex items-center w-full`}
      >
        <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center mr-3">
          {type === "success" ? (
            <MdOutlineCheck size={24} className="text-green-500" />
          ) : (
            <MdOutlineError size={24} className="text-red-500" />
          )}
        </div>
        <span
          className={`${
            type === "success" ? "text-green-800" : "text-red-800"
          }`}
        >
          {message}
        </span>
      </div>
    </div>
  );
}

export default Toast;
