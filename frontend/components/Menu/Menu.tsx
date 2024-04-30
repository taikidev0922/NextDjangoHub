"use client";
import { Popup } from "@grapecity/wijmo.react.input";
import { Popup as PopupType } from "@grapecity/wijmo.input";

type PropType = {
  children: React.ReactNode;
  items: {
    label: string;
    onClick: () => void;
  }[];
};

export default function Menu({ children, items }: PropType) {
  const onMenuInit = (e: PopupType) => {
    e.owner = document.querySelector(".menu") as HTMLElement;
  };
  return (
    <>
      <div className="menu flex items-center cursor-pointer">{children}</div>
      <Popup
        showTrigger="Click"
        hideTrigger="Blur"
        initialized={onMenuInit}
        className="p-3 absolute"
      >
        <div className="flex items-start  flex-col gap-2 ">
          {items.map((item) => (
            <button onClick={item.onClick} key={item.label}>
              <p>{item.label}</p>
            </button>
          ))}
        </div>
      </Popup>
    </>
  );
}
