import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    // Find the USER role to assign to new users
    const userRole = await db.role.findFirst({
      where: { name: "USER" },
    });
    
    if (!userRole) {
      return NextResponse.json(
        { error: "User role not found" },
        { status: 500 }
      );
    }
    
    // Hash the password
    const hashedPassword = await hash(password, 10);
    
    // Create the user with the USER role
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: userRole.id,
      },
    });
    
    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}