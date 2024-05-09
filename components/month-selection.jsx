"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function MonthSelection({ selectedMonth }) {
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    selectedMonth(month.getMonth() + 1);
  }, [month]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !month && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {month ? format(month, "MMMM yyyy") : <span>Pick a month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          showOutsideDays={false}
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
