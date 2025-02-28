import { PrismaClient } from "@prisma/client";
import { regions } from '../lib/data/regions'; // Import mock data

const prisma = new PrismaClient();

/**
 * Seed the region data from the mock data
 */
async function seedRegions() {
  console.log("Starting region seed...");

  // Clear existing data
  await prisma.$transaction([
    prisma.ecosystemPartner.deleteMany(),
    prisma.regionInitiative.deleteMany(),
    prisma.regionStats.deleteMany(),
    prisma.region.deleteMany(),
  ]);

  console.log("Cleared existing region data");

  // Seed regions with related data
  for (const region of regions) {
    console.log(`Seeding region: ${region.name}`);

    // Create the region
    const dbRegion = await prisma.region.create({
      data: {
        id: region.id,
        slug: region.slug,
        name: region.name,
        description: region.description,
        coverImage: region.coverImage,
      },
    });

    // Create the region stats
    await prisma.regionStats.create({
      data: {
        regionId: dbRegion.id,
        startups: region.stats.startups,
        employees: region.stats.employees,
        openJobs: region.stats.openJobs,
        upcomingEvents: region.stats.upcomingEvents,
        totalInvestment: region.stats.totalInvestment,
      },
    });

    // Create the initiatives
    if (region.initiatives && region.initiatives.length > 0) {
      await prisma.regionInitiative.createMany({
        data: region.initiatives.map((initiative) => ({
          title: initiative.title,
          description: initiative.description,
          regionId: dbRegion.id,
        })),
      });
    }

    // Create the ecosystem partners
    if (region.ecosystemPartners && region.ecosystemPartners.length > 0) {
      await prisma.ecosystemPartner.createMany({
        data: region.ecosystemPartners.map((partner) => ({
          name: partner.name,
          logo: partner.logo,
          type: partner.type,
          regionId: dbRegion.id,
        })),
      });
    }
  }

  console.log("Region seed completed successfully");
}

// Run the seed
seedRegions()
  .catch((e) => {
    console.error("Error during region seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });