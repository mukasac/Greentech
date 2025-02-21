export interface BlogPost {
  id: string;
  startupId: string;
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
  publishedAt: string;
  updatedAt?: string;
  status: 'draft' | 'published';
  readTime: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}