import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function generateErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: error.issues[0]?.message ?? "Malformed data format." },
      { status: 400 },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  console.error(error);

  return NextResponse.json(
    { message: "Server-side unknown error." },
    { status: 500 },
  );
}
