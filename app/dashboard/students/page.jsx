"use client";

import globalApi from "@/app/_services/global-api";
import { useEffect, useState } from "react";
import { AddStudent } from "./_components/add-student";
import { StudentCard } from "./_components/student-card";
import { StudentTable } from "./_components/student-table";

export default function Students() {
  const [students, setStudents] = useState([]);

  const fetchStudents = () =>
    globalApi.getStudents().then((res) => setStudents(res.data));

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <main className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Students</h2>
          <AddStudent fetchStudents={fetchStudents} />
        </div>

        <StudentCard length={students.length} />
        <StudentTable students={students} fetchStudents={fetchStudents} />
      </main>
    </>
  );
}
