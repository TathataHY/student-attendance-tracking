import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function addOrdinalSuffix(day) {
  if (day === 1 || day === 21 || day === 31) {
    return day + "st";
  } else if (day === 2 || day === 22) {
    return day + "nd";
  } else if (day === 3 || day === 23) {
    return day + "rd";
  } else {
    return day + "th";
  }
}

export function generateWeekdays(month) {
  const year = new Date().getFullYear(); // Obtener el año actual
  const numDays = new Date(year, month, 0).getDate();
  const weekdays = [];
  for (let i = 1; i <= numDays; i++) {
    const currentDate = new Date(year, month - 1, i); // mes se indexa desde 0
    const dayOfWeek = currentDate.getDay(); // 0 (domingo) a 6 (sábado)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Descartar sábados y domingos
      const dayName = currentDate.toLocaleString("en", { weekday: "long" });
      weekdays.push({
        dayOfMonth: i,
        dayOfWeek: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      });
    }
  }
  return weekdays;
}

export function getUniqueAttendances(attendances) {
  return Array.from(
    new Set(attendances.map((attendance) => attendance.student_id))
  ).map((student_id) =>
    attendances.find((attendance) => attendance.student_id === student_id)
  );
}
