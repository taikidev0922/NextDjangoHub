import React from "react";

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex border border-gray-500 rounded-md p-1 bg-white">
      {children}
    </div>
  );
}

export default Actions;
