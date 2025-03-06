import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Pencil, UserPlus } from "lucide-react";
import Link from "next/link";

interface TeamSectionProps {
  startup: any; // Replace with proper type
}

export function TeamSection({ startup }: TeamSectionProps) {
  if (!startup?.team?.length) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 rounded-full bg-muted p-6">
            <UserPlus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No Team Members Yet</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Add your first team member to showcase your startup talent.
          </p>
          <Button asChild>
            <Link href={`/startups/${startup.id}/team/add`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <Button asChild>
          <Link href={`/startups/${startup.id}/team/add`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {startup.team.map((member: any) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/startups/${startup.id}/team/${member.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}