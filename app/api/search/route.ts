import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "utils/supabase/server";
import { z } from "zod";
import { embed } from "../utils/embed";
import { generateErrorResponse } from "../utils/error-handling";

const searchParamsSchema = z.object({
  query: z
    .string({
      required_error: "Missing search params `query`",
      invalid_type_error: "`query` must be a string",
    })
    .min(1, "`query` must be at least 1 character long")
    .max(50, "`query` must be at most 50 characters long"),
  take: z.coerce
    .number({ invalid_type_error: "`take` must be a number" })
    .int("`take` must be an integer")
    .min(1, "`take` must be at least 1")
    .max(30, "`take` must be at most 30")
    .default(30),
  skip: z.coerce
    .number({ invalid_type_error: "`skip` must be a number" })
    .int("`skip` must be an integer")
    .min(0, "`skip` must be at least 1")
    .default(0),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { query, take, skip } =
      await searchParamsSchema.parseAsync(searchParams);

    const embedding = await embed(query);

    const { data, error } = await supabase.rpc("search_wallpapers", {
      query,
      query_embedding: embedding,
      take,
      skip,
    });

    if (error) {
      const message = error.message;
      return NextResponse.json({ message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return generateErrorResponse(error);
  }
}
