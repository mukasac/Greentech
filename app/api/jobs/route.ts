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
    const startupId = searchParams.get("startupId");
    const type = searchParams.get("type");
    const experienceLevel = searchParams.get("experienceLevel");

    const where = {
      ...(startupId && { startupId }),
      ...(type && { type }),
      ...(experienceLevel && { experienceLevel }),
      status: "active", // Only return active jobs
    };

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

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}