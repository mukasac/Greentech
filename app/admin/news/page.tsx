// app/admin/news/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Search, Eye, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { NewsItem } from "@/lib/types/news";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for when API fails
const mockNews: NewsItem[] = [
  {
    id: "mock-1",
    title: "Norway Launches $100M Green Tech Fund",
    slug: "norway-launches-green-tech-fund",
    excerpt: "New government initiative to boost sustainable technology innovation across the country.",
    content: "The Norwegian government has announced a new $100 million fund dedicated to green technology innovation.",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51",
    tags: ["Investment", "Government", "Green Tech"],
    region: "norway",
    source: "Ministry of Climate and Environment",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mock-2",
    title: "Swedish Startup Revolutionizes Battery Recycling",
    slug: "swedish-startup-revolutionizes-battery-recycling",
    excerpt: "Innovative technology reclaims 95% of materials from used lithium-ion batteries.",
    content: "A Stockholm-based startup has developed a groundbreaking process that can reclaim up to 95% of materials from used lithium-ion batteries.",
    image: "https://images.unsplash.com/photo-1611122281384-b1dbd38ed6eb",
    tags: ["Innovation", "Circular Economy", "Energy Storage"],
    region: "sweden",
    source: "GreenTech Sweden",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function AdminNewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [usesMockData, setUsesMockData] = useState<boolean>(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Redirect if not authenticated or doesn't have admin permission
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    if (status === "authenticated" && !hasPermission("SITE_ADMIN")) {
      router.push("/unauthorized");
      return;
    }

    // Fetch news only if authenticated and has permission and hasn't already fetched
    if (status === "authenticated" && !hasFetchedRef.current) {
      hasFetchedRef.current = true; // Set flag to prevent multiple fetches
      fetchNews();
    }
  }, [status, router, hasPermission]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setFetchError(false);
      setUsesMockData(false);
      
      const response = await fetch("/api/news", {
        // Add cache: 'no-store' to ensure fresh data
        cache: 'no-store', 
        headers: {
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        console.log("No news data found or empty array, using mock data");
        setNews(mockNews);
        setUsesMockData(true);
      } else {
        setNews(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setFetchError(true);
      setError(`Failed to load news articles: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback to mock data
      setNews(mockNews);
      setUsesMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (newsId: string) => {
    if (!confirm("Are you sure you want to delete this news article?")) {
      return;
    }

    if (usesMockData) {
      setSuccess("Mock deletion successful (API is unavailable)");
      setNews(news.filter(item => item.id !== newsId));
      return;
    }

    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete news article");
      }

      setSuccess("News article deleted successfully");
      setNews(news.filter(item => item.id !== newsId));
    } catch (error) {
      console.error("Error deleting news:", error);
      setError("Failed to delete news article");
    }
  };

  const filteredNews = searchQuery
    ? news.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : news;

  if (status === "loading") {
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-muted-foreground">
            Create and manage news articles for the platform
          </p>
          {usesMockData && (
            <p className="text-amber-600 font-medium mt-1">
              Using mock data - API unavailable
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {loading ? (
            <Button variant="outline" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : (
            <Button variant="outline" onClick={() => {
              hasFetchedRef.current = false;
              fetchNews();
            }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
          
          {hasPermission("CREATE_LATEST_NEWS") && (
            <Button asChild>
              <Link href="/admin/news/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create News Article
              </Link>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>News Articles</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No news articles found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.region}</TableCell>
                    <TableCell>
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/news/${item.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {hasPermission("UPDATE_LATEST_NEWS") && (
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/admin/news/${item.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {hasPermission("DELETE_LATEST_NEWS") && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}