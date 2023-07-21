import { useUser } from "contexts/user";
import { useState } from "react";
import { supabase } from "utils/supabase";
import { Wallpaper } from "utils/types";
import { WallpaperProvider } from "./context";
import { Detail } from "./detail";
import { Figure } from "./figure";
import { Hide } from "./hide";
import { Like } from "./like";

type Props = {
  wallpaper: Wallpaper;
};

export function WallpaperThumbnail({ wallpaper }: Props) {
  const [shouldShowDetail, setShouldShowDetail] = useState(false);

  const user = useUser();

  const handleClick = async () => {
    setShouldShowDetail(true);

    if (!user) {
      return;
    }

    await supabase
      .from("histories")
      .update({ is_scrutinized: true })
      .eq("wallpaper_id", wallpaper.id);
  };

  return (
    <WallpaperProvider wallpaper={wallpaper}>
      <div className="group relative rounded-md overflow-hidden">
        <Figure isThumbnail />
        <button
          type="button"
          onClick={handleClick}
          className="absolute left-0 right-0 top-0 bottom-0"
        >
          <span className="sr-only">View wallpaper details</span>
        </button>
        <div className="hidden group-hover:block absolute left-4 top-4">
          <Hide isThumbnail />
        </div>
        <div className="hidden group-hover:block absolute right-4 top-4">
          <Like isThumbnail />
        </div>
      </div>
      {shouldShowDetail && (
        <Detail onClose={() => setShouldShowDetail(false)} />
      )}
    </WallpaperProvider>
  );
}
