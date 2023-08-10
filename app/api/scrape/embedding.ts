import { pipeline } from "@xenova/transformers";

const pipe = await pipeline("feature-extraction", "Supabase/gte-small");

type Wallpaper = {
  tags: string[];
};

export async function createEmbeddings(wallpapers: Wallpaper[]) {
  const inputs = wallpapers.map(({ tags }) => tags.join(" "));
  const output = await pipe(inputs, { pooling: "mean", normalize: true });
  return Array.from(output.data) as number[][];
}
