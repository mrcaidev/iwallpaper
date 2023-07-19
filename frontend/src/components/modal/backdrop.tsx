import { useKeyDown } from "hooks/use-key-down";
import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type Props = PropsWithChildren<{
  onClose: () => void;
}>;

export function Backdrop({ onClose, children }: Props) {
  useKeyDown("Escape", onClose);

  return createPortal(
    <>
      <div
        role="presentation"
        onClick={onClose}
        className="fixed left-0 right-0 top-0 bottom-0 bg-gray-900/85 backdrop-blur z-20 motion-safe:animate-fade-in motion-safe:animate-duration-200"
      />
      <div
        role="dialog"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/5 w-max m-8 shadow-xl z-20"
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
