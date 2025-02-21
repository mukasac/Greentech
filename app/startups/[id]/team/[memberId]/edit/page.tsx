"use client";

import { useParams } from "next/navigation";
import { EditTeamMemberForm } from "@/components/startups/team/edit-team-member-form";

export default function EditTeamMemberPage() {
  const params = useParams();
  const startupId = params.id as string;
  const memberId = params.memberId as string;

  return <EditTeamMemberForm startupId={startupId} memberId={memberId} />;
}