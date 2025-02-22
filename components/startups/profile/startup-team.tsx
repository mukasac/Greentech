"use client";

import { Startup, TeamMember } from "@/lib/types/startup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LinkedinIcon, TwitterIcon } from "lucide-react";

interface StartupTeamProps {
  startup: Startup;
}

export function StartupTeam({ startup }: StartupTeamProps) {
  // Early return if no team data
  if (!startup?.team || startup.team.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No team information available.</p>
        </CardContent>
      </Card>
    );
  }

  // Group team members by role
  const leadershipRoles = ['CEO', 'CTO', 'CFO', 'COO', 'Founder', 'Co-Founder'];
  const leadership = startup.team.filter(member => 
    leadershipRoles.some(role => member.role.toUpperCase().includes(role))
  );
  const otherMembers = startup.team.filter(member => 
    !leadershipRoles.some(role => member.role.toUpperCase().includes(role))
  );

  return (
    <div className="space-y-6">
      {leadership.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Leadership Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {leadership.map((member: TeamMember) => (
                <div key={member.id} className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    {member.bio && (
                      <p className="mt-1 text-sm text-muted-foreground">{member.bio}</p>
                    )}
                    <div className="mt-2 flex gap-2">
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {otherMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otherMembers.map((member: TeamMember) => (
                <div key={member.id} className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    {member.bio && (
                      <p className="mt-1 text-sm text-muted-foreground">{member.bio}</p>
                    )}
                    <div className="mt-2 flex gap-2">
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}