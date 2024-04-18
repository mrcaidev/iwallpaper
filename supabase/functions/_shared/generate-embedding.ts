/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const model = new Supabase.ai.Session("gte-small");

export async function generateEmbedding(prompt: string) {
  return await model.run(prompt, { mean_pool: true, normalize: true });
}
