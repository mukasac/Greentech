import { db } from "@/lib/db";
import { regions } from "@/lib/data/regions";

/**
 * This script initializes the region data from the seed data if the database is empty
 */
async function initRegionData() {
  console.log("Checking if region data needs initialization...");

  // Check if any regions exist in the database
  const regionCount = await db.region.count();
  
  if (regionCount > 0) {
    console.log("Region data already exists in the database. Skipping initialization.");
    return;
  }

  console.log("No region data found. Initializing from seed data...");

  // Seed regions with related data
  for (const region of regions) {
    console.log(`Creating region: ${region.name}`);

    // Create the region
    const dbRegion = await db.region.create({
      data: {
        id: region.id,
        slug: region.slug,
        name: region.name,
        description: region.description,
        coverImage: region.coverImage,
      },
    });

    // Create the region stats
    await db.regionStats.create({
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
      await db.regionInitiative.createMany({
        data: region.initiatives.map((initiative) => ({
          title: initiative.title,
          description: initiative.description,
          regionId: dbRegion.id,
        })),
      });
    }

    // Create the ecosystem partners
    if (region.ecosystemPartners && region.ecosystemPartners.length > 0) {
      await db.ecosystemPartner.createMany({
        data: region.ecosystemPartners.map((partner) => ({
          name: partner.name,
          logo: partner.logo,
          type: partner.type,
          regionId: dbRegion.id,
        })),
      });
    }
  }

  console.log("Region data initialization completed successfully");
}

// Function to update existing startup countries to match region slugs
async function updateStartupRegions() {
  console.log("Updating startup region relationships...");
  
  const startups = await db.startup.findMany();
  let updatedCount = 0;
  
  for (const startup of startups) {
    // Convert country to lowercase and normalize
    const normalizedCountry = startup.country.toLowerCase();
    
    // Find region with matching slug
    const region = await db.region.findFirst({
      where: { slug: normalizedCountry }
    });
    
    if (region) {
      // Update startup with regionId
      await db.startup.update({
        where: { id: startup.id },
        data: { regionId: region.id }
      });
      updatedCount++;
    }
  }
  
  console.log(`Updated ${updatedCount} startups with region relationships`);
}

// Function to update news and events with region relationships
async function updateContentRegions() {
  console.log("Updating news and events with region relationships...");
  
  // Update news
  const news = await db.news.findMany();
  let updatedNewsCount = 0;
  
  for (const item of news) {
    const normalizedRegion = item.region.toLowerCase();
    
    const region = await db.region.findFirst({
      where: { slug: normalizedRegion }
    });
    
    if (region) {
      await db.news.update({
        where: { id: item.id },
        data: { regionId: region.id }
      });
      updatedNewsCount++;
    }
  }
  
  // Update events
  const events = await db.event.findMany();
  let updatedEventsCount = 0;
  
  for (const event of events) {
    const normalizedRegion = event.region.toLowerCase();
    
    const region = await db.region.findFirst({
      where: { slug: normalizedRegion }
    });
    
    if (region) {
      await db.event.update({
        where: { id: event.id },
        data: { regionId: region.id }
      });
      updatedEventsCount++;
    }
  }
  
  console.log(`Updated ${updatedNewsCount} news items and ${updatedEventsCount} events with region relationships`);
}

// Run all functions in sequence
async function main() {
  try {
    await initRegionData();
    await updateStartupRegions();
    await updateContentRegions();
    console.log("All region data initialization tasks completed successfully!");
  } catch (error) {
    console.error("Error during region data initialization:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

// Execute the script
main();