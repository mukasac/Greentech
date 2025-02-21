import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Partner {
  name: string;
  logo: string;
  type: "accelerator" | "investor" | "university" | "government";
}

interface RegionPartnersProps {
  partners: Partner[];
}

export function RegionPartners({ partners }: RegionPartnersProps) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Ecosystem Partners</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((partner) => (
          <Card key={partner.name}>
            <CardContent className="p-6">
              <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-2 font-semibold">{partner.name}</h3>
              <Badge variant="secondary">{partner.type}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}