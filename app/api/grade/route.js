import { db } from "@/utils/my-sql";
import { grades } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await db.select().from(grades);

    return new NextResponse(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
