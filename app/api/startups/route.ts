import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { startupSchema } from "@/lib/validations/startup";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Define types for team members and gallery images
interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  [key: string]: any; // For any additional properties
}

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
  [key: string]: any; // For any additional properties
}

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const category = searchParams.get("category");
//     const region = searchParams.get("region");

//     const where = {
//       ...(category && { mainCategory: category }),
//       ...(region && { country: region }),
//     };

//     const startups = await db.startup.findMany({
//       where,
//       include: {
//         team: true,
//         gallery: true,
//       },
//     });

//     return NextResponse.json(startups);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch startups" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const category = searchParams.get("category");
    const region = searchParams.get("region");

    const where = {
      ...(category && { mainCategory: category }),
      ...(region && { country: region }),
    };

    const totalCount = await db.startup.count({ where });

    const startups = await db.startup.findMany({
      where,
      include: {
        team: true,
        gallery: true,
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      startups,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        current: page,
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch startups" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      website,
      founded,
      employees,
      funding,
      teamMembers,
      galleryImages,
      // mainCategory = "renewable-energy",
      // subcategories = [],
      country = "norway", // Default to Norway if not provided
      tags = [],
    } = body;

    // Default logo and profile image if not provided
    const defaultLogo = "/placeholder-logo.png";
    const defaultProfileImage = "/placeholder-profile.jpg";

    // Create startup with team members and gallery in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create the startup
      const startup = await tx.startup.create({
        data: {
          name,
          description,
          website,
          founded: parseInt(founded),
          employees,
          funding,
          logo: body.logo || defaultLogo,
          profileImage: body.profileImage || defaultProfileImage,
          // mainCategory,
          // subcategories,
          country,
          tags,
          userId: session.user.id,
        },
      });

      // Create team members if they exist
      if (teamMembers?.length > 0) {
        await tx.team.createMany({
          data: teamMembers.map((member: TeamMember) => ({
            ...member,
            startupId: startup.id,
          })),
        });
      }

      // Create gallery images if they exist
      if (galleryImages?.length > 0) {
        await tx.gallery.createMany({
          data: galleryImages.map((image: GalleryImage) => ({
            ...image,
            startupId: startup.id,
          })),
        });
      }

      // Fetch the complete startup with related data
      const completeStartup = await tx.startup.findUnique({
        where: { id: startup.id },
        include: {
          team: true,
          gallery: true,
        },
      });

      return completeStartup;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error("Startup creation error:", error);
    return NextResponse.json(
      {
        error: "Error creating startup",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
