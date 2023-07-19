import { X } from "react-feather";

type Props = {
  onClose: () => void;
};

export function Close({ onClose }: Props) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="opacity-85 hover:opacity-100 transition-opacity"
    >
      <X size={24} />
      <span className="sr-only">Close wallpaper detail</span>
    </button>
  );
}
