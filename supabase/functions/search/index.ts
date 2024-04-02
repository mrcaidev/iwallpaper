import { HfInference } from "@huggingface/inference";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { Database } from "../types.ts";

const inference = new HfInference(Deno.env.get("HUGGING_FACE_ACCESS_TOKEN"));

const MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2";

const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const searchParamsSchema = z.object({
  query: z
    .string({
      required_error: "缺少查询参数 query",
      invalid_type_error: "query 必须为字符串",
    })
    .min(1, "query 最少 1 个字符")
    .max(50, "query 最多 50 个字符"),
  quantity: z.coerce
    .number({ invalid_type_error: "quantity 必须为数字" })
    .int("quantity 必须为整数")
    .min(1, "quantity 最少为 1")
    .max(100, "quantity 最多为 100")
    .default(20),
});

Deno.serve(async (request) => {
  const searchParams = Object.fromEntries(new URL(request.url).searchParams);

  const parseResult = await searchParamsSchema.safeParseAsync(searchParams);
  if (!parseResult.success) {
    const { message } = parseResult.error.issues[0];
    return new Response(JSON.stringify({ message }), { status: 400 });
  }
  const { query, quantity } = parseResult.data;

  const queryEmbedding = await inference.featureExtraction({
    inputs: query,
    model: MODEL_NAME,
  });

  const { data, error } = await supabase.rpc("search_wallpapers", {
    query,
    query_embedding: queryEmbedding as number[],
    quantity,
  });

  if (error) {
    const { message } = error;
    return new Response(JSON.stringify({ message }), { status: 500 });
  }

  return new Response(JSON.stringify(data));
});
