/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const model = new Supabase.ai.Session("gte-small");

const searchParamsSchema = z.object({
  query: z.string().min(1).max(50),
  take: z.coerce.number().int().min(1).max(30).default(30),
  skip: z.coerce.number().int().min(0).default(0),
});

Deno.serve(async (request) => {
  const searchParams = Object.fromEntries(new URL(request.url).searchParams);
  const parseResult = await searchParamsSchema.safeParseAsync(searchParams);

  if (!parseResult.success) {
    return Response.json(
      { message: parseResult.error.issues[0].message },
      { status: 400 },
    );
  }

  const { query, take, skip } = parseResult.data;

  const query_embedding = await model.run(query, {
    mean_pool: true,
    normalize: true,
  });

  const { data, error } = await supabase.rpc("search_wallpapers", {
    query,
    query_embedding,
    take,
    skip,
  });

  if (error) {
    return Response.json({ message: error }, { status: 500 });
  }

  return Response.json(data);
});
