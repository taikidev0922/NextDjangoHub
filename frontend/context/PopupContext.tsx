"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Popup as WijmoPopup } from "@grapecity/wijmo.input";
import { Popup } from "@grapecity/wijmo.react.input";
import Button from "@/components/Button";
import {
  MdError,
  MdOutlineWarning,
  MdInfo,
  MdCheckCircle,
} from "react-icons/md";
import ResultsView from "@/components/ResultsView/ResultsView";

type PopupSender = {
  type: "confirm" | "error" | "info" | "warning";
  text?: string;
  results?: string[];
  header?: string;
  onOk?: () => void;
  onCancel?: () => void;
};

interface PopupContextType {
  showPopup: (popup: PopupSender) => void;
  popup: WijmoPopup | undefined;
}

const popupCongig = {
  confirm: {
    icon: <MdCheckCircle />,
    bgColor: "bg-green-500",
    defaultHeader: "確認",
  },
  info: {
    icon: <MdInfo />,
    bgColor: "bg-blue-500",
    defaultHeader: "情報",
  },
  warning: {
    icon: <MdOutlineWarning />,
    bgColor: "bg-yellow-500",
    defaultHeader: "警告",
  },
  error: {
    icon: <MdError />,
    bgColor: "bg-red-500",
    defaultHeader: "エラー",
  },
};

const PopupContext = createContext<PopupContextType | undefined>({
  showPopup: () => {
    throw new Error("showPopup is called without a PopupProvider");
  },
  popup: undefined,
});

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

  const showPopup = useCallback(
    (sender: PopupSender) => {
      if (!sender.text && !sender.results) {
        throw new Error("text or results is required");
      }
      if (!popup) {
        throw new Error("popup is not initialized");
      }
      setPopupState(sender);
      popup?.show(true, (e: WijmoPopup) => {
        if (e.dialogResult == "wj-hide-ok") {
          sender.onOk?.();
        }
        if (e.dialogResult == "wj-hide-cancel") {
          sender.onCancel?.();
        }
      });
    },
    [popup]
  );

  const initPopup = (e: WijmoPopup) => {
    console.log("popupレンダリング");
    e.fadeOut = false;
    setPopup(e);
  };

  return (
    <PopupContext.Provider value={{ showPopup, popup }}>
      <Popup id="frmLoginPopup" initialized={initPopup} className="w-96">
        <div
          className={`text-lg font-semibold ${popupCongig[popupState.type].bgColor} text-white pl-2 pr-2 flex gap-2 items-center`}
        >
          {popupCongig[popupState.type].icon}
          {popupState.header
            ? popupState.header
            : popupCongig[popupState.type].defaultHeader}
        </div>
        {popupState.text && (
          <div className="text-sm m-3 break-words">{popupState.text}</div>
        )}
        {popupState.results && <ResultsView itemsSource={popupState.results} />}
        <div className="flex gap-2 justify-end my-1 px-2">
          {popupState.onOk ? (
            <>
              <Button className="btn btn-primary wj-hide-ok">はい</Button>
              <Button className="btn-outline wj-hide-cancel">いいえ</Button>
            </>
          ) : (
            <Button className="btn wj-hide-cancel">閉じる</Button>
          )}
        </div>
      </Popup>
      {children}
    </PopupContext.Provider>
  );
};
