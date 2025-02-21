"use client"

import { useState, useEffect } from "react"
import { StartupCard } from "./startup-card"
import type { Startup } from "@/lib/types/startup"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function StartupsList() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/startups")

        if (!response.ok) {
          throw new Error("Failed to fetch startups")
        }

        const data = await response.json()
        setStartups(data)
      } catch (err) {
        console.error("Error fetching startups:", err)
        setError("Failed to load startups. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchStartups()
  }, [])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!startups?.length) {
    return <EmptyState />
  }

  return (
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
  )
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
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Oops!</h3>
        <p className="mt-2 text-muted-foreground">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No startups found</h3>
        <p className="mt-2 text-muted-foreground">We could not find any startups. Check back later!</p>
      </div>
    </div>
  )
}

