// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import seedCategoriesAndStartups from "./seedCategoriesAndStartups";

const prisma = new PrismaClient();

async function clearDatabase() {
  // Delete records in the correct order to respect foreign key constraints
  await prisma.$transaction([
    // First, delete records from junction/child tables
    prisma.rolePermission.deleteMany(),
    prisma.team.deleteMany(),
    prisma.gallery.deleteMany(),
    prisma.document.deleteMany(),
    prisma.jobApplication.deleteMany(),
    prisma.job.deleteMany(),
    prisma.blogComment.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.eventRegistration.deleteMany(),
    prisma.event.deleteMany(),
    prisma.news.deleteMany(),
    prisma.analyticsEvent.deleteMany(),
    prisma.climateImpact.deleteMany(),
    prisma.startupCategory.deleteMany(),
    
    // Then delete parent tables
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

  // Create the permissions - comprehensive list including all permissions used in the app
  const permissionNames = [
    "STARTUP_CREATE",
    "STARTUP_EDIT",
    "STARTUP_DELETE",
    "STARTUP_VIEW",
    "ADMIN_ACCESS",  // General admin access for startup admins
    "SITE_ADMIN",    // Special permission only for site administrators
    "DASHBOARD_ACCESS",
    "VIEW_REGIONS",
    "CREATE_REGIONS",
    "UPDATE_REGIONS",
    "DELETE_REGIONS",
    "CREATE_JOBS",
    "UPDATE_JOBS",
    "VIEW_JOBS",
    "DELETE_JOBS",
    "APPLY_JOBS",
    "CREATE_EVENTS",
    "VIEW_EVENTS",
    "UPDATE_EVENTS",
    "DELETE_EVENTS",
    "REGISTER_FOR_EVENT",
    "VIEW_LATEST_NEWS",
    "CREATE_LATEST_NEWS",
    "UPDATE_LATEST_NEWS",
    "DELETE_LATEST_NEWS",
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
    "VIEW_ROLES_AND_PERMISSIONS",
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
  const siteAdminRole = await prisma.role.create({
    data: { name: "SITE_ADMIN" },
  });
  
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
    // Site Admin permissions - gets all permissions including SITE_ADMIN
    ...permissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: siteAdminRole.id,
          permissionId: permission.id,
        },
      })
    ),
    
    // Admin permissions - gets all permissions except SITE_ADMIN
    ...permissions
      .filter(permission => permission.name !== "SITE_ADMIN")
      .map((permission) =>
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
      "VIEW_JOBS",
      "CREATE_JOBS",
      "VIEW_EVENTS",
      "VIEW_LATEST_NEWS",
      "VIEW_TEAM_MEMBERS",
      "VIEW_GALLERY",
      "VIEW_BLOG",
      "VIEW_STARTUP_DASHBOARD",
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
    ...[
      "STARTUP_VIEW", 
      "DASHBOARD_ACCESS",
      "VIEW_JOBS",
      "VIEW_EVENTS",
      "VIEW_LATEST_NEWS",
      "VIEW_TEAM_MEMBERS",
      "VIEW_GALLERY",
      "VIEW_BLOG"
    ].map(async (permName) => {
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
  // Create a site admin user (platform owner)
  const siteAdminPassword = await hash("siteadmin123", 10);
  const siteAdminUser = await prisma.user.create({
    data: {
      name: "Site Administrator",
      email: "siteadmin@example.com",
      password: siteAdminPassword,
      roleId: siteAdminRole.id,
    },
  });
  
  // Create a startup admin user
  const adminPassword = await hash("admin123", 10);
  const adminUser = await prisma.user.create({
    data: {
      name: "Startup Admin",
      email: "admin@example.com",
      password: adminPassword,
      roleId: adminRole.id,
    },
  });

  // Create a regular user
  const userPassword = await hash("user123", 10);
  const regularUser = await prisma.user.create({
    data: {
      name: "Regular User",
      email: "user@example.com",
      password: userPassword,
      roleId: userRole.id,
    },
  });

  // Create sample news articles
  const news = [
    {
      title: "Norway Launches $100M Green Tech Fund",
      slug: "norway-launches-green-tech-fund",
      excerpt: "New government initiative to boost sustainable technology innovation across the country.",
      content: "The Norwegian government has announced a new $100 million fund dedicated to green technology innovation. The fund will focus on supporting startups and research institutions working on sustainable solutions in energy, transportation, and waste management.\n\nThis initiative is part of Norway's broader strategy to reduce carbon emissions by 55% by 2030 and achieve carbon neutrality by 2050. The fund will provide grants ranging from $50,000 to $2 million for early-stage companies with promising green technologies.\n\n\"Innovation is key to addressing climate change,\" said Norway's Minister of Climate and Environment. \"This fund will help accelerate the development and deployment of technologies that can reduce our environmental footprint while creating jobs and economic growth.\"",
      image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51",
      tags: ["Investment", "Government", "Green Tech"],
      region: "norway",
      source: "Ministry of Climate and Environment",
    },
    {
      title: "Swedish Startup Revolutionizes Battery Recycling",
      slug: "swedish-startup-revolutionizes-battery-recycling",
      excerpt: "Innovative technology reclaims 95% of materials from used lithium-ion batteries, addressing a critical environmental challenge.",
      content: "A Stockholm-based startup has developed a groundbreaking process that can reclaim up to 95% of materials from used lithium-ion batteries, potentially solving one of the biggest challenges in the transition to electric vehicles and renewable energy storage.\n\nThe technology uses a combination of mechanical and hydrometallurgical processes to extract valuable metals like lithium, cobalt, nickel, and manganese from spent batteries. These materials can then be returned to the battery supply chain, reducing the need for new mining operations.\n\n\"Battery waste is going to be one of the biggest environmental challenges in the coming decades,\" said the company's CEO. \"Our solution not only addresses this problem but also creates a circular economy for battery materials.\"\n\nThe company has already secured partnerships with several major automotive manufacturers and plans to open its first full-scale recycling plant next year.",
      image: "https://images.unsplash.com/photo-1611122281384-b1dbd38ed6eb",
      tags: ["Innovation", "Circular Economy", "Energy Storage"],
      region: "sweden",
      source: "GreenTech Sweden",
    },
    {
      title: "Denmark Sets New Record for Wind Energy Production",
      slug: "denmark-sets-new-record-wind-energy",
      excerpt: "Wind turbines generated enough electricity to power the entire country for 48 consecutive hours, demonstrating the potential of renewable energy.",
      content: "Denmark has set a new record for wind energy production, with its turbines generating enough electricity to power the entire country for 48 consecutive hours. During this period, wind energy production exceeded the nation's total electricity consumption, allowing Denmark to export surplus power to neighboring countries.\n\nThis achievement highlights Denmark's leadership in wind energy technology and infrastructure. The country currently has over 6,000 wind turbines, both onshore and offshore, with a combined capacity of more than 6 gigawatts.\n\n\"This is a significant milestone in our transition to renewable energy,\" said Denmark's Minister of Energy. \"It proves that a fossil-free energy system is not just a dream but an achievable reality.\"\n\nDenmark aims to generate 100% of its electricity from renewable sources by 2030 and to be completely independent of fossil fuels by 2050.",
      image: "https://images.unsplash.com/photo-1548337138-e87d889cc369",
      tags: ["Renewable Energy", "Wind Power", "Energy Transition"],
      region: "denmark",
      source: "Danish Energy Agency",
    },
  ];

  for (const article of news) {
    await prisma.news.create({
      data: {
        ...article,
        publishedAt: new Date(),
        updatedAt: new Date(),
       
      },
    });
  }

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