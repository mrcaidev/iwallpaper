import { generateErrorResponse } from "api/utils";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { createEmbeddings } from "./embedding";
import { upsert } from "./persistence";
import { scrape } from "./unsplash";

const bodySchema = z.object({
  limit: z.number().int().min(10).max(500).default(10),
  offset: z.number().int().min(0).max(100000).default(0),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { limit, offset } = await bodySchema.parseAsync(body);

    const unembeddedwallpapers = await scrape(limit, offset);
    console.log(`Scraped ${unembeddedwallpapers.length} wallpapers`);

    const embeddings = await createEmbeddings(unembeddedwallpapers);
    console.log(`Created ${embeddings.length} embeddings`);

    const wallpapers = unembeddedwallpapers.map((wallpaper, index) => ({
      ...wallpaper,
      embedding: embeddings[index]!,
    }));

    const count = await upsert(wallpapers);
    console.log(`Upserted ${count} wallpapers`);

    return NextResponse.json({ count }, { status: 201 });
  } catch (error) {
    return generateErrorResponse(error);
  }
}
