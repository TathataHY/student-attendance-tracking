"use client";

import globalApi from "@/app/_services/global-api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { phoneRegex } from "@/utils/regex";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  full_name: z.string({ required_error: "Full name is required" }),
  grade: z.string({ required_error: "Grade is required" }),
  contact_number: z
    .string()
    .regex(phoneRegex, "Invalid contact number.")
    .optional(),
  address: z.string().optional(),
});

export const AddStudent = ({ fetchStudents }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [grades, setGrades] = useState([{}]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  const fetchGrades = () =>
    globalApi.getGrades().then((res) => setGrades(res.data));

  const onSubmit = (data) => {
    try {
      setLoading(true);
      globalApi.postStudent(data).then((res) => {
        if (res.data) {
          setOpen(false);
          toast({
            title: "New student added.",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  {JSON.stringify(data, null, 2)}
                </code>
              </pre>
            ),
          });
          form.reset();
          fetchStudents();
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">+ Add Student</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              Add a new student to the list.
            </DialogDescription>
          </DialogHeader>
          <StudentForm
            onSubmit={onSubmit}
            form={form}
            loading={loading}
            grades={grades}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">+ Add Student</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Student</DrawerTitle>
          <DrawerDescription>Add a new student to the list.</DrawerDescription>
        </DrawerHeader>
        <StudentForm
          onSubmit={onSubmit}
          form={form}
          loading={loading}
          grades={grades}
          className="px-4"
        />
        <DrawerFooter className="pt-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const StudentForm = ({ onSubmit, form, loading, grades, className }) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-4 py-4", className)}
      >
        {/* Full Name */}
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Pedro Duarte" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Grade */}
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Grades</SelectLabel>
                    {grades.map((g) => (
                      <SelectItem key={g.id} value={g.grade}>
                        {g.grade}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Contact Number */}
        <FormField
          control={form.control}
          name="contact_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1 123 456 7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main Street, Anytown, USA" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Save student"
          )}
        </Button>
      </form>
    </Form>
  );
};
