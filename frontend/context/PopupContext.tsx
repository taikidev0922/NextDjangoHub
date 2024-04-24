import React, { createContext, useContext, useState, ReactNode } from "react";
import { Popup as WijmoPopup } from "@grapecity/wijmo.input";
import { Popup } from "@grapecity/wijmo.react.input";
import Button from "@/components/Button";

type PopupSender = {
  type: "confirm" | "error" | "info" | "warning";
  text: string;
  onOk?: () => void;
  onCancel?: () => void;
};

interface PopupContextType {
  popup: WijmoPopup | undefined;
  showPopup: (popup: PopupSender) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [popupState, setPopupState] = useState<PopupSender>({
    type: "info",
    text: "",
    onOk: undefined,
    onCancel: undefined,
  });
  const [popup, setPopup] = useState<WijmoPopup>();

  const showPopup = (sender: PopupSender) => {
    setPopupState(sender);
    popup?.show(true, (e: WijmoPopup) => {
      if (e.dialogResult == "wj-hide-ok") {
        sender.onOk?.();
      }
      if (e.dialogResult == "wj-hide-cancel") {
        sender.onCancel?.();
      }
    });
  };

  const initPopup = (e: WijmoPopup) => {
    e.fadeOut = false;
    setPopup(e);
  };

  return (
    <PopupContext.Provider value={{ popup, showPopup }}>
      <Popup id="frmLoginPopup" initialized={initPopup} className="w-96">
        {popupState.type === "confirm" && (
          <div className="text-lg font-semibold bg-green-700 text-white pl-2 pr-2">
            確認
          </div>
        )}
        {popupState.type === "info" && (
          <div className="text-lg font-semibold bg-blue-700 text-white pl-2 pr-2">
            情報
          </div>
        )}
        {popupState.type === "warning" && (
          <div className="text-lg font-semibold bg-yellow-700 text-white pl-2 pr-2">
            警告
          </div>
        )}
        {popupState.type === "error" && (
          <div className="text-lg font-semibold bg-red-700 text-white pl-2 pr-2">
            エラー
          </div>
        )}
        <div className="text-sm m-3 break-words">{popupState.text}</div>
        <div className="flex justify-end my-1">
          <Button className="btn btn-primary wj-hide-ok">はい</Button>
          <Button className="btn wj-hide-cancel">いいえ</Button>
        </div>
      </Popup>
      {children}
    </PopupContext.Provider>
  );
};
