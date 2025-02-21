import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const permissions = await db.permission.findMany();
    
    return NextResponse.json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch permissions" },
      { status: 500 }
    );
  }
}