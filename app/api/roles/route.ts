import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// export async function GET() {
//   try {
//     const roles = await db.role.findMany({
//       include: {
//         permissions: {
//           include: {
//             permission: true
//           }
//         }
//       }
//     });

//     // Transform the data structure
//     const transformedRoles = roles.map(role => ({
//       id: role.id,
//       name: role.name,
//       permissions: role.permissions.map(rp => ({
//         id: rp.permission.id,
//         name: rp.permission.name
//       }))
//     }));

//     return NextResponse.json(transformedRoles);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch roles" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
    try {
      const roles = await db.role.findMany({
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      });
  
      // Transform the data to match the expected interface
      const formattedRoles = roles.map(role => ({
        id: role.id,
        name: role.name,
        permissions: role.permissions.map(rp => ({
          id: rp.permission.id,
          name: rp.permission.name
        }))
      }));
  
      return NextResponse.json(formattedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      return NextResponse.json(
        { error: "Failed to fetch roles" },
        { status: 500 }
      );
    }
  }

export async function POST(req: Request) {
  try {
    const { name, permissions } = await req.json();

    const role = await db.$transaction(async (prisma) => {
      // Create the role
      const newRole = await prisma.role.create({
        data: { name }
      });

      // Assign permissions
      await Promise.all(
        permissions.map((permissionId: number) =>
          prisma.rolePermission.create({
            data: {
              roleId: newRole.id,
              permissionId
            }
          })
        )
      );

      return newRole;
    });

    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  }
}