import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertTeacherSchema, insertCourseSchema, insertClassSchema, 
  insertEnrollmentSchema, insertPaymentSchema, insertExpenseSchema, insertCommunicationSchema } from "@shared/schema";
import { 
  sendClassReminder, 
  sendPaymentReminder, 
  scheduleAutomaticReminders, 
  getMessageTemplates, 
  saveMessageTemplate 
} from "./api/studentInteractions";

export async function registerRoutes(app: Express): Promise<Server> {
  // Students API routes
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to get students", error: (error as Error).message });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(parseInt(req.params.id));
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Failed to get student", error: (error as Error).message });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(validatedData);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: "Invalid student data", error: (error as Error).message });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const updated = await storage.updateStudent(parseInt(req.params.id), validatedData);
      if (!updated) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Invalid student data", error: (error as Error).message });
    }
  });

  // Teachers API routes
  app.get("/api/teachers", async (req, res) => {
    try {
      const teachers = await storage.getAllTeachers();
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get teachers", error: (error as Error).message });
    }
  });

  app.post("/api/teachers", async (req, res) => {
    try {
      const validatedData = insertTeacherSchema.parse(req.body);
      const teacher = await storage.createTeacher(validatedData);
      res.status(201).json(teacher);
    } catch (error) {
      res.status(400).json({ message: "Invalid teacher data", error: (error as Error).message });
    }
  });

  // Courses API routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get courses", error: (error as Error).message });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: "Invalid course data", error: (error as Error).message });
    }
  });

  // Classes API routes
  app.get("/api/classes", async (req, res) => {
    try {
      const classes = await storage.getAllClasses();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get classes", error: (error as Error).message });
    }
  });

  app.post("/api/classes", async (req, res) => {
    try {
      const validatedData = insertClassSchema.parse(req.body);
      const classObj = await storage.createClass(validatedData);
      res.status(201).json(classObj);
    } catch (error) {
      res.status(400).json({ message: "Invalid class data", error: (error as Error).message });
    }
  });

  // Enrollments API routes
  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getAllEnrollments();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get enrollments", error: (error as Error).message });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const validatedData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(validatedData);
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Invalid enrollment data", error: (error as Error).message });
    }
  });

  // Payments API routes
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get payments", error: (error as Error).message });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data", error: (error as Error).message });
    }
  });

  // Expenses API routes
  app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await storage.getAllExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get expenses", error: (error as Error).message });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ message: "Invalid expense data", error: (error as Error).message });
    }
  });

  // Communications API routes
  app.get("/api/communications", async (req, res) => {
    try {
      const communications = await storage.getAllCommunications();
      res.json(communications);
    } catch (error) {
      res.status(500).json({ message: "Failed to get communications", error: (error as Error).message });
    }
  });

  app.post("/api/communications", async (req, res) => {
    try {
      const validatedData = insertCommunicationSchema.parse(req.body);
      const communication = await storage.createCommunication(validatedData);
      res.status(201).json(communication);
    } catch (error) {
      res.status(400).json({ message: "Invalid communication data", error: (error as Error).message });
    }
  });

  // Dashboard API route for stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const studentCount = await storage.getStudentCount();
      const monthlyRevenue = await storage.getMonthlyRevenue();
      const classCount = await storage.getClassCount();
      const conversionRate = await storage.getConversionRate();
      
      res.json({
        studentCount,
        monthlyRevenue,
        classCount,
        conversionRate
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get dashboard stats", error: (error as Error).message });
    }
  });

  // Dashboard API route for recent students
  app.get("/api/dashboard/recent-students", async (req, res) => {
    try {
      const recentStudents = await storage.getRecentStudents();
      res.json(recentStudents);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent students", error: (error as Error).message });
    }
  });

  // Dashboard API route for activities
  app.get("/api/dashboard/activities", async (req, res) => {
    try {
      const activities = await storage.getRecentActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get activities", error: (error as Error).message });
    }
  });

  // Dashboard API route for schedule
  app.get("/api/dashboard/schedule", async (req, res) => {
    try {
      const schedule = await storage.getDailySchedule();
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to get schedule", error: (error as Error).message });
    }
  });

  // Student Interactions API Routes
  
  // Class reminders
  app.post("/api/student-interactions/class-reminder", sendClassReminder);
  
  // Payment reminders
  app.post("/api/student-interactions/payment-reminder", sendPaymentReminder);
  
  // Automatic reminders config
  app.post("/api/student-interactions/auto-reminders", scheduleAutomaticReminders);
  
  // Message templates
  app.get("/api/student-interactions/message-templates", getMessageTemplates);
  app.post("/api/student-interactions/message-templates", saveMessageTemplate);

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
