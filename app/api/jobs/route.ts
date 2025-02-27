import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import { JobType, ExperienceLevel, WorkLocation, Currency } from "@/lib/types/job";

// Define validation schema using Zod
const createJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum([JobType.FULL_TIME, JobType.PART_TIME, JobType.CONTRACT, JobType.INTERNSHIP]),
  experienceLevel: z.enum([
    ExperienceLevel.ENTRY,
    ExperienceLevel.MID,
    ExperienceLevel.SENIOR,
    ExperienceLevel.LEAD,
    ExperienceLevel.EXECUTIVE,
  ]),
  location: z.object({
    type: z.enum([WorkLocation.REMOTE, WorkLocation.HYBRID, WorkLocation.ON_SITE]),
    city: z.string().nullable(),
    country: z.string().min(1, "Country is required"),
  }),
  salary: z.object({
    min: z.number().min(0, "Minimum salary must be positive"),
    max: z.number().min(0, "Maximum salary must be positive"),
    currency: z.enum([Currency.USD, Currency.EUR, Currency.GBP, Currency.NOK]),
  }).refine(data => data.max > data.min, {
    message: "Maximum salary must be greater than minimum salary",
    path: ["max"],
  }),
  description: z.string().min(1, "Description is required"),
  requirements: z.array(z.string()).min(1, "At least one requirement is required"),
  responsibilities: z.array(z.string()).min(1, "At least one responsibility is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  department: z.string().min(1, "Department is required"),
  startup: z.object({
    id: z.string().min(1, "Startup ID is required"),
  }),
  status: z.enum(["active", "filled", "expired"]).default("active"),
});

export async function POST(req: Request) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check permissions
    if (!session.user.permissions?.includes("CREATE_JOBS")) {
      return NextResponse.json(
        { error: "You don't have permission to create jobs" },
        { status: 403 }
      );
    }

    // 3. Parse and validate request body
    const body = await req.json();
    const validationResult = createJobSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 4. Check if user has access to the startup
    const startup = await db.startup.findUnique({
      where: { id: data.startup.id },
      select: { userId: true },
    });

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      );
    }

    if (startup.userId !== session.user.id && 
        !session.user.permissions?.includes("ADMIN_ACCESS")) {
      return NextResponse.json(
        { error: "You don't have permission to create jobs for this startup" },
        { status: 403 }
      );
    }

    // 5. Create the job
    const job = await db.job.create({
      data: {
        title: data.title,
        type: data.type,
        experienceLevel: data.experienceLevel,
        location: data.location,
        salary: data.salary,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        skills: data.skills,
        department: data.department,
        status: data.status,
        startupId: data.startup.id,
        applicationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/jobs/apply/${data.startup.id}`, // Generate application URL
        postedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        applicationCount: 0,
        viewCount: 0,
      },
      include: {
        startup: {
          select: {
            name: true,
            logo: true,
            country: true,
          },
        },
      },
    });

    return NextResponse.json(job, { status: 201 });

  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job posting" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract filter parameters
    const startupId = searchParams.get("startupId");
    const type = searchParams.get("type");
    const experienceLevel = searchParams.get("experienceLevel");
    const location = searchParams.get("location");
    const country = searchParams.get("country");
    
    // Build the where clause for the database query
    const where: any = {
      status: "active", // Only return active jobs
    };
    
    // Add filters if they exist
    if (startupId) {
      where.startupId = startupId;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }
    
    // Handle location and country filters
    // Create a complex query to handle both the location type and country
    if (location || country) {
      // We need to structure this differently based on if we have one or both filters
      if (location && country) {
        // When we have both filters, we need a more complex structure
        where.AND = [
          {
            location: {
              path: ['type'],
              equals: location
            }
          },
          {
            location: {
              path: ['country'],
              equals: country
            }
          }
        ];
      } else if (location) {
        // Just location type filter
        where.location = {
          path: ['type'],
          equals: location
        };
      } else if (country) {
        // Just country filter
        where.location = {
          path: ['country'],
          equals: country
        };
      }
    }

    // Query the database
    const jobs = await db.job.findMany({
      where,
      include: {
        startup: {
          select: {
            name: true,
            logo: true,
            country: true,
          },
        },
      },
      orderBy: { postedAt: "desc" },
    });

    // If there are no jobs found in the production environment, try to mock data
    if (jobs.length === 0 && process.env.NODE_ENV !== 'production') {
      console.log("No jobs found in database, returning mock data for development");
      
      // Return sample mock data for development
      return NextResponse.json([
        {
          id: "mock-1",
          title: "Senior Renewable Energy Engineer",
          type: "full-time",
          experienceLevel: "senior",
          location: {
            type: "hybrid",
            city: "Oslo",
            country: "Norway"
          },
          salary: {
            min: 90000,
            max: 120000,
            currency: "EUR"
          },
          description: "Design and develop renewable energy solutions...",
          requirements: ["5+ years experience in renewable energy", "Engineering degree", "Project management experience"],
          responsibilities: ["Lead technical design of renewable energy systems", "Collaborate with cross-functional teams"],
          skills: ["Solar PV", "Wind Energy", "Energy Storage", "Project Management"],
          department: "Engineering",
          applicationUrl: "https://example.com/apply",
          status: "active",
          applicationCount: 12,
          viewCount: 354,
          startupId: "mock-startup-1",
          startup: {
            name: "GreenPower Innovations",
            logo: "/placeholder-logo.png",
            country: "Norway"
          },
          postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        },
        {
          id: "mock-2",
          title: "Sustainability Consultant",
          type: "full-time",
          experienceLevel: "mid",
          location: {
            type: "remote",
            country: "Sweden"
          },
          salary: {
            min: 60000,
            max: 85000,
            currency: "EUR"
          },
          description: "Help our clients develop and implement sustainability strategies...",
          requirements: ["3+ years in sustainability consulting", "Bachelor's degree in related field"],
          responsibilities: ["Conduct sustainability assessments", "Develop action plans for clients"],
          skills: ["ESG", "Carbon Accounting", "Sustainability Reporting", "Stakeholder Engagement"],
          department: "Consulting",
          applicationUrl: "https://example.com/apply",
          status: "active",
          applicationCount: 8,
          viewCount: 245,
          startupId: "mock-startup-2",
          startup: {
            name: "EcoStrategy Partners",
            logo: "/placeholder-logo.png",
            country: "Sweden"
          },
          postedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        }
      ]);
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}