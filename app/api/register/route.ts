import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // const DEFAULT_ROLE_ID = 6; 
    const DEFAULT_ROLE_NAME = 'ADMIN';
    const { name, email, password, roleId } = await req.json();
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const defaultRole = await db.role.findUnique({
      where: { name: DEFAULT_ROLE_NAME },
    });
    if (!defaultRole) {
      return NextResponse.json(
        { error: `Default role '${DEFAULT_ROLE_NAME}' does not exist` },
        { status: 500 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);
  
    // Create new user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        id: crypto.randomUUID(), // Generate a unique ID
        roleId: roleId || defaultRole.id,
      },
    });

    return NextResponse.json(
      { 
        user: {
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
}