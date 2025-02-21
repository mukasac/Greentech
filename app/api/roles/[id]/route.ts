// src/app/api/roles/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = parseInt(params.id);

    await db.$transaction(async (prisma) => {
      // Delete all role permissions first
      await prisma.rolePermission.deleteMany({
        where: { roleId }
      });

      // Delete the role
      await prisma.role.delete({
        where: { id: roleId }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete role" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = parseInt(params.id);
    const { permissions } = await req.json();

    await db.$transaction(async (prisma) => {
      // Delete existing permissions
      await prisma.rolePermission.deleteMany({
        where: { roleId }
      });

      // Add new permissions
      await Promise.all(
        permissions.map((permissionId: number) =>
          prisma.rolePermission.create({
            data: {
              roleId,
              permissionId
            }
          })
        )
      );
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}