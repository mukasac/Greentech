"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component
import { BlogPost, BlogFormData } from "@/lib/types/blog";

interface BlogEditFormProps {
  blogId: string;
  startupId: string;
}

export function BlogEditForm({ blogId, startupId }: BlogEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("write");
  const [tagInput, setTagInput] = useState<string>('');
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: [],
  });

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${blogId}`);
        if (!response.ok) throw new Error("Failed to fetch blog post");
        
        const post = await response.json();
        
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          tags: post.tags || [],
        });
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [blogId]);

  const handleChange = (
    field: keyof BlogFormData,
    value: string | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleChange('tags', formData.tags.filter(t => t !== tag));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    try {
      setImageUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      if (data.url) {
        handleChange('coverImage', data.url);
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const generateExcerpt = useCallback(() => {
    if (formData.content && !formData.excerpt) {
      const plainText = formData.content.replace(/<[^>]+>/g, '');
      const excerpt = plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '');
      handleChange('excerpt', excerpt);
    }
  }, [formData.content, formData.excerpt]);

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'published') => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }
      if (!formData.coverImage) {
        throw new Error('Cover image is required');
      }

      if (!formData.excerpt) {
        generateExcerpt();
      }

      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status,
          startupId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update blog post');
      }

      setSuccess('Blog post updated successfully!');
      
      // Redirect after a short delay to the blogs tab in dashboard profile
      setTimeout(() => {
        router.push(`/startups/dashboard/profile?tab=blog`);
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Error updating blog post:', error);
      setError(error instanceof Error ? error.message : 'Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/startups/dashboard/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog Posts
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <Label htmlFor="title" className="mb-2 block text-lg font-medium">
          Post Title
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter an engaging title"
          className="text-xl"
          required
        />
      </div>
      
      <div className="mb-6">
        <Label htmlFor="coverImage" className="mb-2 block font-medium">
          Cover Image
        </Label>
        <div className="mb-4 flex items-center gap-4">
          <div className="relative aspect-video w-40 overflow-hidden rounded border bg-muted">
            {formData.coverImage ? (
              <div className="relative h-full w-full">
                <Image
                  src={formData.coverImage}
                  alt="Cover preview"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex flex-1 gap-4">
            <Input
              value={formData.coverImage}
              onChange={(e) => handleChange('coverImage', e.target.value)}
              placeholder="Image URL"
              className="flex-1"
            />
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="cover-image-upload"
                onChange={handleImageUpload}
                disabled={imageUploading}
              />
              <Button
                variant="outline"
                size="icon"
                type="button"
                disabled={imageUploading}
                onClick={() => document.getElementById('cover-image-upload')?.click()}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="tags" className="mb-2 block font-medium">
          Tags
        </Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <div key={tag} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={handleAddTag}>
            Add
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-4">
          <Label htmlFor="content" className="mb-2 block font-medium">
            Content
          </Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="Write your post content here..."
            rows={15}
            onBlur={generateExcerpt}
            required
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          <div className="rounded border p-4">
            <div className="prose dark:prose-invert max-w-none">
              {formData.content ? (
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              ) : (
                <p className="text-muted-foreground">No content to preview</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mb-6">
        <Label htmlFor="excerpt" className="mb-2 block font-medium">
          Excerpt
        </Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => handleChange('excerpt', e.target.value)}
          placeholder="A brief summary of your post"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={(e) => handleSubmit(e, 'draft')}
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={(e) => handleSubmit(e, 'published')}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </div>
  );
}