import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

interface EventMetadata {
  timestamp: string;
  userAgent: string;
  source?: string;
  [key: string]: any;
}

export const AnalyticsService = {
  async trackProfileView(startupId: string, metadata: Partial<EventMetadata> = {}) {
    try {
      await db.analyticsEvent.create({
        data: {
          type: "profile_view",
          startupId,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
            userAgent: metadata.userAgent || "Unknown"
          }
        }
      });
    } catch (error) {
      console.error("Error tracking profile view:", error);
    }
  },

  async getProfileViews(startupId: string, dateRange?: { start: Date; end: Date }) {
    try {
      const where: Prisma.AnalyticsEventWhereInput = {
        startupId,
        type: "profile_view",
        ...(dateRange && {
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end
          }
        })
      };

      const views = await db.analyticsEvent.findMany({
        where,
        orderBy: {
          createdAt: "asc"
        }
      });

      // Group views by date
      const viewsByDate = views.reduce((acc, view) => {
        const date = view.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: views.length,
        viewsByDate: Object.entries(viewsByDate).map(([date, count]) => ({
          date,
          count
        }))
      };
    } catch (error) {
      console.error("Error getting profile views:", error);
      return {
        total: 0,
        viewsByDate: []
      };
    }
  },

  async getStartupAnalytics(startupId: string) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [views, applications] = await Promise.all([
        db.analyticsEvent.count({
          where: {
            startupId,
            type: "profile_view",
            createdAt: {
              gte: thirtyDaysAgo
            }
          }
        }),
        db.jobApplication.count({
          where: {
            job: {
              startupId
            },
            appliedAt: {
              gte: thirtyDaysAgo
            }
          }
        })
      ]);

      const viewsData = await this.getProfileViews(startupId, {
        start: thirtyDaysAgo,
        end: new Date()
      });

      // Calculate traffic sources using metadata
      const events = await db.analyticsEvent.findMany({
        where: {
          startupId,
          type: "profile_view",
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        select: {
          metadata: true
        }
      });

      // Process traffic sources from metadata
      const trafficSourcesMap = events.reduce((acc, event) => {
        const metadata = event.metadata as EventMetadata;
        const source = metadata?.source || 'Direct';
        acc.set(source, (acc.get(source) || 0) + 1);
        return acc;
      }, new Map<string, number>());

      const trafficSources = Array.from(trafficSourcesMap.entries()).map(([name, value]) => ({
        name,
        value
      }));

      return {
        profileViews: views,
        jobApplications: applications,
        totalInteractions: views + applications,
        viewsByDate: viewsData.viewsByDate,
        trafficSources
      };
    } catch (error) {
      console.error("Error getting startup analytics:", error);
      return null;
    }
  }
};