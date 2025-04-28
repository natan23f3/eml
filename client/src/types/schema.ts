export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  birthDate?: Date;
  registrationDate: Date;
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
  parentName?: string;
  parentPhone?: string;
}

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  hireDate: Date;
  status: 'active' | 'inactive';
  bio?: string;
}

export interface Course {
  id: number;
  name: string;
  description?: string;
  instrument: string;
  level: string;
  price: number;
  duration: number; // in minutes
}

export interface Class {
  id: number;
  courseId: number;
  teacherId: number;
  startTime: Date;
  endTime: Date;
  location?: string;
  maxStudents: number;
  status: 'scheduled' | 'canceled' | 'completed';
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'completed';
}

export interface Attendance {
  id: number;
  classId: number;
  studentId: number;
  attendanceDate: Date;
  status: 'present' | 'absent' | 'excused';
  notes?: string;
}

export interface Payment {
  id: number;
  studentId: number;
  amount: number;
  paymentDate: Date;
  dueDate?: Date;
  method: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'other';
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  description?: string;
}

export interface Expense {
  id: number;
  category: string;
  amount: number;
  expenseDate: Date;
  description?: string;
  payee: string;
}

export interface Communication {
  id: number;
  studentId?: number;
  type: 'email' | 'sms' | 'call';
  subject?: string;
  content: string;
  sentDate: Date;
  status: 'sent' | 'failed' | 'pending';
}

export interface DashboardStats {
  studentCount: number;
  monthlyRevenue: number;
  classCount: number;
  conversionRate: number;
}

export interface RecentActivity {
  id: number;
  type: 'enrollment' | 'payment' | 'class' | 'communication';
  message: string;
  time: Date;
  iconType?: string;
}

export interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  student: string;
  colorType: 'primary' | 'green' | 'purple' | 'yellow' | 'red';
}

export interface RecentStudent {
  id: number;
  name: string;
  email: string;
  course: string;
  teacher: string;
  status: 'active' | 'inactive' | 'pending';
  date: Date;
  avatarInitials: string;
  avatarColor: string;
}
