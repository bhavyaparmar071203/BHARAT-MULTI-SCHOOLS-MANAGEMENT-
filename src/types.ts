export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'principal'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'accountant';

export interface School {
  id: string;
  name: string;
  logo?: string;
  principalName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  schoolCode: string;
  academicSession: string;
  status: 'active' | 'pending' | 'inactive';
  studentCount?: number;
  teacherCount?: number;
  establishedYear: number;
  affiliationNo: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: UserRole;
  schoolId?: string; // Optional for super_admin
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  linkedStudentIds?: string[]; // For parents with 1 or multiple children
  linkedStudentId?: string;    // For student accounts
  linkedTeacherId?: string;    // For teacher accounts
}

export interface Student {
  id: string;
  schoolId: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  classId: string;
  sectionId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  admissionDate: string;
  previousSchool?: string;
  photo?: string;
  avatar?: string;
  emergencyContact?: string;
  status: 'active' | 'inactive';
  bloodGroup?: string;
  transportRouteId?: string;
  parentId?: string;
}

export interface Teacher {
  id: string;
  schoolId: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  subjectIds: string[];
  classIds: string[];
  sectionIds: string[];
  joiningDate: string;
  address: string;
  qualification: string;
  photo?: string;
  avatar?: string;
  salaryTier?: string;
  status: 'active' | 'inactive';
  leavesTaken: number;
  designation?: string;
}

export interface SchoolClass {
  id: string;
  schoolId: string;
  name: string; // e.g. "Class 10"
  gradeLevel: number;
  sectionIds: string[];
}

export interface Section {
  id: string;
  schoolId: string;
  classId: string;
  name: string; // e.g. "A", "B"
  classTeacherId?: string;
  roomNo: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  classId: string;
  teacherId?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day';

export interface AttendanceEntry {
  studentId: string;
  status: AttendanceStatus;
  remark?: string;
}

export interface DailyAttendance {
  id: string;
  schoolId: string;
  date: string; // YYYY-MM-DD
  classId: string;
  sectionId: string;
  records: AttendanceEntry[];
  takenBy: string;
  createdAt: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableSlot {
  id: string;
  schoolId: string;
  classId: string;
  sectionId: string;
  day: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  roomNo: string;
}

export type HomeworkStatus = 'pending' | 'completed' | 'overdue';

export interface StudentHomeworkSubmission {
  studentId: string;
  status: HomeworkStatus;
  submissionDate?: string;
  notes?: string;
}

export interface Homework {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  teacherId: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  attachmentName?: string;
  submissions: StudentHomeworkSubmission[];
}

export interface Exam {
  id: string;
  schoolId: string;
  title: string;
  examType: 'Unit Test' | 'Mid-Term' | 'Final Exam' | 'Quarterly';
  academicSession: string;
  startDate: string;
  endDate: string;
  classIds: string[];
  status: 'draft' | 'ongoing' | 'completed' | 'published';
}

export interface ExamScheduleItem {
  id: string;
  schoolId: string;
  examId: string;
  classId: string;
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passMarks: number;
  roomNo?: string;
}

export interface SubjectMark {
  subjectId: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  passMarks: number;
}

export interface StudentExamResult {
  id: string;
  schoolId: string;
  examId: string;
  studentId: string;
  classId: string;
  sectionId: string;
  marks: SubjectMark[];
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  grade: string;
  status: 'Pass' | 'Fail';
  rank?: number;
  remarks?: string;
  isPublished: boolean;
  publishedDate?: string;
}

export interface FeeStructure {
  id: string;
  schoolId: string;
  title: string;
  classId: string;
  amount: number;
  dueDate: string;
  feeType: 'Tuition Fee' | 'Transport Fee' | 'Lab Fee' | 'Annual Fee' | 'Exam Fee';
  frequency: 'Monthly' | 'Quarterly' | 'Annual' | 'One-Time';
}

export interface StudentFeeRecord {
  id: string;
  schoolId: string;
  studentId: string;
  feeStructureId: string;
  title: string;
  amount: number;
  discount: number;
  lateFee: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'partial' | 'overdue';
  dueDate: string;
  lastPaymentDate?: string;
  receiptNumber?: string;
}

export interface FeePayment {
  id: string;
  schoolId: string;
  studentId: string;
  studentFeeId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque' | 'UPI/Manual DD';
  receiptNo: string;
  receivedBy: string;
  notes?: string;
}

export type NoticeAudience = 'everyone' | 'teachers' | 'students' | 'parents' | 'class_specific';

export interface SchoolNotice {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  targetAudience: NoticeAudience;
  targetClassId?: string;
  targetSectionId?: string;
  date: string;
  authorName: string;
  isPublished: boolean;
  isPinned?: boolean;
  attachmentName?: string;
}

export type NotificationCategory =
  | 'academic'
  | 'attendance'
  | 'homework'
  | 'examination'
  | 'result'
  | 'fees'
  | 'notice'
  | 'system'
  | 'account';

export interface AppNotification {
  id: string;
  schoolId?: string;
  userId?: string;
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface SchoolDocument {
  id: string;
  schoolId: string;
  title: string;
  category: 'student' | 'school' | 'circular' | 'certificate';
  studentId?: string;
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  fileType: string;
  url?: string;
}

export interface LibraryBook {
  id: string;
  schoolId: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  rackNumber: string;
}

export interface LibraryIssue {
  id: string;
  schoolId: string;
  bookId: string;
  bookTitle: string;
  borrowerId: string;
  borrowerName: string;
  borrowerRole: 'student' | 'teacher';
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  fineAmount: number;
}

export interface Vehicle {
  id: string;
  schoolId: string;
  vehicleNumber: string;
  vehicleModel: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  status: 'active' | 'maintenance';
}

export interface TransportRoute {
  id: string;
  schoolId: string;
  routeName: string;
  vehicleId: string;
  startPoint: string;
  endPoint: string;
  stops: { name: string; pickupTime: string; dropTime: string }[];
  assignedStudentIds: string[];
}

export interface AuditLog {
  id: string;
  schoolId?: string;
  schoolName?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SchoolSettings {
  schoolId: string;
  name: string;
  logo?: string;
  principalName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  schoolCode: string;
  academicSession: string;
  workingDays: string[];
  schoolStartTime: string;
  schoolEndTime: string;
  currencySymbol: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

// Aliases for unified module compatibility
export type StudentFee = StudentFeeRecord;
export type Book = LibraryBook;
export type BookIssue = LibraryIssue;
export type Notice = SchoolNotice;
export type ExamResult = StudentExamResult;
export type TimetableEntry = TimetableSlot;
export type TransportVehicle = Vehicle;

