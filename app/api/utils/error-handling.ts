import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function generateErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "数据格式错误";
    return NextResponse.json({ message }, { status: 400 });
  }

  console.error(error);

  if (error instanceof Error) {
    const message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }

  return NextResponse.json({ message: "服务端未知错误" }, { status: 500 });
}
