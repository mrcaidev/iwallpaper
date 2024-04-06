export type Wallpaper = {
  id: string;
  slug: string;
  pathname: string;
  description: string;
  width: number;
  height: number;
  tags: string[];
  liked_at: string | null;
};
