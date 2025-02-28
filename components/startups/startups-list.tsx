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
      params.append("limit", pagination.limit.toString());
      if (category) params.append("category", category);
      if (region) params.append("region", region);

      const response = await fetch(`/api/startups?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch startups");
      }

      const data: ApiResponse = await response.json();
      setStartups(data.startups);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching startups:", err);
      setError("Failed to load startups. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const fetchStartups = async () => {
    //   try {
    //     setLoading(true)
    //     const response = await fetch("/api/startups")

    //     if (!response.ok) {
    //       throw new Error("Failed to fetch startups")
    //     }

    //     const data = await response.json()
    //     setStartups(data)
    //   } catch (err) {
    //     console.error("Error fetching startups:", err)
    //     setError("Failed to load startups. Please try again later.")
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    fetchStartups(pagination.current);
  }, [category, region]);

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
    <div>
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
          >
            <StartupCard startup={startup} />
          </motion.div>
        ))}
      </motion.div>

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first page, last page, current page, and pages around current
                return (
                  page === 1 ||
                  page === pagination.pages ||
                  Math.abs(page - pagination.current) <= 1
                );
              })
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2">...</span>
                  )}
                  <button
                    variant={
                      pagination.current === page ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
          </div>
          <button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.pages}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
      {/* Pagination Summary */}
      <div className="text-center text-sm text-muted-foreground mt-2">
        Showing {(pagination.current - 1) * pagination.limit + 1}-
        {Math.min(pagination.current * pagination.limit, pagination.total)} of{" "}
        {pagination.total} startups
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
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
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
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
  );
}

function EmptyState() {
  return (
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
  );
}
