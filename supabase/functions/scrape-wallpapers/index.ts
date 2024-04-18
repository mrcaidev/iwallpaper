/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { scrapeUnsplash } from "./unsplash.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const bodySchema = z.object({
  quantity: z.coerce.number().int().min(5).max(5000),
});

Deno.serve(async (request) => {
  const body = await request.json();
  const parseResult = await bodySchema.safeParseAsync(body);

  if (!parseResult.success) {
    return new Response(parseResult.error.issues[0].message, { status: 400 });
  }

  const { quantity } = parseResult.data;

  const wallpapers = await scrapeUnsplash(quantity);

  const { count, error } = await supabase
    .from("wallpapers")
    .upsert(wallpapers, {
      count: "exact",
      onConflict: "slug",
      ignoreDuplicates: true,
    });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(count?.toString());
});
