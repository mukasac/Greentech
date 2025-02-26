import { PrismaClient } from "@prisma/client";
import seedCategoriesAndStartups from "./seedCategoriesAndStartups";

const prisma = new PrismaClient();

async function clearDatabase() {
  // Delete records in the correct order to respect foreign key constraints
  await prisma.$transaction([
    // First, delete records from junction/child tables
    prisma.rolePermission.deleteMany(),
    prisma.team.deleteMany(),
    prisma.gallery.deleteMany(),

    prisma.startup.deleteMany(),
    prisma.user.deleteMany(),
    prisma.permission.deleteMany(),
    prisma.role.deleteMany(),
  ]);

  console.log("Database cleared successfully");
}

async function main() {
  console.log("Starting database seed...");

  // Clear existing data
  await clearDatabase();

  // Create the permissions - removed duplicates
  const permissionNames = [
    "STARTUP_CREATE",
    "STARTUP_EDIT",
    "STARTUP_DELETE",
    "STARTUP_VIEW",
    "ADMIN_ACCESS",
    "DASHBOARD_ACCESS",
    "VIEW_REGIONS",
    "CREATE_REGIONS",
    "UPDATE_REGIONS",
    "DELETE_REGIONS",
    "UPDATE_JOBS",
    "VIEW_JOBS",
    "DELETE_JOBS",
    "CREATE_JOBS",
    "CREATE_EVENTS",
    "VIEW_EVENTS",
    "UPDATE_EVENTS",
    "DELETE_EVENTS",
    "REGISTER_FOR_EVENT",
    "VIEW_LATEST_NEWS",
    "CREATE_LATEST_NEWS",
    "UPDATE_LATEST_NEWS",
    "DELETE_LATEST_NEWS",
    "APPLY_FOR_JOBS",
    "VIEW_STARTUP_PROFILE",
    "CLAIM_STARTUP",
    "VIEW_TEAM_MEMBERS",
    "CREATE_TEAM_MEMBERS",
    "DELETE_TEAM_MEMBERS",
    "UPDATE_TEAM_MEMBERS",
    "VIEW_GALLERY",
    "CREATE_GALLERY",
    "DELETE_GALLERY",
    "UPDATE_GALLERY",
    "CREATE_BLOG",
    "VIEW_BLOG",
    "DELETE_BLOG",
    "UPDATE_BLOG",
    "VIEW_DEPARTMENTS",
    "CREATE_DEPARTMENTS",
    "UPDATE_DEPARTMENTS",
    "DELETE_DEPARTMENTS",
    "CREATE_STARTUP_CATEGORY",
    "VIEW_STARTUP_CATEGORY",
    "UPDATE_STARTUP_CATEGORY",
    "DELETE_STARTUP_CATEGORY",
    "VIEW_STARTUP_DASHBOARD",
    "VIEW_ROLES_AND_PERMISIONS",
    "VIEW_USERS",
    "ADD_ROLES",
    "ASSIGN_ROLES",
    "MANAGE_CLIMATE_IMPACT",
    "VIEW_CLIMATE_IMPACT",
  ];

  // Create permissions using the unique names
  const permissions = await Promise.all(
    permissionNames.map((name) =>
      prisma.permission.create({
        data: { name },
      })
    )
  );

  // Create roles
  const adminRole = await prisma.role.create({
    data: { name: "ADMIN" },
  });

  const managerRole = await prisma.role.create({
    data: { name: "MANAGER" },
  });

  const userRole = await prisma.role.create({
    data: { name: "USER" },
  });

  // Assign permissions to roles
  await Promise.all([
    // Admin permissions - gets all permissions
    ...permissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      })
    ),

    // Manager permissions
    ...[
      "STARTUP_CREATE",
      "STARTUP_EDIT",
      "STARTUP_VIEW",
      "DASHBOARD_ACCESS",
    ].map(async (permName) => {
      const permission = permissions.find((p) => p.name === permName);
      if (permission) {
        return prisma.rolePermission.create({
          data: {
            roleId: managerRole.id,
            permissionId: permission.id,
          },
        });
      }
    }),

    // User permissions
    ...["STARTUP_VIEW", "DASHBOARD_ACCESS"].map(async (permName) => {
      const permission = permissions.find((p) => p.name === permName);
      if (permission) {
        return prisma.rolePermission.create({
          data: {
            roleId: userRole.id,
            permissionId: permission.id,
          },
        });
      }
    }),
  ]);

    //seed categories and start ups
    seedCategoriesAndStartups();
  // Log completion
  console.log("Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
