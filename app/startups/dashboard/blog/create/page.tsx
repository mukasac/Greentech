"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BlogEditor } from "@/components/blog/blog-editor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BlogFormData, BlogPost } from "@/lib/types/blog";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function CreateBlogPostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [startupId, setStartupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStartup = async () => {
      try {
        const response = await fetch('/api/startups/user');
        const startups = await response.json();
        
        if (startups && startups.length > 0) {
          setStartupId(startups[0].id);
        }
      } catch (error) {
        console.error('Error fetching user startup:', error);
        setError('Failed to load startup information');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchUserStartup();
    }
  }, [session]);

  const handleSave = async (formData: BlogFormData, status: BlogPost['status']) => {
    if (!startupId) {
      setError('No startup selected');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const blogPostData = {
        ...formData,
        slug: generateSlug(formData.title),
        status,
        startupId,
        author: {
          name: session?.user?.name || 'Anonymous',
          role: 'Startup Member',
          avatar: '/default-avatar.png' // Use default avatar since session user doesn't have image
        },
        publishedAt: status === 'published' ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
        readTime: Math.ceil(formData.content.split(/\s+/).length / 200),
        viewCount: 0
      };

      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogPostData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create blog post');
      }

      // Updated redirect to go to the blogs tab in dashboard/profile
      router.push('/startups/dashboard/profile?tab=blog');
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError(err instanceof Error ? err.message : 'Failed to save blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          You must be signed in to create a blog post.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Create Blog Post</h1>
        <p className="text-muted-foreground">
          Share your startup story and updates with the community
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <BlogEditor 
        onSave={handleSave}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}