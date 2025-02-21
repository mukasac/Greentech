import { Region } from "../types/region";

export const regions: Region[] = [
  {
    id: "norway",
    slug: "norway",
    name: "Norway",
    description: "Leading the way in clean energy, maritime innovation, and sustainable technologies across the Nordic region.",
    coverImage: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca",
    stats: {
      startups: 450,
      employees: 12000,
      openJobs: 850,
      upcomingEvents: 24,
      totalInvestment: "€2.8B"
    },
    initiatives: [
      {
        title: "Green Maritime Innovation",
        description: "Supporting the development of zero-emission vessels and sustainable maritime solutions."
      },
      {
        title: "Clean Energy Hub",
        description: "Accelerating renewable energy innovations and smart grid technologies."
      }
    ],
    ecosystemPartners: [
      {
        name: "Innovation Norway",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623",
        type: "government"
      }
    ]
  },
  {
    id: "sweden",
    slug: "sweden",
    name: "Sweden",
    description: "Home to groundbreaking innovations in cleantech, sustainable mobility, and circular economy solutions.",
    coverImage: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11",
    stats: {
      startups: 580,
      employees: 15000,
      openJobs: 920,
      upcomingEvents: 32,
      totalInvestment: "€3.2B"
    },
    initiatives: [
      {
        title: "Sustainable Mobility",
        description: "Advancing electric and autonomous vehicle technologies."
      },
      {
        title: "Circular Innovation",
        description: "Promoting circular economy solutions and waste reduction technologies."
      }
    ],
    ecosystemPartners: [
      {
        name: "Vinnova",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623",
        type: "government"
      }
    ]
  },
  {
    id: "denmark",
    slug: "denmark",
    name: "Denmark",
    description: "Pioneering wind energy, agritech innovations, and sustainable urban solutions.",
    coverImage: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc",
    stats: {
      startups: 420,
      employees: 11000,
      openJobs: 780,
      upcomingEvents: 28,
      totalInvestment: "€2.5B"
    },
    initiatives: [
      {
        title: "Wind Energy Excellence",
        description: "Supporting next-generation wind energy technologies."
      },
      {
        title: "Smart Cities",
        description: "Developing sustainable urban solutions and smart infrastructure."
      }
    ],
    ecosystemPartners: [
      {
        name: "Innovation Fund Denmark",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623",
        type: "government"
      }
    ]
  },
  {
    id: "finland",
    slug: "finland",
    name: "Finland",
    description: "Excelling in cleantech, forestry innovation, and sustainable digital solutions.",
    coverImage: "https://images.unsplash.com/photo-1508592931388-95bc7b61033d",
    stats: {
      startups: 380,
      employees: 9500,
      openJobs: 620,
      upcomingEvents: 22,
      totalInvestment: "€2.1B"
    },
    initiatives: [
      {
        title: "Forest Bioeconomy",
        description: "Innovating sustainable forestry and bio-based materials."
      },
      {
        title: "Digital Sustainability",
        description: "Developing AI and IoT solutions for environmental challenges."
      }
    ],
    ecosystemPartners: [
      {
        name: "Business Finland",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623",
        type: "government"
      }
    ]
  },
  {
    id: "iceland",
    slug: "iceland",
    name: "Iceland",
    description: "Leading in geothermal energy, carbon capture, and sustainable resource management.",
    coverImage: "https://images.unsplash.com/photo-1490080886466-6ea0a78bae16",
    stats: {
      startups: 180,
      employees: 4200,
      openJobs: 320,
      upcomingEvents: 15,
      totalInvestment: "€0.9B"
    },
    initiatives: [
      {
        title: "Geothermal Innovation",
        description: "Advancing geothermal energy technologies and applications."
      },
      {
        title: "Carbon Capture",
        description: "Developing direct air capture and mineral storage solutions."
      }
    ],
    ecosystemPartners: [
      {
        name: "Rannís",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623",
        type: "government"
      }
    ]
  }
];