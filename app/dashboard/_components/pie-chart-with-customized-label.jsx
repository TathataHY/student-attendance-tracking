import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { generateWeekdays, getUniqueAttendances } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#FFBB28"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "5px",
          border: "1px solid #ccc",
        }}
      >
        <p>{payload[0].name}</p>
      </div>
    );
  }

  return null;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const PieChartWithCustomizedLabel = ({ attendances, month }) => {
  const now = new Date();

  const [presentPercentage, setPresentPercentage] = useState(0);

  useEffect(() => {
    const weekdays = generateWeekdays(month);

    const uniqueAttendances = getUniqueAttendances(attendances);

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

  const data = [
    { name: "Present", value: presentPercentage },
    { name: "Absent", value: 100 - presentPercentage },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="text-lg font-bold">Monthly Attendance</h3>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
