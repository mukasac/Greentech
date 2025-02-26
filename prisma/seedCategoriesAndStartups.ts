import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import categories from "./alt_industry_names.json";

const prisma = new PrismaClient();

async function main() {
  // Seed Categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: {
        name: category,
      },
    });
  }

  // Read filtered_data.json
  try {
    const filePath = path.join(process.cwd(), "prisma", "filtered_data.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const startups = JSON.parse(rawData);

    // Seed Startups and their Categories
    // let userId = ''
    // const existingUser = await prisma.user.findFirst()
    // if (existingUser) {
    //     userId = existingUser.id
    // } else {
    //     // Create a default user if none exists
    //     const defaultUser = await prisma.user.create({
    //         data: {
    //             email: 'default@example.com',
    //             password: 'temporaryPassword', // Replace with proper password handling
    //             name: 'Default User'
    //         }
    //     })
    //     userId = defaultUser.id
    // }
    for (const startup of startups) {
      // Ensure we have a user to link the startup to

      // Check if startup already exists
      const existingStartup = await prisma.startup.findFirst({
        where: { name: startup.name },
      });

      // Create startup only if it doesn't exist
      let createdStartup;
      if (!existingStartup) {
        createdStartup = await prisma.startup.create({
          data: {
            name: startup.name,
            description: startup.description,
            logo: startup.logo,
            profileImage: startup.logo,
            country: startup.country,
            founded: Number(startup.founded) || 2020,
            website: startup.website,
            funding: startup?.funding || "",
            employees: startup?.employees || "",
            tags: startup.tags || [],
            // userId: userId,
          },
        });
      } else {
        createdStartup = existingStartup;
      }

      // Handle Categories
      if (startup.industry && startup.industry.length > 0) {
        for (const industryName of startup.industry) {
          // Find or create the category
          const category = await prisma.category.upsert({
            where: { name: industryName },
            update: {},
            create: {
              name: industryName,
            },
          });

          // Check if StartupCategory relationship already exists
          const existingStartupCategory =
            await prisma.startupCategory.findUnique({
              where: {
                startupId_categoryId: {
                  startupId: createdStartup.id,
                  categoryId: category.id,
                },
              },
            });

          // Create StartupCategory relationship only if it doesn't exist
          if (!existingStartupCategory) {
            await prisma.startupCategory.create({
              data: {
                startupId: createdStartup.id,
                categoryId: category.id,
              },
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
}

// Only run the script if it's being run directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//     main()
//         .catch((e) => {
//             console.error(e)
//             process.exit(1)
//         })
//         .finally(async () => {
//             await prisma.$disconnect()
//         })
// }

export default main;
