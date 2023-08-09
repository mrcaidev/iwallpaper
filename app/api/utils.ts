import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function generateErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Malformed data" }, { status: 400 });
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  console.error(error);

  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
}
