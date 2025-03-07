"use client";

import { useParams } from "next/navigation";
import JobEditForm from "@/components/jobs/forms/job-edit-form";

export default function EditJobPage() {
  const params = useParams();
  const jobId = params.id as string;

  return <JobEditForm jobId={jobId} />;
}