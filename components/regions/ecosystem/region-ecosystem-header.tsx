import { Region } from "@/lib/types/region";

interface RegionEcosystemHeaderProps {
  region: Region;
}

export function RegionEcosystemHeader({ region }: RegionEcosystemHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-green-600 to-green-700">
      <div className="container py-16">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {region.name} Green Tech Ecosystem
          </h1>
          <p className="text-lg text-green-100">
            Discover the network of innovators, investors, and institutions driving sustainable technology innovation in {region.name}.
          </p>
        </div>
      </div>
    </div>
  );
}