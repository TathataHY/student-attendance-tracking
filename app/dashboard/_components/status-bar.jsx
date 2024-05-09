import { generateWeekdays, getUniqueAttendances } from "@/lib/utils";
import { GraduationCap, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusCard } from "./status-card";

export const StatusBar = ({ attendances, month }) => {
  const now = new Date();

  const [totalStudents, setTotalStudents] = useState(0);
  const [presentPercentage, setPresentPercentage] = useState(0);

  useEffect(() => {
    const weekdays = generateWeekdays(month);

    const uniqueAttendances = getUniqueAttendances(attendances);
    setTotalStudents(uniqueAttendances.length);

    if (uniqueAttendances.length === 0) {
      setPresentPercentage(0);
    } else if (now.getMonth() + 1 < month) {
      setPresentPercentage(0);
    } else if (now.getMonth() + 1 === month) {
      const indexToday = weekdays.findIndex(
        ({ dayOfMonth }) => dayOfMonth >= now.getDate()
      );
      const daysUntilToday = weekdays.slice(0, indexToday + 1);
      setPresentPercentage(
        (attendances.filter((attendance) => attendance.present).length /
          (uniqueAttendances.length * daysUntilToday.length)) *
          100
      );
    } else {
      setPresentPercentage(
        (attendances.filter((attendance) => attendance.present).length /
          (uniqueAttendances.length * weekdays.length)) *
          100
      );
    }
  }, [attendances]);

  return (
    <div className="flex flex-wrap gap-2 my-4 lg:flex-nowrap">
      <StatusCard
        icon={<GraduationCap size={30} />}
        title="Total Students"
        value={totalStudents}
      />
      <StatusCard
        icon={<TrendingUp size={30} color="#00509d" />}
        title="Present Percentage"
        value={`${presentPercentage.toFixed(1)}%`}
      />
      <StatusCard
        icon={<TrendingDown size={30} color="#fdc500" />}
        title="Absent Percentage"
        value={
          totalStudents === 0 || now.getMonth() + 1 < month
            ? "0.0%"
            : `${100 - presentPercentage.toFixed(1)}%`
        }
      />
    </div>
  );
};
