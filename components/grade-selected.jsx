"use client";

import globalApi from "@/app/_services/global-api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export const GradeSelected = ({ selectedGrade }) => {
  const [grades, setGrades] = useState([{}]);

  const fetchGrades = () =>
    globalApi.getGrades().then((res) => setGrades(res.data));

  useEffect(() => {
    fetchGrades();
  }, []);

  return (
    <Select onValueChange={selectedGrade}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a grade" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Grades</SelectLabel>
          {grades.map((g) => (
            <SelectItem key={g.id + g.grade} value={g.grade}>
              {g.grade}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
