"use client";

// components/regions/ecosystem/region-partners.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, GraduationCap, Briefcase, LandmarkIcon } from "lucide-react";

interface Partner {
  name: string;
  logo: string;
  type: "accelerator" | "investor" | "university" | "government";
}

interface RegionPartnersProps {
  partners: Partner[];
}

export function RegionPartners({ partners }: RegionPartnersProps) {
  if (!partners || partners.length === 0) {
    return null;
  }
  
  // Map partner types to appropriate icons
  const getPartnerIcon = (type: string) => {
    switch (type) {
      case 'accelerator':
        return <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'investor':
        return <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case 'university':
        return <GraduationCap className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case 'government':
        return <LandmarkIcon className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default:
        return <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };
  
  // Map partner types to readable format
  const formatPartnerType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Handle image error (falls back to placeholder)
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/placeholder-logo.png";
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Ecosystem Partners</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((partner, index) => (
          <Card key={index} className="h-full transition-all hover:shadow-md">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-24 max-w-full object-contain"
                  onError={handleImageError}
                />
              </div>
              <h3 className="mb-2 font-semibold">{partner.name}</h3>
              <div className="mt-auto flex items-center gap-2">
                {getPartnerIcon(partner.type)}
                <Badge variant="secondary">
                  {formatPartnerType(partner.type)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}