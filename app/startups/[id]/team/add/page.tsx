"use client";

import { useParams } from "next/navigation";
import { AddTeamMemberForm } from "@/components/startups/team/add-team-member-form";

export default function AddTeamMemberPage() {
  const params = useParams();
  const startupId = params.id as string;

  return <AddTeamMemberForm startupId={startupId} />;
}