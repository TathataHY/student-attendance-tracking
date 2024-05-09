import { db } from "@/utils/my-sql";
import { students } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await db
      .select()
      .from(students)
      .orderBy(students.full_name)
      .orderBy(students.grade);

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

export async function POST(request, response) {
  try {
    const { full_name, grade, contact_number, address } = await request.json();

    const result = await db
      .insert(students)
      .values({ full_name, grade, contact_number, address });

    return new NextResponse(JSON.stringify(result), {
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

export async function DELETE(request, response) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    const result = await db.delete(students).where(eq(students.id, id));

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
