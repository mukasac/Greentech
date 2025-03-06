// app/api/user/delete/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { compare } from "bcrypt";

export async function DELETE(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password, confirmText } = await req.json();

    // Validate password and confirmation
    if (!password || confirmText !== "DELETE") {
      return NextResponse.json(
        { error: "Please enter your password and type DELETE to confirm" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { 
        password: true,
        startups: {
          select: { id: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify password
    const passwordValid = await compare(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Password is incorrect" },
        { status: 400 }
      );
    }

    // Delete the user's startups first
    for (const startup of user.startups) {
      await db.startup.delete({
        where: { id: startup.id }
      });
    }

    // Delete the user
    await db.user.delete({
      where: { id: session.user.id }
    });

    return NextResponse.json({ 
      success: true,
      message: "Account deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}