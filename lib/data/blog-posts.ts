import { BlogPost } from "../types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    startupId: "1",
    title: "Revolutionizing Solar Energy Storage",
    slug: "revolutionizing-solar-energy-storage",
    excerpt: "Learn about our latest breakthrough in solar energy storage technology that could transform renewable energy adoption.",
    content: `<p>We're excited to announce a major breakthrough in solar energy storage technology...</p>
              <h2>The Challenge</h2>
              <p>One of the biggest challenges in solar energy has been efficient storage...</p>
              <h2>Our Solution</h2>
              <p>Through innovative use of AI and advanced materials...</p>`,
    coverImage: "https://images.unsplash.com/photo-1509390157308-b78dfe79b8fb",
    author: {
      name: "Maria Larsson",
      role: "Head of Research",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    },
    tags: ["Solar Energy", "Innovation", "Technology", "Research"],
    publishedAt: "2024-03-15T10:00:00Z",
    status: "published",
    readTime: 5
  },
  {
    id: "2",
    startupId: "1",
    title: "Partnering with Leading Universities",
    slug: "university-research-partnerships",
    excerpt: "Announcing our new research partnerships with top Nordic universities to accelerate solar technology development.",
    content: `<p>We're thrilled to announce our new partnerships...</p>
              <h2>Research Focus Areas</h2>
              <p>Our collaborative research will focus on...</p>
              <h2>Expected Impact</h2>
              <p>These partnerships will accelerate...</p>`,
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
    author: {
      name: "Erik Nielsen",
      role: "CTO",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    tags: ["Research", "Partnerships", "Education", "Innovation"],
    publishedAt: "2024-03-10T14:30:00Z",
    status: "published",
    readTime: 4
  },
  {
    id: "3",
    startupId: "1",
    title: "Achieving Carbon Neutrality",
    slug: "carbon-neutral-operations",
    excerpt: "How we achieved carbon neutrality in our operations and our roadmap for helping others do the same.",
    content: `<p>Sustainability has always been at our core...</p>
              <h2>Our Journey</h2>
              <p>The path to carbon neutrality involved...</p>
              <h2>Future Goals</h2>
              <p>Looking ahead, we aim to...</p>`,
    coverImage: "https://images.unsplash.com/photo-1473773508845-188df298d2d1",
    author: {
      name: "Anna Jensen",
      role: "CEO",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    tags: ["Sustainability", "Carbon Neutral", "Green Operations"],
    publishedAt: "2024-03-05T09:15:00Z",
    status: "published",
    readTime: 6
  }
];

export const getStartupBlogPosts = (startupId: string) => {
  return blogPosts.filter(post => post.startupId === startupId);
};

export const getBlogPost = (startupId: string, slug: string) => {
  return blogPosts.find(post => post.startupId === startupId && post.slug === slug);
};