"use client";

import { Startup } from "@/lib/types/startup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Banknote, Target, Leaf, Globe, Users, Calendar, Building2, DollarSign, Briefcase, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface StartupOverviewProps {
  startup: Startup;
}

interface StatItem {
  icon: JSX.Element;
  text: string;
  priority: number;
}

export function StartupOverview({ startup }: StartupOverviewProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const descriptionWords = useMemo(() => {
    return startup.description.split(' ');
  }, [startup.description]);
  
  const shouldTruncate = descriptionWords.length > 30;
  const truncatedDescription = shouldTruncate ? 
    descriptionWords.slice(0, 30).join(' ') + '...' : 
    startup.description;

  // Organize stats for better display
  const statsItems: StatItem[] = [
    ...(startup.founded ? [{
      icon: <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />,
      text: `Founded ${startup.founded}`,
      priority: 1
    }] : []),
    ...(startup.employees ? [{
      icon: <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />,
      text: `${startup.employees} employees`,
      priority: 2
    }] : []),
    ...(startup.country ? [{
      icon: <Globe className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />,
      text: startup.country,
      priority: 3
    }] : []),
    ...(startup.startupStage ? [{
      icon: <Target className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />,
      text: `Stage: ${startup.startupStage}`,
      priority: 4
    }] : []),
    ...(startup.investmentStage ? [{
      icon: <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />,
      text: `Investment: ${startup.investmentStage}`,
      priority: 5
    }] : []),
    ...(startup.fundingNeeds ? [{
      icon: <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />,
      text: `Needs: ${startup.fundingNeeds}`,
      priority: 6
    }] : []),
    ...(startup.mainCategory ? [{
      icon: <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />,
      text: startup.mainCategory.replace("-", " "),
      priority: 7
    }] : []),
    ...(startup.funding ? [{
      icon: <Banknote className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />,
      text: `Funding: ${startup.funding}`,
      priority: 0 // Highest priority
    }] : [])
  ];

  // Sort by priority
  const sortedStatsItems = statsItems.sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Funding
            </CardTitle>
            <Banknote className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{startup.funding}</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Impact Areas
            </CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {startup.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden sm:col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Sustainability Goals
            </CardTitle>
            <Leaf className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {startup.sustainability?.sdgs?.map((sdg) => (
                <Badge key={sdg} variant="outline" className="text-xs">SDG {sdg}</Badge>
              )) || <span className="text-xs sm:text-sm text-muted-foreground">No SDGs specified</span>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-lg sm:text-xl">About {startup.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {showFullDescription ? startup.description : truncatedDescription}
            </p>
            
            {shouldTruncate && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 h-7 px-2 text-xs flex items-center" 
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? 'Show Less' : 'Read More'}
                <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
              </Button>
            )}
          </div>
          
          {/* Company Quick Stats - Horizontal Scrollable on Mobile */}
          <div className="mt-4 sm:mt-6 overflow-x-auto pb-2">
            <div className="flex flex-nowrap gap-3 min-w-full sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {sortedStatsItems.map((item, index) => (
                <div key={index} className="flex items-center gap-1 sm:gap-2 shrink-0 text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {startup.sustainability?.impact && (
            <div className="mt-3 sm:mt-4">
              <h4 className="mb-1 sm:mb-2 text-sm sm:text-base font-semibold">Sustainability Impact</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">{startup.sustainability.impact}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}