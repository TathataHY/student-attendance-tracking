import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { generateWeekdays, getUniqueAttendances } from "@/lib/utils";
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const BrushBarChart = ({ month, attendances }) => {
  const now = new Date();
  const year = now.getFullYear();

  const numDays = new Date(year, month, 0).getDate();
  const uniqueAttendances = getUniqueAttendances(attendances);
  const weekdays = generateWeekdays(month);

  const attendanceByDay = Array.from({ length: numDays }, (_, i) => {
    const isCurrentMonth = now.getMonth() + 1 === month;
    const isPastMonth = now.getMonth() + 1 > month;

    let absent = 0;
    if (isCurrentMonth || isPastMonth) {
      const indexToday = isCurrentMonth
        ? weekdays.findIndex(({ dayOfMonth }) => dayOfMonth >= now.getDate())
        : weekdays.length;
      const daysUntilToday = weekdays.slice(0, indexToday);
      absent = daysUntilToday.some((day) => day.dayOfMonth === i + 1)
        ? uniqueAttendances.length
        : 0;
    }

    return {
      dayOfMonth: i + 1,
      present: 0,
      absent,
    };
  });

  attendances.forEach((attendance) => {
    const dayOfMonth = Number(attendance?.date?.split("-")[2]);
    if (dayOfMonth >= 1 && dayOfMonth <= numDays) {
      if (attendance.present) {
        attendanceByDay[dayOfMonth - 1].present++;
        attendanceByDay[dayOfMonth - 1].absent--;
      }
    }
  });

  const data = attendanceByDay.map((day) => ({
    name: `${day.dayOfMonth}`,
    uv: day.absent,
    pv: day.present,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="text-lg font-bold">Attendances</h3>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              domain={[0, uniqueAttendances.length]}
              allowDecimals={false}
            />
            <Tooltip />
            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
            <ReferenceLine y={0} stroke="#000" />
            <Brush dataKey="name" height={30} stroke="#fdc500" />
            <Bar name="Present" dataKey="pv" fill="#00509d" />
            <Bar name="Absent" dataKey="uv" fill="#fdc500" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
