"use client";

import { TeamMember } from "@/lib/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import { LinkedinIcon, TwitterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold">{member.name}</h3>
        <p className="text-sm text-muted-foreground">{member.role}</p>
        
        {member.bio && (
          <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
        )}
        
        <div className="mt-4 flex gap-2">
          {member.linkedin && (
            <Button variant="ghost" size="icon" asChild>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
          {member.twitter && (
            <Button variant="ghost" size="icon" asChild>
              <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                <TwitterIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}