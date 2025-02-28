// app/admin/news/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePermissions } from "@/hooks/usePermissions";
import { NewsItem } from "@/lib/types/news";

const regions = [
  { value: "norway", label: "Norway" },
  { value: "sweden", label: "Sweden" },
  { value: "denmark", label: "Denmark" },
  { value: "finland", label: "Finland" },
  { value: "iceland", label: "Iceland" },
];

export default function EditNewsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    tags: "",
    region: "",
    source: "",
  });

  useEffect(() => {
    // Redirect if not authenticated or doesn't have permission
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    if (status === "authenticated" && !hasPermission("SITE_ADMIN")) {
      router.push("/unauthorized");
      return;
    }

    // Fetch the news article
    fetchNewsArticle();
  }, [status, router, hasPermission, params.id]);

  const fetchNewsArticle = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/news/${params.id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch news article");
      }
      
      const newsItem: NewsItem = await response.json();
      
      setFormData({
        title: newsItem.title,
        excerpt: newsItem.excerpt,
        content: newsItem.content,
        image: newsItem.image,
        tags: newsItem.tags.join(", "),
        region: newsItem.region,
        source: newsItem.source || "",
      });
    } catch (error) {
      console.error("Error fetching news article:", error);
      setError("Failed to load news article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert tags string to array
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const newsData = {
        ...formData,
        tags,
      };

      const response = await fetch(`/api/news/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update news article");
      }

      router.push("/admin/news?success=updated");
    } catch (error) {
      console.error("Error updating news:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update news article"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit News Article</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter news title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary (50-150 characters)"
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Full article content"
                required
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => handleSelectChange("region", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source (Optional)</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="Source name or URL"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Investment, Innovation, Policy (comma separated)"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/news")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}