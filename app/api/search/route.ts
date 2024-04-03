import { embed } from "api/utils/embed";
import { generateErrorResponse } from "api/utils/error-handling";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "supabase/server";
import { z } from "zod";

const searchParamsSchema = z.object({
  query: z
    .string({
      required_error: "缺少必要参数 query",
      invalid_type_error: "query 必须为字符串",
    })
    .min(1, "query 最少为 1 个字符")
    .max(50, "query 最多为 50 个字符"),
  quantity: z.coerce
    .number({ invalid_type_error: "quantity 必须为整数" })
    .int("quantity 必须为整数")
    .min(1, "quantity 最少为 1")
    .max(100, "quantity 最多为 100")
    .default(30),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { query, quantity } =
      await searchParamsSchema.parseAsync(searchParams);

    const embedding = await embed(query);

    const { data, error } = await supabaseServer.rpc("search_wallpapers", {
      query,
      query_embedding: embedding,
      quantity,
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
