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
  publishedAt: Date | null;
  updatedAt: Date | null;
  status: 'draft' | 'published' | 'archived';
  readTime: number;
  viewCount: number;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  blogId: string;
  name: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
}