import { db } from "@/lib/db";
import { JobCreateInput } from "@/lib/types/api";

export async function getJobs({ startupId, region, type }: {
  startupId?: string;
  region?: string;
  type?: string;
}) {
  const where = {
    ...(startupId && { startupId }),
    ...(region && { "startup.country": region }),
    ...(type && { type }),
  };

  return db.job.findMany({
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
}

export async function createJob(data: JobCreateInput) {
  return db.job.create({
    data,
  });
}