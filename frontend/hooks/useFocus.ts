import { useState } from "react";

export function useFocus() {
  const [focusedStyle, setFocusedStyle] = useState("");

  const setFocusedIvent = (e: { gotFocus: any; lostFocus: any }) => {
    e.gotFocus.addHandler(() => {
      setFocusedStyle(" border box-border border-blue-600");
    });
    e.lostFocus.addHandler(() => {
      setFocusedStyle("");
    });
  };

  return {
    focusedStyle,
    setFocusedIvent,
  };
}
