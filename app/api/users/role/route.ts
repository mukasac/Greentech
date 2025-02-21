import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, roleId } = body;

    if (!userId || !roleId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        roleId: roleId,
      },
      include: {
        // role: true,
        role: {
          include: {
            permissions: {
              include: {
                permission: true, 
            },
            },
          },
        }
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}