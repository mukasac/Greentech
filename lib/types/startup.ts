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
  createdAt: Date;
  updatedAt: Date;
}