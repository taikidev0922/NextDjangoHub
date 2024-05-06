import { Toast, useToast } from "./ToastContext";
import { useEffect } from "react";

export default function ChildComponent({
  toastContext,
}: {
  toastContext: Toast;
}) {
  const { showToast } = useToast();
  useEffect(() => {
    showToast(toastContext);
  }, [showToast]);
  return <></>;
}
