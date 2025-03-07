"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/startups/dashboard/sidebar";
import { BlogEditForm } from "@/components/blog/blog-edit-form";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [startupId, setStartupId] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }
    
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${blogId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog post");
        }
        const data = await response.json();
        setStartupId(data.startupId);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (status === "authenticated") {
      fetchBlogPost();
    }
  }, [status, router, blogId]);
  
  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!startupId) {
    return (
      <div className="container py-8">
        <p>Could not find blog post details</p>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardSidebar />
        
        <main>
          <Card>
            <CardHeader>
              <CardTitle>Edit Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogEditForm 
                blogId={blogId} 
                startupId={startupId} 
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}