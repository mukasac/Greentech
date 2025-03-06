"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, Users, Calendar, Leaf, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface CompanyPreviewCardProps {
  company: {
    id: string;
    name: string;
    logo: string;
    country: string;
    founded?: number;
    employees?: string;
    tags?: string[];
    climateImpacts?: any[];
    website?: string;
  };
}

export function CompanyPreviewCard({ company }: CompanyPreviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl">About the Company</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-6 pb-4 flex items-center space-x-4">
          <div className="h-16 w-16 rounded-lg border overflow-hidden flex-shrink-0 bg-white p-1">
            {company.logo && (
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full object-contain"
              />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{company.name}</h3>
            <p className="text-muted-foreground">
              {company.country}
            </p>
          </div>
        </div>
        
        <div className="px-6 pb-4 grid gap-4">
          {company.founded && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Founded in {company.founded}</span>
            </div>
          )}
          
          {company.employees && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{company.employees} employees</span>
            </div>
          )}
          
          {company.country && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{company.country}</span>
            </div>
          )}
        </div>
        
        {company.tags && company.tags.length > 0 && (
          <div className="px-6 pb-4">
            <h4 className="text-sm font-medium mb-2">Focus Areas</h4>
            <div className="flex flex-wrap gap-2">
              {company.tags.slice(0, expanded ? undefined : 5).map((tag, i) => (
                <Badge key={i} variant="secondary">{tag}</Badge>
              ))}
              {!expanded && company.tags.length > 5 && (
                <Badge variant="outline" onClick={() => setExpanded(true)} className="cursor-pointer">
                  +{company.tags.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {company.climateImpacts && company.climateImpacts.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 text-sm">
              <Leaf className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-700">Climate Impact Reported</span>
            </div>
          </div>
        )}
        
        <div className="p-6 pt-2 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
          {company.website && (
            <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                Visit Website
              </a>
            </Button>
          )}
          
          <Button size="sm" className="w-full sm:w-auto" asChild>
            <Link href={`/startups/${company.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Company Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}