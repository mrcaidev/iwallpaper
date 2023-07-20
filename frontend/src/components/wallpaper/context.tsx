import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Wallpaper } from "utils/types";

export enum Status {
  UNBIASED,
  LIKED,
  HIDDEN,
}

type State = Wallpaper & {
  status: Status;
  setStatus: Dispatch<SetStateAction<Status>>;
};

const defaultState: State = {
  id: "",
  slug: "",
  rawUrl: "",
  regularUrl: "",
  thumbnailUrl: "",
  width: 0,
  height: 0,
  tags: [],
  status: Status.UNBIASED,
  setStatus: () => 0,
};

const WallpaperContext = createContext<State>(defaultState);

type Props = PropsWithChildren<{
  wallpaper: Wallpaper;
}>;

export function WallpaperProvider({ wallpaper, children }: Props) {
  const [status, setStatus] = useState(Status.UNBIASED);

  return (
    <WallpaperContext.Provider value={{ ...wallpaper, status, setStatus }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  return useContext(WallpaperContext);
}
