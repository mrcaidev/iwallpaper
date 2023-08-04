import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function generateErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ message: "Malformed data" }, { status: 400 });
  }

  console.error(error);

  if (error instanceof Error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Unknown error" }, { status: 500 });
}
