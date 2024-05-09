import globalApi from "@/app/_services/global-api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import {
  addOrdinalSuffix,
  generateWeekdays,
  getUniqueAttendances,
} from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";

export const AttendanceTable = ({ attendances, month }) => {
  const [uniqueAttendances, setUniqueAttendances] = useState([]);
  const [studentAttendances, setStudentAttendances] = useState({});

  const year = new Date().getFullYear();
  const weekdays = generateWeekdays(month);

  useEffect(() => {
    // Generar un conjunto único de registros basados en student_id
    const uniqueAttendances = getUniqueAttendances(attendances);
    setUniqueAttendances(uniqueAttendances);
  }, [attendances]);

  useEffect(() => {
    if (attendances.length > 0) {
      // Generar un objeto con las asistencias de cada estudiante
      const studentAttendanceObj = {};
      attendances.forEach((attendance) => {
        const { student_id } = attendance;
        if (!studentAttendanceObj[student_id]) {
          studentAttendanceObj[student_id] = [attendance];
        } else {
          studentAttendanceObj[student_id].push(attendance);
        }
      });
      setStudentAttendances(studentAttendanceObj);
    }
  }, [attendances]);

  const columns = [
    {
      accessorKey: "full_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="mr-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Full name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize mr-8">{row.getValue("full_name")}</div>
      ),
    },
    ...weekdays.map(({ dayOfMonth, dayOfWeek }) => ({
      accessorKey: `attendance_${dayOfMonth}`, // Key única para cada día de asistencia
      header: () => {
        const isFriday = dayOfWeek === "Friday";

        return (
          <div className={`text-center ${isFriday ? "mr-8" : ""}`}>
            {addOrdinalSuffix(dayOfMonth)} {dayOfWeek}
          </div>
        );
      },
      cell: ({ row }) => {
        const [loading, setLoading] = useState(false);

        const { student_id, full_name } = row.original;
        const studentAttendanceObj = studentAttendances[student_id];

        // Convertir el año, mes y día a cadenas
        const yearString = year.toString();
        const monthString = month.toString().padStart(2, "0"); // Asegura que el mes tenga 2 dígitos
        const dayOfMonthString = dayOfMonth.toString().padStart(2, "0"); // Asegura que el día tenga 2 dígitos

        // Concatenar las cadenas en el formato 'YYYY-MM-DD'
        const day = `${yearString}-${monthString}-${dayOfMonthString}`;

        // Filtrar la asistencia correspondiente al día actual
        const attendanceForDay = studentAttendanceObj.find(
          (attendance) => attendance?.date === day
        );

        // Verificar si la asistencia para este día existe
        const isPresent = attendanceForDay !== undefined;

        const [id, setId] = useState(
          isPresent ? attendanceForDay.attendance_id : 0
        );

        // Usar el estado local para manejar la selección del checkbox
        const [selected, setSelected] = useState(isPresent);
        const [firstRender, setFirstRender] = useState(true);

        useEffect(() => {
          // Verificar si es la primera renderización
          if (!firstRender) {
            setLoading(true);
            if (id === 0) {
              globalApi
                .postAttendance({
                  student_id,
                  date: `${year}-${month}-${dayOfMonth}`,
                })
                .then((res) => {
                  if (res.data) {
                    setId(res.data[0]?.insertId);
                    toast({
                      title: `${full_name} marked as present`,
                      description: `Date: ${day}`,
                      variant: "success",
                    });
                  }
                })
                .finally(() => setLoading(false));
            } else {
              globalApi
                .deleteAttendance(id)
                .then(
                  toast({
                    title: `${full_name} marked as absent`,
                    description: `Date: ${day}`,
                    variant: "success",
                  })
                )
                .finally(() => setLoading(false));
            }
          } else {
            // Si es la primera renderización, marcarla como false para las siguientes renderizaciones
            setFirstRender(false);
          }
        }, [selected]);

        const isFriday = dayOfWeek === "Friday";
        return (
          <div
            className={`flex justify-center items-center ${
              isFriday ? "mr-8" : ""
            }`}
          >
            <Checkbox
              disabled={loading}
              checked={selected}
              onCheckedChange={(value) => setSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        );
      },
    })),
  ];

  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: uniqueAttendances,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  // Mostrar los días hábiles y sus nombres en el retorno del componente
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by full name..."
          value={table.getColumn("full_name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("full_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
