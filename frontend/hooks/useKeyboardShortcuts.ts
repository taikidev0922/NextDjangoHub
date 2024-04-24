import { useEffect } from "react";

type ShortcutAction = () => void;
interface Shortcut {
  keys: string;
  action: ShortcutAction;
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        // ショートカットキーの組み合わせを生成
        const keysCombination = shortcut.keys
          .split("+")
          .map((key) => key.trim())
          .sort()
          .join("+");
        const eventKeyCombination = [
          event.ctrlKey ? "Ctrl" : "",
          event.shiftKey ? "Shift" : "",
          event.altKey ? "Alt" : "",
          event.key.toUpperCase(), // ファンクションキーを含むため、toUpperCase() を使用
        ]
          .filter(Boolean) // 空の文字列を除外
          .sort()
          .join("+");

        if (keysCombination === eventKeyCombination) {
          event.preventDefault(); // ブラウザのデフォルトの挙動をキャンセル
          shortcut.action(); // 定義されたアクションを実行
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]); // 依存配列にshortcutsを指定
};
