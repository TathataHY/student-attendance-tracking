"use client";

import globalApi from "@/app/_services/global-api";
import { GradeSelected } from "@/components/grade-selected";
import { MonthSelection } from "@/components/month-selection";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AttendanceTable } from "./_components/attendance-table";

export default function Attendances() {
  const [loading, setLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [attendances, setAttendances] = useState([]);

  const onSearchHandler = () => {
    try {
      if (!selectedGrade || !selectedMonth) {
        return;
      }
      setLoading(true);
      globalApi
        .getAttendance({ grade: selectedGrade, month: selectedMonth })
        .then((res) => {
          if (res.data.length > 0) {
            setAttendances(res.data);
          } else {
            setAttendances([]);
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onSearchHandler();
  }, [selectedMonth]);

  return (
    <>
      <main className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Attendances</h2>
        </div>

        <div className="my-4 flex gap-4 p-4 border rounded shadow-sm">
          <MonthSelection selectedMonth={setSelectedMonth} />
          <GradeSelected selectedGrade={setSelectedGrade} />
          <Button
            variant="outline"
            disabled={loading}
            onClick={onSearchHandler}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Please wait</span>
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                <span>Search</span>
              </>
            )}
          </Button>
        </div>

        <AttendanceTable attendances={attendances} month={selectedMonth} />
      </main>
    </>
  );
}
