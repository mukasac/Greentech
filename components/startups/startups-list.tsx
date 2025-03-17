"use client";

import React, { useState, useEffect } from "react";
import { StartupCard } from "./startup-card";
import type { Startup } from "@/lib/types/startup";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationData {
  total: number;
  pages: number;
  current: number;
  limit: number;
}

interface ApiResponse {
  startups: Startup[];
  pagination: PaginationData;
}

export function StartupsList() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    current: 1,
    limit: 10,
  });

  const fetchStartups = async (page = 1) => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      // Ensure we request at least 3 items per page for proper grid layout
      params.append("limit", pagination.limit.toString());
      if (category) params.append("category", category);
      if (region) params.append("region", region);

      const response = await fetch(`/api/startups?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch startups");
      }

      const data: ApiResponse = await response.json();
      
      // Ensure we have data to display
      if (data.startups && Array.isArray(data.startups)) {
        setStartups(data.startups);
        setPagination(data.pagination);
      } else {
        console.error("Invalid startup data format:", data);
        setError("Received invalid data format from server.");
      }
    } catch (err) {
      console.error("Error fetching startups:", err);
      setError("Failed to load startups. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups(pagination.current);
  }, [category, region, pagination.current, pagination.limit]);

  // Ensure minimum number of items per page for better layout
  useEffect(() => {
    if (startups.length > 0 && startups.length < 3 && pagination.pages > 1) {
      console.log("Detected potentially insufficient items per page. You might want to increase the items per page.");
    }
  }, [startups, pagination]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchStartups(newPage);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!startups?.length) {
    return <EmptyState />;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Main grid layout for startup cards */}
      <motion.div
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {startups.map((startup, index) => (
          <motion.div
            key={startup.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="w-full"
          >
            <StartupCard startup={startup} />
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination controls */}
      {pagination.pages > 1 && (
        <div className="flex flex-col items-center mt-8 mb-6">
          <div className="flex justify-center items-center gap-1 md:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="h-8 w-8 p-0"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <PaginationButtons 
              currentPage={pagination.current}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className="h-8 w-8 p-0"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Pagination Summary */}
          <div className="text-sm text-muted-foreground mt-3">
            Showing {(pagination.current - 1) * pagination.limit + 1}-
            {Math.min(pagination.current * pagination.limit, pagination.total)} of{" "}
            {pagination.total} startups
          </div>
        </div>
      )}
    </div>
  );
}

// Pagination buttons component
function PaginationButtons({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    // For small number of pages, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }
    
    // Always include first page
    pageNumbers.push(1);
    
    // Calculate start and end of middle section
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis if needed before middle section
    if (startPage > 2) {
      pageNumbers.push('...');
    } else if (startPage === 2) {
      pageNumbers.push(2);
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }
    
    // Add ellipsis if needed after middle section
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    } else if (endPage === totalPages - 1) {
      pageNumbers.push(totalPages - 1);
    }
    
    // Always include last page
    pageNumbers.push(totalPages);
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex items-center">
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="h-8 w-8 p-0 mx-0.5 md:mx-1"
            >
              {page}
            </Button>
          ) : (
            <span className="mx-0.5 px-1 text-muted-foreground">...</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4">
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader>
                <Skeleton className="aspect-video w-full rounded-md" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  {Array(3)
                    .fill(null)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-2">
                  {Array(3)
                    .fill(null)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-6 w-16 rounded-full" />
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full rounded-md" />
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}

// Error message component
function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Oops!
          </h3>
          <p className="mt-2 text-muted-foreground">{message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            No startups found
          </h3>
          <p className="mt-2 text-muted-foreground">
            We could not find any startups. Check back later!
          </p>
        </div>
      </div>
    </div>
  );
}