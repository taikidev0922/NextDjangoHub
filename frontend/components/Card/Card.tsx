import React from "react";

function Card({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="bg-white rounded-md border border-gray-500 p-3 mb-1">
      <h2 className="text-gray-500 text-sm font-bold mb-2">{title}</h2>
      <div className="text-gray-500 text-sm">{children}</div>
    </div>
  );
}

export default Card;
