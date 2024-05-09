import {
  boolean,
  date,
  int,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";

// declaring enum in database
export const grades = mysqlTable(
  "grades",
  {
    id: serial("id").primaryKey(),
    grade: varchar("grade", { length: 10 }).notNull(),
  }
  // (grades) => ({
  //   gradeIndex: uniqueIndex("grade_idx").on(grades.grade),
  // })
);

export const students = mysqlTable("students", {
  id: serial("id").primaryKey(),
  full_name: varchar("full_name", { length: 80 }).notNull(),
  grade: varchar("grade", { length: 10 }).notNull(),
  contact_number: varchar("contact_number", { length: 20 }),
  address: varchar("address", { length: 255 }),
  // grade_id: int("grade_id")
  //   .notNull()
  //   .references(() => grades.id),
});

export const attendance = mysqlTable("attendance", {
  id: serial("id").primaryKey(),
  student_id: int("student_id")
    .notNull()
    .references(() => students.id),
  date: date("date").notNull(),
  present: boolean("present").default(false),
});
