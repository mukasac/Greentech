// lib/types/startup.ts
// Base interfaces
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  startupId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  isPrimary: boolean;
  startupId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: string;
  shared: boolean;
  startupId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  title: string;
  type: string; // full-time, part-time, contract, internship
  experienceLevel: string; // entry, mid, senior, lead, executive
  location: {
    type: string; // remote/hybrid/on-site
    city?: string;
    country: string;
  };
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  department: string;
  applicationUrl: string;
  status: string; // active, filled, expired
  applicationCount: number;
  viewCount: number;
  startupId: string;
  applications: JobApplication[];
  postedAt: Date;
  expiresAt?: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateName: string;
  email: string;
  resumeUrl: string;
  coverLetter?: string;
  status: string; // new, reviewing, interview, offer, rejected
  notes?: string;
  appliedAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  status: string; // draft, published, archived
  readTime: number;
  viewCount: number;
  startupId: string;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  blogId: string;
  name: string;
  email: string;
  content: string;
  status: string; // pending, approved, rejected
  createdAt: Date;
}

// Updated Impact Metrics Interface
export interface ImpactMetrics {
  // Core metrics (original ones)
  co2Reduction?: number;
  waterSaved?: number;
  energyEfficiency?: number;
  wasteDiverted?: number;
  biodiversityImpact?: string;
  
  // Emissions & Energy
  renewableEnergyGenerated?: number;
  ghgEmissions?: number;
  digitalSustainability?: string;
  
  // Water & Resources
  waterQualityImprovement?: number;
  resourceEfficiency?: number;
  plasticReduction?: number;
  
  // Biodiversity & Land
  landAreaPreserved?: number;
  habitatCreation?: string;
  speciesProtected?: number;
  soilHealthImprovement?: number;
  desertificationPrevention?: string;
  ecosystemServicesValue?: number;
  
  // Social & Health
  healthcareImpacts?: string;
  socialImpactMetrics?: string;
  environmentalJusticeMetrics?: string;
  
  // Pollution Reduction
  airQualityImprovement?: number;
  chemicalPollutionReduction?: number;
  noisePollutionReduction?: number;
  
  // Other Impacts
  climateResilienceContribution?: string;
  circularEconomyContribution?: number;
  sustainableFoodProduction?: number;
  foodWasteReduction?: number;
  oceanHealthImpact?: string;
  technologyTransfer?: string;
  sustainableTransportationImpact?: number;
  urbanSustainabilityMetrics?: string;
  greenBuildingImpact?: number;
  sustainableAgricultureImpact?: number;
}

// Updated Lifecycle Impact Interface
export interface LifecycleImpact {
  circularity?: number;
  circularityDescription?: string;
  recycledMaterials?: number;
  recycledMaterialsDescription?: string;
  wasteReduction?: number;
  wasteReductionDescription?: string;
  supplyChainReduction?: number;
  supplyChainReductionDescription?: string;
  description?: string;

  // Materials & Design
  repairabilityScore?: number;
  designForDisassembly?: number;
  biodegradableMaterials?: number;
  biomimicryImplementation?: string;
  
  // Production & Manufacturing
  manufacturingEfficiency?: string;
  waterUsageInProduction?: number;
  renewableEnergyInProduction?: number;
  toxicMaterialElimination?: number;
  manufacturingEnergyIntensity?: number;
  workerHealthSafety?: number;
  byproductValorization?: number;
  greenChemistryPrinciples?: number;
  
  // Supply Chain
  materialSourcingEthics?: number;
  supplyChainTransparency?: number;
  conflictMineralsPolicy?: string;
  sustainableProcurementScore?: number;
  transportationFootprint?: number;
  logisticsOptimization?: number;
  
  // Product Use & Performance
  productLifespan?: number;
  productCarbonFootprint?: number;
  waterFootprintOfProduct?: number;
  durabilityTestingResults?: string;
  plannedObsolescenceAvoidance?: string;
  
  // End-of-Life & Circularity
  endOfLifeRecoveryRate?: number;
  takeBackPrograms?: string;
  remanufacturingCapability?: number;
  upcyclingPotential?: number;
  extendedProducerResponsibility?: string;
  
  // Assessment & Documentation
  lcaResults?: string;
  productEnvironmentalFootprint?: string;
  digitalProductPassport?: string;
  materialPassport?: string;
  socialLCAMetrics?: string;
}

// New interface to handle metrics property
export interface ClimateImpactMetrics {
  // Core metrics
  co2Reduction?: number;
  co2ReductionDescription?: string;
  waterSaved?: number;
  waterSavedDescription?: string;
  energyEfficiency?: number;
  energyEfficiencyDescription?: string;
  wasteDiverted?: number;
  wasteDivertedDescription?: string;
  biodiversityImpact?: string;
  biodiversityImpactDescription?: string;
  airQualityImprovement?: number;
  airQualityImprovementDescription?: string;
  landAreaPreserved?: number;
  landAreaPreservedDescription?: string;
  
  // Emissions & Energy
  renewableEnergyGenerated?: number;
  renewableEnergyGeneratedDescription?: string;
  ghgEmissions?: number;
  ghgEmissionsDescription?: string;
  digitalSustainability?: string;
  digitalSustainabilityDescription?: string;
  
  // Water & Resources
  waterQualityImprovement?: number;
  waterQualityImprovementDescription?: string;
  resourceEfficiency?: number;
  resourceEfficiencyDescription?: string;
  plasticReduction?: number;
  plasticReductionDescription?: string;
  
  // Additional metrics may be added as needed
  [key: string]: string | number | undefined;
}

// Updated Climate Impact interface
export interface ClimateImpact {
  id: string;
  isActive: boolean;
  
  // New property for structured metrics
  metrics?: ClimateImpactMetrics;
  
  // Impact Metrics
  co2Reduction?: number;
  co2ReductionDescription?: string;
  waterSaved?: number;
  waterSavedDescription?: string;
  energyEfficiency?: number;
  energyEfficiencyDescription?: string;
  wasteDiverted?: number;
  wasteDivertedDescription?: string;
  biodiversityImpact?: string;

  // Carbon Footprint
  carbonCaptured?: number;
  carbonCapturedDescription?: string;
  lifecycleCo2Reduction?: number;
  lifecycleCo2ReductionDescription?: string;
  offsetPrograms?: string;

  // SDGs and Certifications
  sdgs: number[];
  sdgImpact?: string;
  certifications: string[];
  awards?: string;

  // Lifecycle Impact
  lifecycle?: LifecycleImpact;

  startupId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Main Startup interface
export interface Startup {
  id: string;
  name: string;
  description: string;
  logo: string;
  profileImage: string;
  mainCategory: string;
  subcategories: string[];
  country: string;
  founded: number;
  website: string;
  funding: string;
  employees: string;
  tags: string[];
  
  // Stage field (for backward compatibility)
  stage?: string;
  
  // New fields for startup stages and funding
  startupStage?: string; // idea, mvp, early-traction, growth, maturity
  investmentStage?: string; // pre-seed, seed, series-a, series-b, series-c-plus, exit, bootstrapping
  fundingNeeds?: string; // looking, not-looking
  
  status: string; // active, pending, archived
  featured: boolean;
  sustainability?: {
    impact: string;
    sdgs: string[];
  };
  viewCount: number;
  userId: string;
  team: TeamMember[];
  gallery: GalleryImage[];
  jobs: Job[];
  blogPosts: BlogPost[];
  documents: Document[];
  climateImpacts: ClimateImpact[]; // Now using the updated interface
  createdAt: Date;
  updatedAt: Date;
}