import { db } from "@/utils/my-sql";
import { attendance } from "@/utils/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;

  const grade = searchParams.get("grade");
  const month = searchParams.get("month");
  const year = new Date().getFullYear();

  try {
    const results = await db.execute(
      sql`SELECT
        students.id AS student_id,
        students.full_name,
        students.grade,
        attendance.id AS attendance_id,
        attendance.date,
        attendance.present
      FROM
        students
      LEFT JOIN
        attendance ON students.id = attendance.student_id
      AND
        (MONTH(attendance.date) = ${month} AND YEAR(attendance.date) = ${year})
      WHERE
        students.grade = ${grade}
      ORDER BY
        students.full_name;
      `
    );
    return new NextResponse(JSON.stringify(results[0]), {
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

export async function POST(request) {
  try {
    const { student_id, date } = await request.json();
    const result = await db
      .insert(attendance)
      .values({ student_id, date, present: true });
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

export async function DELETE(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const result = await db.delete(attendance).where(eq(attendance.id, id));
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
