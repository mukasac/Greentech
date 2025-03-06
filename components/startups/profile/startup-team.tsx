"use client";

import { Startup, TeamMember } from "@/lib/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import { TwitterIcon } from "lucide-react";

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
    <div className="space-y-10">
      {leadership.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-8">Leadership</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {leadership.map((member: TeamMember) => (
              <div key={member.id} className="mb-8">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-auto mb-4"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                  }}
                />
                <div className="text-center py-2">
                  <p className="text-lg text-gray-500 uppercase">{member.role}</p>
                  <h3 className="text-2xl font-bold mt-1">{member.name}</h3>
                  {member.twitter && (
                    <div className="mt-2">
                      <TwitterIcon className="h-6 w-6 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {otherMembers.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-8">Team Members</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherMembers.map((member: TeamMember) => (
              <div key={member.id} className="mb-8">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-auto mb-4"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                  }}
                />
                <div className="text-center py-2">
                  <p className="text-lg text-gray-500 uppercase">{member.role}</p>
                  <h3 className="text-2xl font-bold mt-1">{member.name}</h3>
                  {member.twitter && (
                    <div className="mt-2">
                      <TwitterIcon className="h-6 w-6 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}