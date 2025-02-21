import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.errors },
      { status: 400 }
    );
  }

  console.error(error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}

export function successResponse(data: any) {
  return NextResponse.json(data);
}