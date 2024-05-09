"use client";

import { GradeSelected } from "@/components/grade-selected";
import { MonthSelection } from "@/components/month-selection";
import { useEffect, useState } from "react";
import globalApi from "../_services/global-api";
import { BrushBarChart } from "./_components/brush-bar-chart";
import { PieChartWithCustomizedLabel } from "./_components/pie-chart-with-customized-label";
import { StatusBar } from "./_components/status-bar";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [attendances, setAttendances] = useState([]);

  const fetchAttendances = () => {
    if (!selectedMonth || !selectedGrade) return;
    globalApi
      .getAttendance({ month: selectedMonth, grade: selectedGrade })
      .then((res) => {
        setAttendances(res.data);
      });
  };

  useEffect(() => {
    fetchAttendances();
  }, [selectedMonth, selectedGrade]);

  return (
    <>
      <main className="p-4">
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-2xl font-bold">Dashboard</h2>

          <div className="flex gap-x-4">
            <MonthSelection selectedMonth={setSelectedMonth} />
            <GradeSelected selectedGrade={setSelectedGrade} />
          </div>
        </div>

        <StatusBar attendances={attendances} month={selectedMonth} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[500px] py-4">
          <div className="lg:col-span-2">
            <BrushBarChart month={selectedMonth} attendances={attendances} />
          </div>
          <div className="lg:col-span-1">
            <PieChartWithCustomizedLabel
              attendances={attendances}
              month={selectedMonth}
            />
          </div>
        </div>
      </main>
    </>
  );
}
