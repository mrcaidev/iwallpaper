/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const model = new Supabase.ai.Session("gte-small");

type WebhookPayload = {
  record: {
    id: string;
    tags: string[];
  };
};

Deno.serve(async (request) => {
  const payload: WebhookPayload = await request.json();
  const { id, tags } = payload.record;

  const embedding = await model.run(tags.join(" "), {
    mean_pool: true,
    normalize: true,
  });

  const { error } = await supabase
    .from("wallpapers")
    .update({ embedding })
    .eq("id", id);

  if (error) {
    return new Response(error.message);
  }

  return new Response("ok");
});
