import { pgTable, text, serial, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Students table to store student information
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  birthDate: timestamp("birth_date"),
  registrationDate: timestamp("registration_date").notNull().defaultNow(),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  parentName: text("parent_name"),
  parentPhone: text("parent_phone"),
});

// Teachers table to store teacher information
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  specialization: text("specialization").notNull(),
  hireDate: timestamp("hire_date").notNull().defaultNow(),
  status: text("status").notNull().default("active"),
  bio: text("bio"),
});

// Courses table to store course information
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  instrument: text("instrument").notNull(),
  level: text("level").notNull(),
  price: numeric("price").notNull(),
  duration: integer("duration").notNull(), // in minutes
});

// Classes table to store class information
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  teacherId: integer("teacher_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  maxStudents: integer("max_students").notNull(),
  status: text("status").notNull().default("scheduled"),
});

// Enrollments table to store student enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  enrollmentDate: timestamp("enrollment_date").notNull().defaultNow(),
  status: text("status").notNull().default("active"),
});

// Attendance table to store attendance records
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull(),
  studentId: integer("student_id").notNull(),
  attendanceDate: timestamp("attendance_date").notNull(),
  status: text("status").notNull(), // present, absent, excused
  notes: text("notes"),
});

// Payments table to store payment information
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  amount: numeric("amount").notNull(),
  paymentDate: timestamp("payment_date").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
  method: text("method").notNull(),
  status: text("status").notNull().default("pending"),
  description: text("description"),
});

// Expenses table to store expense information
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  amount: numeric("amount").notNull(),
  expenseDate: timestamp("expense_date").notNull().defaultNow(),
  description: text("description"),
  payee: text("payee").notNull(),
});

// Communications table to store communication records
export const communications = pgTable("communications", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id"),
  type: text("type").notNull(), // email, sms, call
  subject: text("subject"),
  content: text("content").notNull(),
  sentDate: timestamp("sent_date").notNull().defaultNow(),
  status: text("status").notNull().default("sent"),
});

// Educational Materials table to store learning resources
export const educationalMaterials = pgTable("educational_materials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // chords, tutorial, sheet_music, etc.
  instrument: text("instrument"),
  level: text("level"), // beginner, intermediate, advanced
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  uploadedBy: integer("uploaded_by").notNull(), // reference to teacher/admin id
  uploadDate: timestamp("upload_date").notNull().defaultNow(),
  isPublic: boolean("is_public").notNull().default(true),
  downloads: integer("downloads").notNull().default(0),
});

// Admin Roles table for user permissions
export const adminRoles = pgTable("admin_roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  permissions: text("permissions").notNull(), // JSON string of permission objects
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true, registrationDate: true });
export const insertTeacherSchema = createInsertSchema(teachers).omit({ id: true, hireDate: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertClassSchema = createInsertSchema(classes).omit({ id: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, enrollmentDate: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, paymentDate: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true, expenseDate: true });
export const insertCommunicationSchema = createInsertSchema(communications).omit({ id: true, sentDate: true });
export const insertEducationalMaterialSchema = createInsertSchema(educationalMaterials).omit({ id: true, uploadDate: true, downloads: true });
export const insertAdminRoleSchema = createInsertSchema(adminRoles).omit({ id: true });

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type Communication = typeof communications.$inferSelect;
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;

export type EducationalMaterial = typeof educationalMaterials.$inferSelect;
export type InsertEducationalMaterial = z.infer<typeof insertEducationalMaterialSchema>;

export type AdminRole = typeof adminRoles.$inferSelect;
export type InsertAdminRole = z.infer<typeof insertAdminRoleSchema>;
