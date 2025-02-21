"use client";

import { Startup } from "@/lib/types/startup";
import { TeamMemberCard } from "./team-member-card";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin } from "lucide-react";

interface TeamSectionProps {
  startup: Startup;
}

export function TeamSection({ startup }: TeamSectionProps) {
  if (!startup?.team) return null;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-semibold">Company Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{startup.team.totalEmployees} total employees</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {startup.team.locations?.map((location, index) => (
                    <span key={`${location}-${index}`} className="text-sm">
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-semibold">Growth</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Founded in {startup.founded} by {startup.team.founders?.join(" and ")}
              </p>
              <p className="text-sm text-muted-foreground">
                Currently at {startup.team.totalEmployees} employees across {startup.team.locations?.length} locations
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {startup.team.leadership?.length > 0 && (
        <section>
          <h3 className="mb-6 text-xl font-semibold">Leadership Team</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {startup.team.leadership.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}

      {startup.team.departments?.length > 0 && (
        <section>
          <h3 className="mb-6 text-xl font-semibold">Departments</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {startup.team.departments.map((dept, index) => (
              <Card key={`${dept.name}-${index}`}>
                <CardContent className="pt-6">
                  <h4 className="mb-2 font-semibold">{dept.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {dept.employeeCount} employees
                  </p>
                  {dept.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {dept.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}