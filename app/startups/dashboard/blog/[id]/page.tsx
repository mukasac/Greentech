"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BlogEditor } from "@/components/blog/blog-editor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { BlogFormData, BlogPost } from "@/lib/types/blog";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch blog post');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const handleSave = async (formData: BlogFormData, status: 'draft' | 'published') => {
    if (!post) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const blogPostData = {
        ...formData,
        status,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/blogs/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogPostData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update blog post');
      }

      // Redirect back to dashboard
      router.push('/startups/dashboard/profile?tab=blog');
    } catch (err) {
      console.error('Error updating blog post:', err);
      setError(err instanceof Error ? err.message : 'Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Blog post not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const initialData: BlogFormData = {
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    tags: post.tags,
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground">
          Update your startup blog post
        </p>
      </div>

      <BlogEditor 
        onSave={handleSave}
        isSubmitting={isSubmitting}
        initialData={initialData}
      />
    </div>
  );
}