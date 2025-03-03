import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/lib/db";


export async function GET(request: NextRequest) {
    try {
      // Get the authenticated user session
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      console.log("User ID from session:", session.user.id);
      
      // First find startups owned by this user
      const userStartups = await db.startup.findMany({
        where: {
            userId: session.user.id
        },
        select: {
          id: true
        }
      });
      
      console.log("Startups found:", userStartups);
      
      if (!userStartups || userStartups.length === 0) {
        return NextResponse.json({ 
          images: [], 
          debug: { 
            userId: session.user.id, 
            reason: "No startups found for this user" 
          } 
        });
      }
      
      // Get the startup IDs owned by the user
      const startupIds = userStartups.map(startup => startup.id);
      console.log("Startup IDs:", startupIds);
      const galleryImages = await db.gallery.findMany({
        where: {
          startupId: {
            in: startupIds
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log("Gallery images found:", galleryImages.length);
      
      return NextResponse.json({ 
        images: galleryImages,
        debug: {
          userId: session.user.id,
          startupIds: startupIds,
          totalImagesFound: galleryImages.length
        }
      });
      
    } catch (error) {
      console.error("Unexpected error:", error);
      return NextResponse.json({ error: "An unexpected error occurred", details: error }, { status: 500 });
    }
  }