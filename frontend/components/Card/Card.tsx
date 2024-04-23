import { useAccordion } from "@/context/AccordionContext";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

function Card({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { toggleAccordion } = useAccordion();
  const [isVisible, setIsVisible] = useState(true);

  const onClickToggleAccordion = () => {
    setIsVisible(!isVisible);
    toggleAccordion();
  };

  return (
    <div className="bg-white border relative">
      <div className="flex justify-between items-center bg-green-800 h-7 pr-2">
        <h2 className="text-white ml-2 text-md font-bold">{title}</h2>
        <button
          className="text-gray-500 text-sm"
          onClick={onClickToggleAccordion}
        >
          {isVisible ? (
            <MdKeyboardArrowUp size={24} color="white" />
          ) : (
            <MdKeyboardArrowDown size={24} color="white" />
          )}
        </button>
      </div>
      {isVisible && <div className="text-gray-500 text-sm p-2">{children}</div>}
    </div>
  );
}

export default Card;
