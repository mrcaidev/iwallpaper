import { embed } from "api/utils/embed";
import { generateErrorResponse } from "api/utils/error-handling";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "supabase/server";
import type { Database } from "supabase/types";
import z from "zod";
import { scrapeUnsplash } from "./unsplash";

const bodySchema = z.object({
  quantity: z.coerce
    .number({ invalid_type_error: "quantity 必须为整数" })
    .int("quantity 必须为整数")
    .min(10, "quantity 最少为 10")
    .max(5000, "quantity 最多为 5000")
    .default(30),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quantity } = await bodySchema.parseAsync(body);

    const wallpapers = await scrapeUnsplash(quantity);
    console.log(`Scraped ${wallpapers.length} wallpapers`);

    const sentences = wallpapers.map((wallpaper) => wallpaper.tags.join(" "));
    const embeddings = await embed(sentences);
    console.log(`Created ${embeddings.length} embeddings`);

    const embeddedWallpapers = wallpapers.map((wallpaper, index) => ({
      ...wallpaper,
      embedding: embeddings[index]!,
    }));

    const count = await upsert(embeddedWallpapers);
    console.log(`Upserted ${count} wallpapers`);

    return NextResponse.json({ count }, { status: 201 });
  } catch (error) {
    return generateErrorResponse(error);
  }
}

async function upsert(
  wallpapers: Database["public"]["Tables"]["wallpapers"]["Insert"][],
) {
  const { count, error } = await supabaseServer
    .from("wallpapers")
    .upsert(wallpapers, {
      onConflict: "slug",
      ignoreDuplicates: true,
      count: "exact",
    });

  if (error) {
    const message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }

  return count;
}
