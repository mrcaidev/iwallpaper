import { Backdrop } from "components/modal";
import { Close } from "./close";
import { useWallpaper } from "./context";
import { Download } from "./download";
import { Figure } from "./figure";
import { Hide } from "./hide";
import { Like } from "./like";
import { Tag } from "./tag";

type Props = {
  onClose: () => void;
};

export function Detail({ onClose }: Props) {
  const { tags } = useWallpaper();

  return (
    <Backdrop onClose={onClose}>
      <div className="flex items-center relative rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden motion-safe:animate-fade-in motion-safe:animate-duration-200">
        <Figure />
        <div className="self-stretch flex flex-col justify-between gap-8 max-w-xs p-8 pt-14">
          <div className="space-y-3">
            <p className="font-bold text-2xl">Tags</p>
            <div className="flex items-center gap-x-4 gap-y-1 flex-wrap mb-3">
              {tags.map((tag) => (
                <Tag key={tag} name={tag} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Like />
            <Hide />
            <Download />
          </div>
        </div>
        <div className="absolute right-4 top-4">
          <Close onClose={onClose} />
        </div>
      </div>
    </Backdrop>
  );
}
