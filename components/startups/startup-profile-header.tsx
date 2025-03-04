import { Startup } from "@/lib/types/startup";
import { Badge } from "@/components/ui/badge";

interface StartupProfileHeaderProps {
  startup: Startup;
}

export function StartupProfileHeader({ startup }: StartupProfileHeaderProps) {
  return (
    <div className="relative mb-8">
      <div className="aspect-[21/9] overflow-hidden rounded-xl">
        <img
          src={startup.profileImage}
          alt={`${startup.name} cover`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute -bottom-6 left-8 flex items-end space-x-4">
        <div className="h-24 w-24 overflow-hidden rounded-xl border-4 border-background">
          <img
            src={startup.logo}
            alt={startup.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">
            {startup.name}
          </h1>
          <div className="flex gap-2">
            {startup.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="shadow">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}