import { Region } from "@/lib/types/region";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Briefcase, Calendar } from "lucide-react";

interface RegionStatsProps {
  region: Region;
}

export function RegionStats({ region }: RegionStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{region.stats.startups}</p>
              <p className="text-sm text-muted-foreground">Active Startups</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{region.stats.employees}</p>
              <p className="text-sm text-muted-foreground">Total Employees</p>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">{region.stats.openJobs}</p>
              <p className="text-sm text-muted-foreground">Open Positions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">{region.stats.upcomingEvents}</p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}