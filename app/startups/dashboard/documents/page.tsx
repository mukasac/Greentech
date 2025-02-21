"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/startups/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, 
  FileText,
  Search,
  Download, 
  File, 
  Image,
  FileIcon,
  Table2,
  MoreVertical,
  Share,
  Trash
} from "lucide-react";
import { Startup } from "@/lib/types/startup";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock documents data
const documents = [
  {
    id: "1",
    name: "Business Plan.pdf",
    type: "pdf",
    size: "2.4 MB",
    updatedAt: "2024-01-15",
    shared: true
  },
  {
    id: "2",
    name: "Financial Projection.xlsx",
    type: "spreadsheet",
    size: "1.8 MB",
    updatedAt: "2024-01-12",
    shared: false
  },
  {
    id: "3",
    name: "Product Roadmap.pdf",
    type: "pdf",
    size: "3.2 MB",
    updatedAt: "2024-01-10",
    shared: true
  },
  {
    id: "4",
    name: "Team Structure.docx",
    type: "document",
    size: "840 KB",
    updatedAt: "2024-01-08",
    shared: false
  },
  {
    id: "5",
    name: "Marketing Assets.zip",
    type: "archive",
    size: "15.6 MB",
    updatedAt: "2024-01-05",
    shared: true
  }
];

export default function DocumentsDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    // Fetch user's startups
    const fetchStartups = async () => {
      try {
        const response = await fetch("/api/startups/user");
        if (!response.ok) {
          throw new Error("Failed to fetch startups");
        }
        const data = await response.json();
        setStartups(data);
        if (data.length > 0) {
          setSelectedStartup(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching startups:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchStartups();
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <p>Loading documents...</p>
      </div>
    );
  }
  
  const filteredDocuments = searchQuery
    ? documents.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : documents;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileIcon className="h-5 w-5 text-red-500" />;
      case 'spreadsheet':
        return <Table2 className="h-5 w-5 text-green-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardSidebar />
        
        <main>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Documents</h1>
              <p className="text-muted-foreground">
                Manage your startup documents and files
              </p>
            </div>
            
            {startups.length > 0 && (
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            )}
          </div>

          {startups.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">No Startups Yet</h2>
                <p className="mb-6 text-center text-muted-foreground">
                  Create a startup before managing documents.
                </p>
                <Button asChild size="lg">
                  <Link href="/startups/create">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Your First Startup
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {startups.length > 1 && (
                <div className="mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <label className="mb-2 block text-sm font-medium">
                        Select Startup
                      </label>
                      <select
                        className="w-full rounded-md border p-2"
                        value={selectedStartup || ''}
                        onChange={(e) => setSelectedStartup(e.target.value)}
                      >
                        {startups.map((startup) => (
                          <option key={startup.id} value={startup.id}>
                            {startup.name}
                          </option>
                        ))}
                      </select>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Document Library</CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredDocuments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="mb-4 rounded-full bg-muted p-6">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h2 className="mb-2 text-xl font-semibold">No Documents Found</h2>
                      <p className="mb-6 text-center text-muted-foreground">
                        {searchQuery 
                          ? `No documents matching "${searchQuery}"`
                          : "Upload your first document to get started"}
                      </p>
                      {!searchQuery && (
                        <Button>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Upload Document
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Last Modified</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getFileIcon(doc.type)}
                                <span>{doc.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{doc.updatedAt}</TableCell>
                            <TableCell>{doc.size}</TableCell>
                            <TableCell>
                              {doc.shared ? (
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                  Shared
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                  Private
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share className="mr-2 h-4 w-4" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}