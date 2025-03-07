// File: app/api/jobs/[id]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";
import { JobType, ExperienceLevel, WorkLocation, Currency } from "@/lib/types/job";

// Define validation schema using Zod
const updateJobSchema = z.object({
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
  }).refine(data => data.max >= data.min, {
    message: "Maximum salary must be greater than or equal to minimum salary",
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
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    
    // Check if we're dealing with a mock ID for development
    if (jobId.startsWith("mock-") && process.env.NODE_ENV !== 'production') {
      // This is a mock job ID, return mock data
      if (jobId === "mock-1") {
        return NextResponse.json({
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
          description: "We are looking for a Senior Renewable Energy Engineer to join our growing team. You will be responsible for designing and developing renewable energy solutions for our clients across the Nordic region. This is an exciting opportunity to work on cutting-edge projects that make a real impact on reducing carbon emissions.\n\nThe ideal candidate will have extensive experience in the renewable energy sector, with a focus on solar, wind, or other clean energy technologies. You should be comfortable leading technical teams and collaborating with stakeholders at all levels.",
          requirements: [
            "Bachelor's or Master's degree in Electrical, Mechanical, or Environmental Engineering",
            "5+ years of experience in renewable energy projects",
            "Strong technical knowledge of solar PV, wind, or other renewable energy technologies",
            "Experience with energy storage systems and grid integration",
            "Project management experience and skills",
            "Excellent communication and collaboration abilities",
            "Commitment to sustainability and clean energy transition"
          ],
          responsibilities: [
            "Lead the technical design and development of renewable energy systems",
            "Perform energy yield assessments and feasibility studies",
            "Collaborate with cross-functional teams including sales, operations, and client stakeholders",
            "Ensure projects meet quality standards, timelines, and budget constraints",
            "Stay current with industry trends and emerging technologies",
            "Mentor junior engineers and contribute to knowledge sharing",
            "Represent the company at industry events and client meetings"
          ],
          skills: ["Solar PV", "Wind Energy", "Energy Storage", "Project Management", "Technical Design", "Feasibility Studies", "Grid Integration"],
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
        });
      } else if (jobId === "mock-2") {
        return NextResponse.json({
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
          description: "EcoStrategy Partners is seeking a dedicated Sustainability Consultant to help our clients develop and implement effective sustainability strategies. As a consultant, you will work with a diverse range of organizations to assess their environmental impact, create actionable plans, and drive meaningful change.\n\nYour expertise will be crucial in guiding businesses toward more sustainable practices while also supporting their strategic goals. This role offers the opportunity to make a significant positive impact across multiple industries in the Nordic region and beyond.",
          requirements: [
            "Bachelor's degree in Environmental Science, Sustainability, Business, or related field",
            "3+ years of experience in sustainability consulting or related roles",
            "Strong knowledge of ESG frameworks, reporting standards, and certification systems",
            "Experience with carbon accounting and lifecycle assessment methodologies",
            "Excellent analytical and problem-solving skills",
            "Outstanding communication and presentation abilities",
            "Ability to work independently and as part of a team"
          ],
          responsibilities: [
            "Conduct sustainability assessments and audits for clients",
            "Develop comprehensive sustainability strategies and implementation roadmaps",
            "Guide clients through ESG reporting processes and frameworks",
            "Perform carbon footprint analyses and recommend reduction strategies",
            "Create engaging sustainability communications for various stakeholders",
            "Stay current with regulations, standards, and best practices in sustainability",
            "Build and maintain strong client relationships"
          ],
          skills: ["ESG", "Carbon Accounting", "Sustainability Reporting", "Stakeholder Engagement", "Climate Risk Assessment", "Green Certification", "Strategic Planning"],
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
        });
      }
    }
    
    // Fetch job with related data from the database
    const job = await db.job.findUnique({
      where: { id: jobId },
      include: {
        startup: {
          select: {
            name: true,
            logo: true,
            country: true,
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await db.job.update({
      where: { id: jobId },
      data: {
        viewCount: { increment: 1 }
      }
    });

    // Track analytics event
    await db.analyticsEvent.create({
      data: {
        type: "view",
        startupId: job.startupId,
        metadata: {
          jobId: job.id,
          timestamp: new Date(),
        }
      }
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permissions - FIXED: Changed EDIT_JOBS to UPDATE_JOBS
    if (!session.user.permissions?.includes("UPDATE_JOBS")) {
      return NextResponse.json(
        { error: "You don't have permission to edit jobs" },
        { status: 403 }
      );
    }

    const jobId = params.id;
    
    // Check if job exists
    const existingJob = await db.job.findUnique({
      where: { id: jobId },
      select: { 
        id: true,
        startupId: true
      }
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Get the user's startups to check ownership
    const userStartups = await db.startup.findMany({
      where: { userId: session.user.id },
      select: { id: true }
    });

    const userStartupIds = userStartups.map(startup => startup.id);
    const hasAdminAccess = session.user.permissions?.includes("ADMIN_ACCESS");
    
    // Check if user owns this startup or has admin access
    if (!hasAdminAccess && !userStartupIds.includes(existingJob.startupId)) {
      return NextResponse.json(
        { error: "You don't have permission to edit this job" },
        { status: 403 }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const validationResult = updateJobSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Update the job
    const updatedJob = await db.job.update({
      where: { id: jobId },
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
        status: "active", // You might want to make this configurable
        updatedAt: new Date(),
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

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if this is a mock ID in dev mode
    if (params.id.startsWith("mock-") && process.env.NODE_ENV !== 'production') {
      // Just pretend to delete it in development
      return NextResponse.json(
        { message: "Mock job deleted successfully" },
        { status: 200 }
      );
    }
    
    const jobId = params.id;

    // Delete the job from the database
    await db.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}