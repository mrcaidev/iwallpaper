export type User = {
  id: string;
  email: string;
  nickName: string;
  avatarUrl: string;
};

export type Wallpaper = {
  id: string;
  slug: string;
  rawUrl: string;
  regularUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  tags: string[];
};
