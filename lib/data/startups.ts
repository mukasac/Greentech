import { Startup } from "../types/startup";

export const startups: Startup[] = [
  {
    id: "1",
    name: "NordicSolar",
    logo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60",
    profileImage: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1600&h=900&fit=crop",
    gallery: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
        alt: "Solar panel installation",
        caption: "Our latest solar panel installation in Copenhagen"
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1509390157308-b78dfe79b8fb?w=800",
        alt: "Research team",
        caption: "Our research team working on AI optimization"
      },
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
        alt: "Solar technology",
        caption: "Next-generation solar cell technology"
      }
    ],
    description: "Revolutionizing solar panel efficiency with AI-driven optimization technology.",
    mainCategory: "renewable-energy",
    subcategories: ["solar", "ai-data"],
    country: "denmark",
    founded: 2019,
    website: "https://nordicsolar.com",
    funding: "$12M",
    employees: "50-100",
    tags: ["Solar Energy", "AI Optimization", "Clean Tech"],
    sustainability: {
      impact: "Reduced CO2 emissions by 50,000 tons annually",
      sdgs: [7, 9, 13],
      carbonFootprint: "Net-zero operations"
    },
    team: {
      founders: ["Anna Jensen", "Erik Nielsen"],
      totalEmployees: 75,
      locations: ["Copenhagen", "Aarhus"],
      leadership: [
        {
          id: "1",
          name: "Anna Jensen",
          role: "CEO & Co-founder",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
          bio: "20+ years experience in renewable energy",
          linkedin: "https://linkedin.com/in/anna-jensen",
          twitter: "https://twitter.com/anna_jensen"
        },
        {
          id: "2",
          name: "Erik Nielsen",
          role: "CTO & Co-founder",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
          bio: "Former Lead Engineer at Tesla",
          linkedin: "https://linkedin.com/in/erik-nielsen"
        },
        {
          id: "3",
          name: "Maria Larsson",
          role: "Head of Research",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
          bio: "PhD in Solar Technology",
          linkedin: "https://linkedin.com/in/maria-larsson"
        }
      ],
      departments: [
        {
          name: "Engineering",
          employeeCount: 30,
          description: "Solar panel optimization and AI integration"
        },
        {
          name: "Research & Development",
          employeeCount: 15,
          description: "Next-generation solar technology research"
        },
        {
          name: "Operations",
          employeeCount: 20,
          description: "Installation and maintenance services"
        },
        {
          name: "Sales & Marketing",
          employeeCount: 10,
          description: "Business development and customer relations"
        }
      ]
    }
  }
];