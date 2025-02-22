// components/startups/team/team-section.tsx
"use client";

import { useState } from "react";
import { Startup, TeamMember } from "@/lib/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import Image from "next/image";

interface TeamSectionProps {
  startup: Startup;
}

export function TeamSection({ startup }: TeamSectionProps) {
  const { hasPermission } = usePermissions();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/startups/${startup.id}/team/${memberId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete team member');
      
      // Refresh the page to show updated team
      window.location.reload();
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to delete team member');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!startup?.team || startup.team.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium">No Team Members</p>
          <p className="text-sm text-muted-foreground">Add team members to showcase your startup team</p>
          {hasPermission("MANAGE_TEAM") && (
            <Button className="mt-4" asChild>
              <Link href={`/startups/${startup.id}/team/add`}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Team Member
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Members</h2>
        {hasPermission("MANAGE_TEAM") && (
          <Button asChild>
            <Link href={`/startups/${startup.id}/team/add`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {startup.team.map((member: TeamMember) => (
          <Card key={member.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={member.image || "/placeholder-avatar.png"}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              {member.bio && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {member.bio}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                {member.linkedin && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </Button>
                )}
                {member.twitter && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                  </Button>
                )}
                {hasPermission("MANAGE_TEAM") && (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/startups/${startup.id}/team/${member.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}