import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HUGGING_FACE_ACCESS_TOKEN);

export async function embed(input: string): Promise<number[]>;
export async function embed(inputs: string[]): Promise<number[][]>;
export async function embed(
  inputs: string | string[],
): Promise<number[] | number[][]> {
  const output = await inference.featureExtraction({
    inputs,
    model: "sentence-transformers/all-MiniLM-L6-v2",
  });

  return output as number[] | number[][];
}
