// app/api/startups/[id]/claim/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const startupId = params.id;
    const userId = session.user.id;
    
    // Find the startup
    const startup = await db.startup.findUnique({
      where: { id: startupId },
    });
    
    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      );
    }
    
    // Check if startup is already claimed
    if (startup.userId) {
      return NextResponse.json(
        { error: "This startup has already been claimed" },
        { status: 403 }
      );
    }
    
    // Find the ADMIN role to upgrade the user
    const adminRole = await db.role.findFirst({
      where: { name: "ADMIN" },
    });
    
    if (!adminRole) {
      return NextResponse.json(
        { error: "Admin role not found" },
        { status: 500 }
      );
    }
    
    // Perform all updates in a transaction
    await db.$transaction([
      // Update the startup with the user's ID
      db.startup.update({
        where: { id: startupId },
        data: { userId: userId },
      }),
      
      // Upgrade user role to ADMIN for full permissions
      db.user.update({
        where: { id: userId },
        data: { roleId: adminRole.id },
      }),
    ]);
    
    return NextResponse.json(
      { 
        message: "Startup claimed successfully",
        startupId: startupId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Claim startup error:", error);
    return NextResponse.json(
      { error: "Failed to claim startup" },
      { status: 500 }
    );
  }
}