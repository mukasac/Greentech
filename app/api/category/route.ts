import { db } from "@/lib/db"; 
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    if (request.method === "GET") {
        try {
            // Fetch categories from the database
            const categories = await db.category.findMany(); // Adjust this query based on your database schema

            // Return the categories in the response
            return NextResponse.json({ message: "Success", categories }, { status: 200 });
        } catch (error) {
            console.error("Error fetching categories:", error);
            return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    } else {
        // Handle unsupported methods
        return NextResponse.json({ message: `Method ${request.method} Not Allowed` }, { status: 405, headers: { "Allow": "GET" } });
    }
}