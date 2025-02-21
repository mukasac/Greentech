import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

// This would come from your data layer
const mockPost = {
  id: "1",
  startupId: "1",
  title: "Revolutionizing Solar Energy Storage",
  slug: "revolutionizing-solar-energy-storage",
  content: `
    <p>Detailed content about the breakthrough in solar energy storage technology...</p>
    <h2>The Challenge</h2>
    <p>Discussion of the challenges in current solar storage solutions...</p>
    <h2>Our Solution</h2>
    <p>Details about the innovative approach we've developed...</p>
  `,
  coverImage: "https://images.unsplash.com/photo-1509390157308-b78dfe79b8fb",
  author: {
    name: "Maria Larsson",
    role: "Head of Research",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
  tags: ["Solar Energy", "Innovation", "Technology"],
  publishedAt: "2024-03-15T10:00:00Z",
  readTime: 5,
};

export default function BlogPostPage() {
  return (
    <article className="container py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {mockPost.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mb-4 text-4xl font-bold">{mockPost.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={mockPost.author.avatar} alt={mockPost.author.name} />
                <AvatarFallback>{mockPost.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{mockPost.author.name}</p>
                <p className="text-sm text-muted-foreground">{mockPost.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(mockPost.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{mockPost.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>

        <div className="aspect-video overflow-hidden rounded-lg mb-8">
          <img
            src={mockPost.coverImage}
            alt={mockPost.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert" 
             dangerouslySetInnerHTML={{ __html: mockPost.content }} />
      </div>
    </article>
  );
}