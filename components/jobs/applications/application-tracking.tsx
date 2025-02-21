"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

type ApplicationStatus = "new" | "reviewing" | "interview" | "offer" | "rejected";

interface Application {
  id: string;
  candidateName: string;
  email: string;
  status: ApplicationStatus;
  appliedAt: string;
  experience: string;
}

const mockApplications: Application[] = [
  {
    id: "1",
    candidateName: "John Doe",
    email: "john@example.com",
    status: "new",
    appliedAt: "2024-03-15",
    experience: "5 years",
  },
  // Add more mock data as needed
];

const statusColors: Record<ApplicationStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  reviewing: "bg-yellow-100 text-yellow-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function ApplicationTracking() {
  const [applications] = useState<Application[]>(mockApplications);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");

  const filteredApplications = applications.filter(
    app => filter === "all" || app.status === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search candidates..." />
        </div>
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={(value: ApplicationStatus | "all") => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <Card key={application.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{application.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">{application.email}</p>
                </div>
                <Badge className={statusColors[application.status]}>
                  {application.status}
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Applied: {application.appliedAt}</span>
                  <span>Experience: {application.experience}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Profile</Button>
                  <Button size="sm">Update Status</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}