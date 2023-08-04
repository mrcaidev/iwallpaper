import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HF_TOKEN);
const model = "obrizum/all-MiniLM-L6-v2";

type Wallpaper = {
  tags: string[];
};

export async function createEmbeddings(wallpapers: Wallpaper[]) {
  const inputs = wallpapers.map(({ tags }) => tags.join(" "));
  const vectors = await inference.featureExtraction({ inputs, model });
  return vectors as number[][];
}
