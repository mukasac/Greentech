import { Job } from "../types/job";

export const jobs: Job[] = [
  {
    id: "1",
    startupId: "1",
    title: "Senior Solar Technology Engineer",
    type: "full-time",
    experienceLevel: "senior",
    location: {
      type: "hybrid",
      city: "Copenhagen",
      country: "denmark"
    },
    salary: {
      min: 85000,
      max: 120000,
      currency: "EUR"
    },
    description: "Join NordicSolar to develop next-generation solar panel optimization systems using AI and machine learning.",
    requirements: [
      "8+ years of experience in solar technology",
      "Strong background in AI/ML",
      "Masters or PhD in relevant field",
      "Experience with power electronics"
    ],
    responsibilities: [
      "Lead technical development of AI-driven solar optimization",
      "Collaborate with research institutions",
      "Guide junior engineers",
      "Drive innovation in solar efficiency"
    ],
    skills: ["Python", "TensorFlow", "Solar Technology", "Power Systems", "AI/ML"],
    postedAt: "2024-03-15",
    department: "Engineering",
    applicationUrl: "https://nordicsolar.com/careers/senior-solar-engineer"
  },
  {
    id: "2",
    startupId: "2",
    title: "EV Charging Infrastructure Developer",
    type: "full-time",
    experienceLevel: "mid",
    location: {
      type: "on-site",
      city: "Stockholm",
      country: "sweden"
    },
    salary: {
      min: 55000,
      max: 75000,
      currency: "EUR"
    },
    description: "Help build the future of EV charging infrastructure across the Nordic region.",
    requirements: [
      "5+ years in electrical engineering",
      "Experience with EV charging systems",
      "Knowledge of grid integration",
      "Project management skills"
    ],
    responsibilities: [
      "Design charging station layouts",
      "Coordinate with utility companies",
      "Optimize charging networks",
      "Ensure compliance with regulations"
    ],
    skills: ["Electrical Engineering", "AutoCAD", "Grid Systems", "Project Management"],
    postedAt: "2024-03-10",
    department: "Infrastructure",
    applicationUrl: "https://greentransit.se/careers/charging-developer"
  }
];