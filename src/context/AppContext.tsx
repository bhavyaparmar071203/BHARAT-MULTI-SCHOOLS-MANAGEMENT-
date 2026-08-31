import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  School,
  Student,
  Teacher,
  SchoolClass,
  Section,
  Subject,
  DailyAttendance,
  TimetableSlot,
  Homework,
  Exam,
  ExamScheduleItem,
  StudentExamResult,
  FeeStructure,
  StudentFeeRecord,
  FeePayment,
  SchoolNotice,
  AppNotification,
  SchoolDocument,
  LibraryBook,
  LibraryIssue,
  Vehicle,
  TransportRoute,
  AuditLog,
  SchoolSettings,
  ToastMessage,
  UserRole,
} from '../types';
import {
  INITIAL_SCHOOLS,
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_SECTIONS,
  INITIAL_SUBJECTS,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_TIMETABLE,
  INITIAL_HOMEWORK,
  INITIAL_EXAMS,
  INITIAL_EXAM_SCHEDULES,
  INITIAL_EXAM_RESULTS,
  INITIAL_FEE_STRUCTURES,
  INITIAL_STUDENT_FEES,
  INITIAL_PAYMENTS,
  INITIAL_NOTICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_BOOKS,
  INITIAL_LIBRARY_ISSUES,
  INITIAL_VEHICLES,
  INITIAL_ROUTES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
} from '../data/initialData';

interface AppContextType {
  // Authentication & Tenancy
  currentUser: User | null;
  currentSchool: School | null;
  activeSchoolId: string | null;
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  setActiveSchoolId: (id: string | null) => void;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  loginAs: (userId: string) => void;
  loginWithCredentials: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  registerUser: (data: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: UserRole;
    schoolId?: string;
    classId?: string;
    sectionId?: string;
    rollNo?: string;
    admissionNo?: string;
    designation?: string;
    department?: string;
    studentAdmissionNo?: string;
  }) => { success: boolean; message?: string };
  registerSchool: (data: Partial<School> & { adminName: string; adminEmail: string; adminPhone: string; adminPassword?: string }) => { success: boolean; message?: string };

  // Theme & Preferences
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Active School Data
  schools: School[];
  users: User[];
  classes: SchoolClass[];
  sections: Section[];
  subjects: Subject[];
  teachers: Teacher[];
  students: Student[];
  attendance: DailyAttendance[];
  timetables: TimetableSlot[];
  homework: Homework[];
  exams: Exam[];
  examSchedules: ExamScheduleItem[];
  examResults: StudentExamResult[];
  feeStructures: FeeStructure[];
  studentFees: StudentFeeRecord[];
  feePayments: FeePayment[];
  notices: SchoolNotice[];
  notifications: AppNotification[];
  documents: SchoolDocument[];
  books: LibraryBook[];
  libraryIssues: LibraryIssue[];
  vehicles: Vehicle[];
  routes: TransportRoute[];
  auditLogs: AuditLog[];
  settings: Record<string, SchoolSettings>;

  // Scoped Data (Strict Tenant Isolation)
  scopedStudents: Student[];
  scopedTeachers: Teacher[];
  scopedClasses: SchoolClass[];
  scopedSections: Section[];
  scopedSubjects: Subject[];
  scopedAttendance: DailyAttendance[];
  scopedTimetable: TimetableSlot[];
  scopedHomework: Homework[];
  scopedExams: Exam[];
  scopedExamSchedules: ExamScheduleItem[];
  scopedExamResults: StudentExamResult[];
  scopedFeeStructures: FeeStructure[];
  scopedStudentFees: StudentFeeRecord[];
  scopedFeePayments: FeePayment[];
  scopedNotices: SchoolNotice[];
  scopedNotifications: AppNotification[];
  scopedDocuments: SchoolDocument[];
  scopedBooks: LibraryBook[];
  scopedLibraryIssues: LibraryIssue[];
  scopedVehicles: Vehicle[];
  scopedRoutes: TransportRoute[];
  scopedAuditLogs: AuditLog[];
  currentSchoolSettings: SchoolSettings | null;

  // CRUD Functions
  addSchool: (school: Omit<School, 'id' | 'createdAt'>) => void;
  updateSchool: (id: string, updates: Partial<School>) => void;
  approveSchool: (id: string) => void;
  toggleSchoolStatus: (id: string) => void;

  addStudent: (student: Omit<Student, 'id' | 'schoolId'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addTeacher: (teacher: Omit<Teacher, 'id' | 'schoolId' | 'leavesTaken'>) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  addClass: (name: string, gradeLevel: number) => void;
  addSection: (classId: string, name: string, roomNo: string, classTeacherId?: string) => void;
  addSubject: (name: string, code: string, classId: string, teacherId?: string) => void;

  saveAttendance: (classId: string, sectionId: string, date: string, records: { studentId: string; status: any; remark?: string }[]) => void;

  addHomework: (hw: Omit<Homework, 'id' | 'schoolId' | 'submissions'>) => void;
  updateHomeworkSubmission: (homeworkId: string, studentId: string, status: any, notes?: string) => void;

  addExam: (exam: Omit<Exam, 'id' | 'schoolId'>) => void;
  addExamSchedule: (schedule: Omit<ExamScheduleItem, 'id' | 'schoolId'>) => void;
  saveStudentExamResult: (result: Omit<StudentExamResult, 'id' | 'schoolId'>) => void;
  saveExamResult: (result: any) => void;
  publishExamResults: (examId: string) => void;

  addFeeStructure: (fee: Omit<FeeStructure, 'id' | 'schoolId'>) => void;
  recordFeePayment: (payment: { studentId: string; studentFeeId: string; amount: number; paymentMethod: any; notes?: string }) => void;
  addFeePayment: (studentFeeId: string, amount: number, paymentMethod: any, notes?: string) => void;

  addNotice: (notice: Omit<SchoolNotice, 'id' | 'schoolId' | 'date' | 'authorName'>) => void;
  toggleNoticePin: (noticeId: string) => void;
  deleteNotice: (noticeId: string) => void;

  addDocument: (doc: Omit<SchoolDocument, 'id' | 'schoolId' | 'uploadDate' | 'uploadedBy'>) => void;
  deleteDocument: (docId: string) => void;

  addBook: (book: Omit<LibraryBook, 'id' | 'schoolId'>) => void;
  issueBook: (bookId: string, borrowerId: string, borrowerName: string, borrowerRole: 'student' | 'teacher', days: number) => void;
  returnBook: (issueId: string) => void;

  addVehicle: (veh: Omit<Vehicle, 'id' | 'schoolId'>) => void;
  addRoute: (route: Omit<TransportRoute, 'id' | 'schoolId'>) => void;

  updateSettings: (updates: Partial<SchoolSettings>) => void;

  // Notifications & Toast
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', title?: string) => void;
  removeToast: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'bharat_school_erp_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to load or initialize from localStorage
  const loadState = <T,>(key: string, defaultVal: T): T => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [schools, setSchools] = useState<School[]>(() => loadState('schools', INITIAL_SCHOOLS));
  const [users, setUsers] = useState<User[]>(() => loadState('users', INITIAL_USERS));
  const [classes, setClasses] = useState<SchoolClass[]>(() => loadState('classes', INITIAL_CLASSES));
  const [sections, setSections] = useState<Section[]>(() => loadState('sections', INITIAL_SECTIONS));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadState('subjects', INITIAL_SUBJECTS));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadState('teachers', INITIAL_TEACHERS));
  const [students, setStudents] = useState<Student[]>(() => loadState('students', INITIAL_STUDENTS));
  const [attendance, setAttendance] = useState<DailyAttendance[]>(() => loadState('attendance', INITIAL_ATTENDANCE));
  const [timetables, setTimetables] = useState<TimetableSlot[]>(() => loadState('timetables', INITIAL_TIMETABLE));
  const [homework, setHomework] = useState<Homework[]>(() => loadState('homework', INITIAL_HOMEWORK));
  const [exams, setExams] = useState<Exam[]>(() => loadState('exams', INITIAL_EXAMS));
  const [examSchedules, setExamSchedules] = useState<ExamScheduleItem[]>(() => loadState('examSchedules', INITIAL_EXAM_SCHEDULES));
  const [examResults, setExamResults] = useState<StudentExamResult[]>(() => loadState('examResults', INITIAL_EXAM_RESULTS));
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(() => loadState('feeStructures', INITIAL_FEE_STRUCTURES));
  const [studentFees, setStudentFees] = useState<StudentFeeRecord[]>(() => loadState('studentFees', INITIAL_STUDENT_FEES));
  const [feePayments, setFeePayments] = useState<FeePayment[]>(() => loadState('feePayments', INITIAL_PAYMENTS));
  const [notices, setNotices] = useState<SchoolNotice[]>(() => loadState('notices', INITIAL_NOTICES));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadState('notifications', INITIAL_NOTIFICATIONS));
  const [documents, setDocuments] = useState<SchoolDocument[]>(() => loadState('documents', INITIAL_DOCUMENTS));
  const [books, setBooks] = useState<LibraryBook[]>(() => loadState('books', INITIAL_BOOKS));
  const [libraryIssues, setLibraryIssues] = useState<LibraryIssue[]>(() => loadState('libraryIssues', INITIAL_LIBRARY_ISSUES));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => loadState('vehicles', INITIAL_VEHICLES));
  const [routes, setRoutes] = useState<TransportRoute[]>(() => loadState('routes', INITIAL_ROUTES));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadState('auditLogs', INITIAL_AUDIT_LOGS));
  const [settings, setSettings] = useState<Record<string, SchoolSettings>>(() => loadState('settings', INITIAL_SETTINGS));

  // Current session
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_PREFIX + 'currentUserId') || 'usr_sps_admin'; // Default to School Admin
  });
  const [activeSchoolIdOverride, setActiveSchoolIdOverride] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_PREFIX + 'darkMode') === 'true';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync dark mode class with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'currentUserId', currentUserId || '');
  }, [currentUserId]);

  const saveToStorage = (key: string, val: any) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(val));
    } catch (e) {
      console.error('Storage save error', e);
    }
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', title?: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return users.find((u) => u.id === currentUserId) || null;
  }, [currentUserId, users]);

  // Determine active school ID
  const effectiveSchoolId = useMemo(() => {
    if (currentUser?.role === 'super_admin') {
      return activeSchoolIdOverride || null;
    }
    return currentUser?.schoolId || null;
  }, [currentUser, activeSchoolIdOverride]);

  const currentSchool = useMemo(() => {
    if (!effectiveSchoolId) {
      // If super admin and no override, or not logged in, default to first school if needed or null
      if (currentUser?.role === 'super_admin' && activeSchoolIdOverride) {
        return schools.find((s) => s.id === activeSchoolIdOverride) || null;
      }
      return null;
    }
    return schools.find((s) => s.id === effectiveSchoolId) || null;
  }, [effectiveSchoolId, schools, currentUser, activeSchoolIdOverride]);

  // If currentUser is parent and no selected child, default to first child
  useEffect(() => {
    if (currentUser?.role === 'parent' && currentUser.linkedStudentIds?.length) {
      if (!selectedChildId || !currentUser.linkedStudentIds.includes(selectedChildId)) {
        setSelectedChildId(currentUser.linkedStudentIds[0]);
      }
    }
  }, [currentUser, selectedChildId]);

  // Log an audit trail
  const logAudit = (action: string, details: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      schoolId: effectiveSchoolId || undefined,
      schoolName: currentSchool?.name || (currentUser.role === 'super_admin' ? 'Platform Wide' : undefined),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      saveToStorage('auditLogs', updated);
      return updated;
    });
  };

  // Scoped Data Queries (Multi-Tenant Isolation)
  const scopedStudents = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? students.filter((s) => s.schoolId === effectiveSchoolId) : students;
    }
    if (currentUser.role === 'parent') {
      const allowedIds = currentUser.linkedStudentIds || [];
      return students.filter((s) => s.schoolId === currentUser.schoolId && allowedIds.includes(s.id));
    }
    if (currentUser.role === 'student') {
      return students.filter((s) => s.id === currentUser.linkedStudentId);
    }
    return students.filter((s) => s.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, students]);

  const scopedTeachers = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? teachers.filter((t) => t.schoolId === effectiveSchoolId) : teachers;
    }
    return teachers.filter((t) => t.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, teachers]);

  const scopedClasses = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? classes.filter((c) => c.schoolId === effectiveSchoolId) : classes;
    }
    return classes.filter((c) => c.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, classes]);

  const scopedSections = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? sections.filter((s) => s.schoolId === effectiveSchoolId) : sections;
    }
    return sections.filter((s) => s.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, sections]);

  const scopedSubjects = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? subjects.filter((s) => s.schoolId === effectiveSchoolId) : subjects;
    }
    return subjects.filter((s) => s.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, subjects]);

  const scopedAttendance = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? attendance.filter((a) => a.schoolId === effectiveSchoolId) : attendance;
    }
    return attendance.filter((a) => a.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, attendance]);

  const scopedTimetable = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? timetables.filter((t) => t.schoolId === effectiveSchoolId) : timetables;
    }
    if (currentUser.role === 'student' && currentUser.linkedStudentId) {
      const me = students.find((s) => s.id === currentUser.linkedStudentId);
      if (me) {
        return timetables.filter((t) => t.schoolId === currentUser.schoolId && t.classId === me.classId && t.sectionId === me.sectionId);
      }
    }
    if (currentUser.role === 'teacher' && currentUser.linkedTeacherId) {
      return timetables.filter((t) => t.schoolId === currentUser.schoolId && t.teacherId === currentUser.linkedTeacherId);
    }
    return timetables.filter((t) => t.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, timetables, students]);

  const scopedHomework = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? homework.filter((h) => h.schoolId === effectiveSchoolId) : homework;
    }
    if (currentUser.role === 'student' && currentUser.linkedStudentId) {
      const me = students.find((s) => s.id === currentUser.linkedStudentId);
      if (me) {
        return homework.filter((h) => h.schoolId === currentUser.schoolId && h.classId === me.classId && h.sectionId === me.sectionId);
      }
    }
    if (currentUser.role === 'parent' && selectedChildId) {
      const child = students.find((s) => s.id === selectedChildId);
      if (child) {
        return homework.filter((h) => h.schoolId === currentUser.schoolId && h.classId === child.classId && h.sectionId === child.sectionId);
      }
    }
    return homework.filter((h) => h.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, homework, students, selectedChildId]);

  const scopedExams = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? exams.filter((e) => e.schoolId === effectiveSchoolId) : exams;
    }
    return exams.filter((e) => e.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, exams]);

  const scopedExamSchedules = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? examSchedules.filter((e) => e.schoolId === effectiveSchoolId) : examSchedules;
    }
    return examSchedules.filter((e) => e.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, examSchedules]);

  const scopedExamResults = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? examResults.filter((r) => r.schoolId === effectiveSchoolId) : examResults;
    }
    if (currentUser.role === 'student' && currentUser.linkedStudentId) {
      return examResults.filter((r) => r.schoolId === currentUser.schoolId && r.studentId === currentUser.linkedStudentId && r.isPublished);
    }
    if (currentUser.role === 'parent' && selectedChildId) {
      return examResults.filter((r) => r.schoolId === currentUser.schoolId && r.studentId === selectedChildId && r.isPublished);
    }
    return examResults.filter((r) => r.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, examResults, selectedChildId]);

  const scopedFeeStructures = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? feeStructures.filter((f) => f.schoolId === effectiveSchoolId) : feeStructures;
    }
    return feeStructures.filter((f) => f.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, feeStructures]);

  const scopedStudentFees = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? studentFees.filter((f) => f.schoolId === effectiveSchoolId) : studentFees;
    }
    if (currentUser.role === 'student' && currentUser.linkedStudentId) {
      return studentFees.filter((f) => f.schoolId === currentUser.schoolId && f.studentId === currentUser.linkedStudentId);
    }
    if (currentUser.role === 'parent' && selectedChildId) {
      return studentFees.filter((f) => f.schoolId === currentUser.schoolId && f.studentId === selectedChildId);
    }
    return studentFees.filter((f) => f.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, studentFees, selectedChildId]);

  const scopedFeePayments = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? feePayments.filter((p) => p.schoolId === effectiveSchoolId) : feePayments;
    }
    if (currentUser.role === 'student' && currentUser.linkedStudentId) {
      return feePayments.filter((p) => p.schoolId === currentUser.schoolId && p.studentId === currentUser.linkedStudentId);
    }
    if (currentUser.role === 'parent' && selectedChildId) {
      return feePayments.filter((p) => p.schoolId === currentUser.schoolId && p.studentId === selectedChildId);
    }
    return feePayments.filter((p) => p.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, feePayments, selectedChildId]);

  const scopedNotices = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? notices.filter((n) => n.schoolId === effectiveSchoolId) : notices;
    }
    const schoolNotices = notices.filter((n) => n.schoolId === currentUser.schoolId && n.isPublished);
    if (currentUser.role === 'school_admin' || currentUser.role === 'principal') {
      return notices.filter((n) => n.schoolId === currentUser.schoolId);
    }
    if (currentUser.role === 'teacher') {
      return schoolNotices.filter((n) => n.targetAudience === 'everyone' || n.targetAudience === 'teachers');
    }
    if (currentUser.role === 'parent') {
      return schoolNotices.filter((n) => n.targetAudience === 'everyone' || n.targetAudience === 'parents');
    }
    if (currentUser.role === 'student') {
      return schoolNotices.filter((n) => n.targetAudience === 'everyone' || n.targetAudience === 'students');
    }
    return schoolNotices;
  }, [currentUser, effectiveSchoolId, notices]);

  const scopedNotifications = useMemo(() => {
    if (!currentUser) return [];
    return notifications.filter((n) => {
      if (currentUser.role === 'super_admin') return true;
      if (n.schoolId && n.schoolId !== currentUser.schoolId) return false;
      if (n.userId && n.userId !== currentUser.id) return false;
      if (n.targetRole && n.targetRole !== 'all' && n.targetRole !== currentUser.role) return false;
      return true;
    });
  }, [currentUser, notifications]);

  const scopedDocuments = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? documents.filter((d) => d.schoolId === effectiveSchoolId) : documents;
    }
    if (currentUser.role === 'student' && currentUser.linkedStudentId) {
      return documents.filter((d) => d.schoolId === currentUser.schoolId && (!d.studentId || d.studentId === currentUser.linkedStudentId));
    }
    if (currentUser.role === 'parent' && selectedChildId) {
      return documents.filter((d) => d.schoolId === currentUser.schoolId && (!d.studentId || d.studentId === selectedChildId));
    }
    return documents.filter((d) => d.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, documents, selectedChildId]);

  const scopedBooks = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? books.filter((b) => b.schoolId === effectiveSchoolId) : books;
    }
    return books.filter((b) => b.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, books]);

  const scopedLibraryIssues = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? libraryIssues.filter((i) => i.schoolId === effectiveSchoolId) : libraryIssues;
    }
    if (currentUser.role === 'student' && currentUser.linkedStudentId) {
      return libraryIssues.filter((i) => i.schoolId === currentUser.schoolId && i.borrowerId === currentUser.linkedStudentId);
    }
    return libraryIssues.filter((i) => i.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, libraryIssues]);

  const scopedVehicles = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? vehicles.filter((v) => v.schoolId === effectiveSchoolId) : vehicles;
    }
    return vehicles.filter((v) => v.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, vehicles]);

  const scopedRoutes = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? routes.filter((r) => r.schoolId === effectiveSchoolId) : routes;
    }
    return routes.filter((r) => r.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, routes]);

  const scopedAuditLogs = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') {
      return effectiveSchoolId ? auditLogs.filter((l) => l.schoolId === effectiveSchoolId) : auditLogs;
    }
    return auditLogs.filter((l) => l.schoolId === currentUser.schoolId);
  }, [currentUser, effectiveSchoolId, auditLogs]);

  const currentSchoolSettings = useMemo(() => {
    if (!effectiveSchoolId) return null;
    return settings[effectiveSchoolId] || null;
  }, [effectiveSchoolId, settings]);

  // Auth Operations
  const login = (email: string, password?: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      addToast('Please enter your email address', 'error');
      return { success: false, message: 'Please enter your email address' };
    }

    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      addToast('No account found with this email. Please check or register.', 'error');
      return { success: false, message: 'No account found with this email' };
    }

    if (user.status === 'inactive') {
      addToast('This account has been deactivated. Please contact support.', 'error');
      return { success: false, message: 'Account deactivated' };
    }

    if (user.password && password && user.password !== password) {
      addToast('Incorrect password. Please verify and try again.', 'error');
      return { success: false, message: 'Incorrect password' };
    }

    setCurrentUserId(user.id);
    setActiveSchoolIdOverride(null);
    setSelectedChildId(user.linkedStudentIds?.[0] || null);
    addToast(`Welcome back, ${user.name}!`, 'success');
    logAudit('User Login', `Authenticated session for ${user.email} as ${user.role}`);
    return { success: true };
  };

  const loginAs = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUserId(user.id);
      setActiveSchoolIdOverride(null);
      setSelectedChildId(user.linkedStudentIds?.[0] || null);
      addToast(`Logged in as ${user.name} (${user.role.replace('_', ' ').toUpperCase()})`, 'success');
      logAudit('User Login', `Session initiated for ${user.email} as ${user.role}`);
    }
  };

  const loginWithCredentials = (email: string, role?: UserRole): boolean => {
    const res = login(email);
    if (res.success) return true;
    if (role) {
      const match = users.find((u) => u.role === role);
      if (match) {
        setCurrentUserId(match.id);
        setActiveSchoolIdOverride(null);
        setSelectedChildId(match.linkedStudentIds?.[0] || null);
        addToast(`Signed in as ${match.name}`, 'success');
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUserId(null);
    setActiveSchoolIdOverride(null);
    setSelectedChildId(null);
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'currentUserId');
    addToast('Signed out successfully', 'info');
  };

  const registerUser = (data: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: UserRole;
    schoolId?: string;
    classId?: string;
    sectionId?: string;
    rollNo?: string;
    admissionNo?: string;
    designation?: string;
    department?: string;
    studentAdmissionNo?: string;
  }): { success: boolean; message?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail || !data.name) {
      addToast('Name and email are required for registration', 'error');
      return { success: false, message: 'Name and email are required' };
    }

    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      addToast('An account with this email address already exists. Please sign in.', 'error');
      return { success: false, message: 'Email already registered' };
    }

    const targetSchoolId = data.schoolId || (schools.length > 0 ? schools[0].id : 'school_1');
    const newUserId = 'usr_' + Date.now();
    let linkedStudentId: string | undefined = undefined;
    let linkedTeacherId: string | undefined = undefined;
    let linkedStudentIds: string[] | undefined = undefined;

    // If Student role, automatically create student record
    if (data.role === 'student') {
      const newStudentId = 'std_' + Date.now();
      const newStudent: Student = {
        id: newStudentId,
        schoolId: targetSchoolId,
        admissionNo: data.admissionNo || 'ADM-' + Math.floor(1000 + Math.random() * 9000),
        rollNo: data.rollNo || String(Math.floor(10 + Math.random() * 40)),
        name: data.name,
        dob: '2010-05-15',
        gender: 'Male',
        classId: data.classId || (classes[0]?.id || 'cls_1'),
        sectionId: data.sectionId || (sections[0]?.id || 'sec_1'),
        parentName: 'Parent of ' + data.name,
        parentPhone: data.phone,
        parentEmail: 'parent.' + cleanEmail,
        address: 'Residential Address',
        admissionDate: new Date().toISOString().substring(0, 10),
        status: 'active',
      };
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      saveToStorage('students', updatedStudents);
      linkedStudentId = newStudentId;
    }

    // If Teacher role, automatically create teacher record
    if (data.role === 'teacher') {
      const newTeacherId = 'tch_' + Date.now();
      const newTeacher: Teacher = {
        id: newTeacherId,
        schoolId: targetSchoolId,
        employeeId: 'EMP-' + Math.floor(100 + Math.random() * 900),
        name: data.name,
        email: data.email,
        phone: data.phone,
        designation: data.designation || 'Senior Faculty',
        qualification: 'M.Ed / B.Ed',
        joiningDate: new Date().toISOString().substring(0, 10),
        status: 'active',
        classIds: classes.slice(0, 2).map((c) => c.id),
        subjectIds: subjects.slice(0, 2).map((s) => s.id),
        sectionIds: sections.slice(0, 2).map((s) => s.id),
        address: 'Faculty Quarters',
        leavesTaken: 0,
      };
      const updatedTeachers = [...teachers, newTeacher];
      setTeachers(updatedTeachers);
      saveToStorage('teachers', updatedTeachers);
      linkedTeacherId = newTeacherId;
    }

    // If Parent role, find and link student
    if (data.role === 'parent') {
      if (data.studentAdmissionNo) {
        const found = students.find((s) => s.admissionNo.toLowerCase() === data.studentAdmissionNo?.trim().toLowerCase());
        if (found) {
          linkedStudentIds = [found.id];
        }
      }
      if (!linkedStudentIds || linkedStudentIds.length === 0) {
        // Link to first student in school if available
        const sMatch = students.find((s) => s.schoolId === targetSchoolId);
        if (sMatch) linkedStudentIds = [sMatch.id];
      }
    }

    const newUser: User = {
      id: newUserId,
      name: data.name,
      email: data.email,
      password: data.password || 'password123',
      phone: data.phone,
      role: data.role,
      schoolId: targetSchoolId,
      status: 'active',
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=ea580c`,
      linkedStudentId,
      linkedTeacherId,
      linkedStudentIds,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToStorage('users', updatedUsers);

    // Automatically log in newly registered user
    setCurrentUserId(newUserId);
    setActiveSchoolIdOverride(null);
    setSelectedChildId(linkedStudentIds?.[0] || null);

    addToast(`Account created! Welcome, ${newUser.name}.`, 'success');
    logAudit('User Registration', `New ${newUser.role} account created for ${newUser.email}`);
    return { success: true };
  };

  const registerSchool = (data: Partial<School> & { adminName: string; adminEmail: string; adminPhone: string; adminPassword?: string }): { success: boolean; message?: string } => {
    const newSchoolId = 'school_' + Date.now();
    const newAdminId = 'usr_' + Date.now();

    const newSchool: School = {
      id: newSchoolId,
      name: data.name || 'New Institution',
      principalName: data.principalName || data.adminName,
      email: data.email || data.adminEmail,
      phone: data.phone || data.adminPhone,
      address: data.address || 'Campus Address',
      city: data.city || 'New Delhi',
      state: data.state || 'Delhi',
      country: 'India',
      schoolCode: (data.schoolCode || 'BSM-' + Math.floor(100 + Math.random() * 900)).toUpperCase(),
      academicSession: data.academicSession || '2025-2026',
      status: 'active',
      establishedYear: Number(data.establishedYear) || 2025,
      affiliationNo: data.affiliationNo || 'CBSE/AFF/2026',
      studentCount: 0,
      teacherCount: 0,
      createdAt: new Date().toISOString(),
    };

    const newAdmin: User = {
      id: newAdminId,
      name: data.adminName,
      email: data.adminEmail,
      password: data.adminPassword || 'password123',
      phone: data.adminPhone,
      role: 'school_admin',
      schoolId: newSchoolId,
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.adminName)}&backgroundColor=ea580c`,
      createdAt: new Date().toISOString(),
    };

    const newSchoolSettings: SchoolSettings = {
      schoolId: newSchoolId,
      name: newSchool.name,
      principalName: newSchool.principalName,
      email: newSchool.email,
      phone: newSchool.phone,
      address: newSchool.address,
      city: newSchool.city,
      state: newSchool.state,
      country: 'India',
      schoolCode: newSchool.schoolCode,
      academicSession: newSchool.academicSession,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      schoolStartTime: '08:00 AM',
      schoolEndTime: '02:00 PM',
      currencySymbol: '₹',
    };

    const updatedSchools = [...schools, newSchool];
    const updatedUsers = [...users, newAdmin];
    const updatedSettings = { ...settings, [newSchoolId]: newSchoolSettings };

    setSchools(updatedSchools);
    setUsers(updatedUsers);
    setSettings(updatedSettings);

    saveToStorage('schools', updatedSchools);
    saveToStorage('users', updatedUsers);
    saveToStorage('settings', updatedSettings);

    // Auto-login the new administrator
    setCurrentUserId(newAdminId);
    setActiveSchoolIdOverride(null);

    addToast(`School "${newSchool.name}" registered successfully! Welcome, ${newAdmin.name}.`, 'success');
    logAudit('School Registered', `New school ${newSchool.name} registered with Admin ${newAdmin.email}`);
    return { success: true };
  };

  // CRUD Implementations
  const addSchool = (schoolData: Omit<School, 'id' | 'createdAt'>) => {
    const id = 'school_' + Date.now();
    const newSchool: School = {
      ...schoolData,
      id,
      createdAt: new Date().toISOString(),
    };
    const updated = [...schools, newSchool];
    setSchools(updated);
    saveToStorage('schools', updated);

    // Initial school settings
    const newSettings: SchoolSettings = {
      schoolId: id,
      name: newSchool.name,
      principalName: newSchool.principalName,
      email: newSchool.email,
      phone: newSchool.phone,
      address: newSchool.address,
      city: newSchool.city,
      state: newSchool.state,
      country: 'India',
      schoolCode: newSchool.schoolCode,
      academicSession: newSchool.academicSession,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      schoolStartTime: '08:00 AM',
      schoolEndTime: '02:00 PM',
      currencySymbol: '₹',
    };
    setSettings((prev) => {
      const up = { ...prev, [id]: newSettings };
      saveToStorage('settings', up);
      return up;
    });

    addToast(`School "${newSchool.name}" registered successfully`, 'success');
    logAudit('School Created', `Registered new school ${newSchool.name} (${newSchool.schoolCode})`);
  };

  const updateSchool = (id: string, updates: Partial<School>) => {
    const updated = schools.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSchools(updated);
    saveToStorage('schools', updated);
    addToast('School updated successfully', 'success');
    logAudit('School Updated', `Modified details for school ID ${id}`);
  };

  const approveSchool = (id: string) => {
    const updated = schools.map((s) => (s.id === id ? { ...s, status: 'active' as const } : s));
    setSchools(updated);
    saveToStorage('schools', updated);
    addToast('School approved and activated!', 'success');
    logAudit('School Approved', `Super Admin approved school registration for ID ${id}`);
  };

  const toggleSchoolStatus = (id: string) => {
    const target = schools.find((s) => s.id === id);
    if (!target) return;
    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    const updated = schools.map((s) => (s.id === id ? { ...s, status: newStatus as any } : s));
    setSchools(updated);
    saveToStorage('schools', updated);
    addToast(`School ${newStatus === 'active' ? 'activated' : 'deactivated'}`, 'info');
    logAudit('School Status Changed', `Changed status of ${target.name} to ${newStatus}`);
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'schoolId'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'std_' + Date.now();
    const newStudent: Student = {
      ...studentData,
      id,
      schoolId: sId,
    };
    const updated = [newStudent, ...students];
    setStudents(updated);
    saveToStorage('students', updated);
    addToast(`Student ${newStudent.name} enrolled successfully`, 'success');
    logAudit('Student Enrolled', `Created admission ${newStudent.admissionNo} for ${newStudent.name}`);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    const updated = students.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setStudents(updated);
    saveToStorage('students', updated);
    addToast('Student profile updated', 'success');
    logAudit('Student Updated', `Updated profile data for student ID ${id}`);
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    saveToStorage('students', updated);
    addToast(`Student ${target?.name || ''} deleted`, 'info');
    logAudit('Student Removed', `Deleted student record ${target?.admissionNo || id}`);
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'schoolId' | 'leavesTaken'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'tch_' + Date.now();
    const newTeacher: Teacher = {
      ...teacherData,
      id,
      schoolId: sId,
      leavesTaken: 0,
    };
    const updated = [newTeacher, ...teachers];
    setTeachers(updated);
    saveToStorage('teachers', updated);
    addToast(`Teacher ${newTeacher.name} appointed successfully`, 'success');
    logAudit('Teacher Appointed', `Created employee record ${newTeacher.employeeId} for ${newTeacher.name}`);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    const updated = teachers.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setTeachers(updated);
    saveToStorage('teachers', updated);
    addToast('Teacher details updated', 'success');
    logAudit('Teacher Updated', `Modified teacher information for ID ${id}`);
  };

  const deleteTeacher = (id: string) => {
    const target = teachers.find((t) => t.id === id);
    const updated = teachers.filter((t) => t.id !== id);
    setTeachers(updated);
    saveToStorage('teachers', updated);
    addToast(`Teacher ${target?.name || ''} deactivated`, 'info');
    logAudit('Teacher Deactivated', `Removed teacher record ${target?.employeeId || id}`);
  };

  const addClass = (name: string, gradeLevel: number) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'cls_' + Date.now();
    const newClass: SchoolClass = {
      id,
      schoolId: sId,
      name,
      gradeLevel,
      sectionIds: [],
    };
    const updated = [...classes, newClass];
    setClasses(updated);
    saveToStorage('classes', updated);
    addToast(`Class ${name} created`, 'success');
    logAudit('Class Created', `Added ${name} (Grade ${gradeLevel})`);
  };

  const addSection = (classId: string, name: string, roomNo: string, classTeacherId?: string) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'sec_' + Date.now();
    const newSec: Section = {
      id,
      schoolId: sId,
      classId,
      name,
      roomNo,
      classTeacherId,
    };
    const updatedSections = [...sections, newSec];
    setSections(updatedSections);
    saveToStorage('sections', updatedSections);

    // Update class sectionIds
    const updatedClasses = classes.map((c) => (c.id === classId ? { ...c, sectionIds: [...c.sectionIds, id] } : c));
    setClasses(updatedClasses);
    saveToStorage('classes', updatedClasses);

    addToast(`Section ${name} added`, 'success');
    logAudit('Section Added', `Created Section ${name} for class ID ${classId}`);
  };

  const addSubject = (name: string, code: string, classId: string, teacherId?: string) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'sub_' + Date.now();
    const newSub: Subject = {
      id,
      schoolId: sId,
      name,
      code,
      classId,
      teacherId,
    };
    const updated = [...subjects, newSub];
    setSubjects(updated);
    saveToStorage('subjects', updated);
    addToast(`Subject ${name} (${code}) added`, 'success');
    logAudit('Subject Added', `Created subject ${name} with code ${code}`);
  };

  const saveAttendance = (classId: string, sectionId: string, date: string, records: { studentId: string; status: any; remark?: string }[]) => {
    const sId = effectiveSchoolId || 'school_1';
    const existingIndex = attendance.findIndex((a) => a.schoolId === sId && a.classId === classId && a.sectionId === sectionId && a.date === date);

    const newRecord: DailyAttendance = {
      id: existingIndex >= 0 ? attendance[existingIndex].id : 'att_' + Date.now(),
      schoolId: sId,
      classId,
      sectionId,
      date,
      records,
      takenBy: currentUser?.name || 'Class Teacher',
      createdAt: new Date().toISOString(),
    };

    let updated: DailyAttendance[];
    if (existingIndex >= 0) {
      updated = [...attendance];
      updated[existingIndex] = newRecord;
    } else {
      updated = [newRecord, ...attendance];
    }
    setAttendance(updated);
    saveToStorage('attendance', updated);
    addToast(`Attendance saved for ${date} (${records.length} students)`, 'success');
    logAudit('Attendance Saved', `Recorded attendance for Class ID ${classId} on ${date}`);
  };

  const addHomework = (hwData: Omit<Homework, 'id' | 'schoolId' | 'submissions'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'hw_' + Date.now();
    // Default submissions for all students in this class/section
    const targetStudents = students.filter((s) => s.schoolId === sId && s.classId === hwData.classId && s.sectionId === hwData.sectionId);
    const submissions = targetStudents.map((s) => ({ studentId: s.id, status: 'pending' as const }));

    const newHw: Homework = {
      ...hwData,
      id,
      schoolId: sId,
      submissions,
    };
    const updated = [newHw, ...homework];
    setHomework(updated);
    saveToStorage('homework', updated);

    // Create notification for parents/students
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      schoolId: sId,
      targetRole: 'all',
      title: 'New Homework Assigned',
      message: `${hwData.title} (Due: ${hwData.dueDate})`,
      category: 'homework',
      timestamp: 'Just now',
      isRead: false,
      link: 'homework',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('Homework assignment published successfully', 'success');
    logAudit('Homework Assigned', `Published "${hwData.title}" for Class ID ${hwData.classId}`);
  };

  const updateHomeworkSubmission = (homeworkId: string, studentId: string, status: any, notes?: string) => {
    const updated = homework.map((h) => {
      if (h.id !== homeworkId) return h;
      const subIndex = h.submissions.findIndex((s) => s.studentId === studentId);
      const newSub = {
        studentId,
        status,
        submissionDate: new Date().toISOString().substring(0, 10),
        notes,
      };
      let newSubs = [...h.submissions];
      if (subIndex >= 0) {
        newSubs[subIndex] = newSub;
      } else {
        newSubs.push(newSub);
      }
      return { ...h, submissions: newSubs };
    });
    setHomework(updated);
    saveToStorage('homework', updated);
    addToast('Homework status updated', 'success');
  };

  const addExam = (examData: Omit<Exam, 'id' | 'schoolId'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'exam_' + Date.now();
    const newExam: Exam = {
      ...examData,
      id,
      schoolId: sId,
    };
    const updated = [newExam, ...exams];
    setExams(updated);
    saveToStorage('exams', updated);
    addToast(`Examination "${newExam.title}" scheduled`, 'success');
    logAudit('Exam Scheduled', `Created exam ${newExam.title}`);
  };

  const addExamSchedule = (scheduleData: Omit<ExamScheduleItem, 'id' | 'schoolId'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'esch_' + Date.now();
    const newSchedule: ExamScheduleItem = {
      ...scheduleData,
      id,
      schoolId: sId,
    };
    const updated = [...examSchedules, newSchedule];
    setExamSchedules(updated);
    saveToStorage('examSchedules', updated);
    addToast('Exam subject schedule added', 'success');
  };

  const saveStudentExamResult = (resultData: Omit<StudentExamResult, 'id' | 'schoolId'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const existingIndex = examResults.findIndex((r) => r.schoolId === sId && r.examId === resultData.examId && r.studentId === resultData.studentId);

    const newResult: StudentExamResult = {
      ...resultData,
      id: existingIndex >= 0 ? examResults[existingIndex].id : 'res_' + Date.now(),
      schoolId: sId,
    };

    let updated: StudentExamResult[];
    if (existingIndex >= 0) {
      updated = [...examResults];
      updated[existingIndex] = newResult;
    } else {
      updated = [newResult, ...examResults];
    }
    setExamResults(updated);
    saveToStorage('examResults', updated);
    addToast('Student marks & grades saved', 'success');
    logAudit('Marks Entered', `Recorded marks for student ID ${resultData.studentId} (${resultData.percentage}%)`);
  };

  const publishExamResults = (examId: string) => {
    const sId = effectiveSchoolId || 'school_1';
    const updated = examResults.map((r) => (r.examId === examId ? { ...r, isPublished: true, publishedDate: new Date().toISOString().substring(0, 10) } : r));
    setExamResults(updated);
    saveToStorage('examResults', updated);

    // Update exam status
    setExams((prev) => prev.map((e) => (e.id === examId ? { ...e, status: 'published' as const } : e)));

    // Create notification
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      schoolId: sId,
      targetRole: 'all',
      title: 'Exam Results Published',
      message: 'Official report cards are now accessible on portals',
      category: 'result',
      timestamp: 'Just now',
      isRead: false,
      link: 'results',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('Results published! Accessible to parents and students.', 'success');
    logAudit('Results Published', `Published final examination results for Exam ID ${examId}`);
  };

  const addFeeStructure = (feeData: Omit<FeeStructure, 'id' | 'schoolId'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'fee_' + Date.now();
    const newFee: FeeStructure = {
      ...feeData,
      id,
      schoolId: sId,
    };
    const updated = [...feeStructures, newFee];
    setFeeStructures(updated);
    saveToStorage('feeStructures', updated);

    // Auto-generate fee record for students in this class
    const targetStudents = students.filter((s) => s.schoolId === sId && s.classId === feeData.classId);
    const newStudentFeeRecords: StudentFeeRecord[] = targetStudents.map((s) => ({
      id: 'sf_' + Date.now() + Math.random().toString(36).substring(2, 6),
      schoolId: sId,
      studentId: s.id,
      feeStructureId: id,
      title: feeData.title,
      amount: feeData.amount,
      discount: 0,
      lateFee: 0,
      paidAmount: 0,
      status: 'pending',
      dueDate: feeData.dueDate,
    }));

    setStudentFees((prev) => {
      const up = [...newStudentFeeRecords, ...prev];
      saveToStorage('studentFees', up);
      return up;
    });

    addToast(`Fee structure "${newFee.title}" created`, 'success');
    logAudit('Fee Structure Created', `Added ${newFee.title} - ₹${newFee.amount}`);
  };

  const recordFeePayment = (paymentData: { studentId: string; studentFeeId: string; amount: number; paymentMethod: any; notes?: string }) => {
    const sId = effectiveSchoolId || 'school_1';
    const receiptNo = `RCP-${currentSchool?.schoolCode || 'BSM'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment: FeePayment = {
      id: 'pmt_' + Date.now(),
      schoolId: sId,
      studentId: paymentData.studentId,
      studentFeeId: paymentData.studentFeeId,
      amount: paymentData.amount,
      paymentDate: new Date().toISOString().substring(0, 10),
      paymentMethod: paymentData.paymentMethod,
      receiptNo,
      receivedBy: currentUser?.name || 'Accounts Desk',
      notes: paymentData.notes,
    };

    const updatedPayments = [newPayment, ...feePayments];
    setFeePayments(updatedPayments);
    saveToStorage('feePayments', updatedPayments);

    // Update student fee record status
    const updatedFees = studentFees.map((f) => {
      if (f.id !== paymentData.studentFeeId) return f;
      const totalPaid = (f.paidAmount || 0) + paymentData.amount;
      const netPayable = f.amount - (f.discount || 0) + (f.lateFee || 0);
      const status: 'paid' | 'partial' = totalPaid >= netPayable ? 'paid' : 'partial';
      return {
        ...f,
        paidAmount: totalPaid,
        status,
        lastPaymentDate: new Date().toISOString().substring(0, 10),
        receiptNumber: receiptNo,
      };
    });
    setStudentFees(updatedFees);
    saveToStorage('studentFees', updatedFees);

    // Notification
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      schoolId: sId,
      userId: paymentData.studentId,
      targetRole: 'parent',
      title: 'Fee Payment Received',
      message: `₹${paymentData.amount.toLocaleString('en-IN')} paid. Receipt: ${receiptNo}`,
      category: 'fees',
      timestamp: 'Just now',
      isRead: false,
      link: 'fees',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(`Fee receipt #${receiptNo} generated successfully!`, 'success');
    logAudit('Fee Payment Recorded', `Received ₹${paymentData.amount} for student ID ${paymentData.studentId} (${receiptNo})`);
  };

  const addFeePayment = (studentFeeId: string, amount: number, paymentMethod: any, notes?: string) => {
    const fee = studentFees.find((f) => f.id === studentFeeId);
    recordFeePayment({
      studentId: fee?.studentId || '',
      studentFeeId,
      amount,
      paymentMethod,
      notes,
    });
  };

  const saveExamResult = (resultData: any) => {
    saveStudentExamResult(resultData);
  };

  const addNotice = (noticeData: Omit<SchoolNotice, 'id' | 'schoolId' | 'date' | 'authorName'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'ntc_' + Date.now();
    const newNotice: SchoolNotice = {
      ...noticeData,
      id,
      schoolId: sId,
      date: new Date().toISOString().substring(0, 10),
      authorName: currentUser?.name || 'School Administration',
    };
    const updated = [newNotice, ...notices];
    setNotices(updated);
    saveToStorage('notices', updated);

    // Generate Notification
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      schoolId: sId,
      targetRole: 'all',
      title: 'New Notice: ' + newNotice.title,
      message: newNotice.description.substring(0, 80) + '...',
      category: 'notice',
      timestamp: 'Just now',
      isRead: false,
      link: 'notices',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('Notice published to target audience', 'success');
    logAudit('Notice Published', `Created notice "${newNotice.title}"`);
  };

  const toggleNoticePin = (noticeId: string) => {
    const updated = notices.map((n) => (n.id === noticeId ? { ...n, isPinned: !n.isPinned } : n));
    setNotices(updated);
    saveToStorage('notices', updated);
  };

  const deleteNotice = (noticeId: string) => {
    const updated = notices.filter((n) => n.id !== noticeId);
    setNotices(updated);
    saveToStorage('notices', updated);
    addToast('Notice removed', 'info');
    logAudit('Notice Deleted', `Removed notice ID ${noticeId}`);
  };

  const addDocument = (docData: Omit<SchoolDocument, 'id' | 'schoolId' | 'uploadDate' | 'uploadedBy'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'doc_' + Date.now();
    const newDoc: SchoolDocument = {
      ...docData,
      id,
      schoolId: sId,
      uploadDate: new Date().toISOString().substring(0, 10),
      uploadedBy: currentUser?.name || 'Administrator',
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveToStorage('documents', updated);
    addToast(`Document "${newDoc.title}" uploaded`, 'success');
    logAudit('Document Uploaded', `Uploaded ${newDoc.title} (${newDoc.category})`);
  };

  const deleteDocument = (docId: string) => {
    const updated = documents.filter((d) => d.id !== docId);
    setDocuments(updated);
    saveToStorage('documents', updated);
    addToast('Document deleted', 'info');
    logAudit('Document Deleted', `Deleted document ID ${docId}`);
  };

  const addBook = (bookData: Omit<LibraryBook, 'id' | 'schoolId'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'bk_' + Date.now();
    const newBook: LibraryBook = {
      ...bookData,
      id,
      schoolId: sId,
    };
    const updated = [...books, newBook];
    setBooks(updated);
    saveToStorage('books', updated);
    addToast(`Book "${newBook.title}" added to catalog`, 'success');
    logAudit('Book Added', `Added ISBN ${newBook.isbn}: ${newBook.title}`);
  };

  const issueBook = (bookId: string, borrowerId: string, borrowerNameOrDueDate?: any, borrowerRoleOrDueDate?: any, daysOrRole?: any) => {
    const sId = effectiveSchoolId || 'school_1';
    const book = books.find((b) => b.id === bookId);
    if (!book || book.availableCopies <= 0) {
      addToast('No available copies of this book!', 'error');
      return;
    }

    let bName = typeof borrowerNameOrDueDate === 'string' && !borrowerNameOrDueDate.includes('-') ? borrowerNameOrDueDate : '';
    if (!bName) {
      const st = students.find((s) => s.id === borrowerId);
      const tc = teachers.find((t) => t.id === borrowerId);
      bName = st ? st.name : (tc ? tc.name : 'Student Borrower');
    }

    const bRole: 'student' | 'teacher' = borrowerRoleOrDueDate === 'teacher' ? 'teacher' : 'student';
    const days: number = typeof daysOrRole === 'number' ? daysOrRole : 14;

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + days);

    const newIssue: LibraryIssue = {
      id: 'iss_' + Date.now(),
      schoolId: sId,
      bookId,
      bookTitle: book.title,
      borrowerId,
      borrowerName: bName,
      borrowerRole: bRole,
      issueDate: today.toISOString().substring(0, 10),
      dueDate: dueDate.toISOString().substring(0, 10),
      status: 'issued',
      fineAmount: 0,
    };

    setLibraryIssues((prev) => {
      const up = [newIssue, ...prev];
      saveToStorage('libraryIssues', up);
      return up;
    });

    // Reduce available copies
    setBooks((prev) => {
      const up = prev.map((b) => (b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));
      saveToStorage('books', up);
      return up;
    });

    addToast(`Book issued to ${bName} (Due: ${dueDate.toISOString().substring(0, 10)})`, 'success');
    logAudit('Book Issued', `Issued "${book.title}" to ${bName}`);
  };

  const returnBook = (issueId: string) => {
    const issue = libraryIssues.find((i) => i.id === issueId);
    if (!issue) return;

    const returnDate = new Date().toISOString().substring(0, 10);
    const updatedIssues = libraryIssues.map((i) => (i.id === issueId ? { ...i, status: 'returned' as const, returnDate } : i));
    setLibraryIssues(updatedIssues);
    saveToStorage('libraryIssues', updatedIssues);

    // Increase available copies
    setBooks((prev) => {
      const up = prev.map((b) => (b.id === issue.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));
      saveToStorage('books', up);
      return up;
    });

    addToast(`Book "${issue.bookTitle}" marked as returned`, 'success');
    logAudit('Book Returned', `Returned book issue ID ${issueId}`);
  };

  const addVehicle = (vehData: Omit<Vehicle, 'id' | 'schoolId'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'veh_' + Date.now();
    const newVeh: Vehicle = {
      ...vehData,
      id,
      schoolId: sId,
    };
    const updated = [...vehicles, newVeh];
    setVehicles(updated);
    saveToStorage('vehicles', updated);
    addToast(`Vehicle ${newVeh.vehicleNumber} registered`, 'success');
    logAudit('Vehicle Added', `Added vehicle ${newVeh.vehicleNumber}`);
  };

  const addRoute = (routeData: Omit<TransportRoute, 'id' | 'schoolId'>) => {
    const sId = effectiveSchoolId || 'school_1';
    const id = 'route_' + Date.now();
    const newRoute: TransportRoute = {
      ...routeData,
      id,
      schoolId: sId,
    };
    const updated = [...routes, newRoute];
    setRoutes(updated);
    saveToStorage('routes', updated);
    addToast(`Transport route "${newRoute.routeName}" configured`, 'success');
    logAudit('Route Added', `Created transport route ${newRoute.routeName}`);
  };

  const updateSettings = (updates: Partial<SchoolSettings>) => {
    if (!effectiveSchoolId) return;
    const current = settings[effectiveSchoolId] || {
      schoolId: effectiveSchoolId,
      name: currentSchool?.name || '',
      principalName: currentSchool?.principalName || '',
      email: currentSchool?.email || '',
      phone: currentSchool?.phone || '',
      address: currentSchool?.address || '',
      city: currentSchool?.city || '',
      state: currentSchool?.state || '',
      country: 'India',
      schoolCode: currentSchool?.schoolCode || '',
      academicSession: currentSchool?.academicSession || '2025-2026',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      schoolStartTime: '08:00 AM',
      schoolEndTime: '02:00 PM',
      currencySymbol: '₹',
    };

    const newSetting = { ...current, ...updates };
    const updated = { ...settings, [effectiveSchoolId]: newSetting };
    setSettings(updated);
    saveToStorage('settings', updated);

    // Also update school header info if name changed
    if (updates.name || updates.principalName || updates.email || updates.phone) {
      setSchools((prev) =>
        prev.map((s) =>
          s.id === effectiveSchoolId
            ? {
                ...s,
                name: updates.name || s.name,
                principalName: updates.principalName || s.principalName,
                email: updates.email || s.email,
                phone: updates.phone || s.phone,
              }
            : s
        )
      );
    }

    addToast('School settings saved', 'success');
    logAudit('Settings Updated', `Modified institutional parameters for ${newSetting.name}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentSchool,
        activeSchoolId: effectiveSchoolId,
        selectedChildId,
        setSelectedChildId,
        setActiveSchoolId: setActiveSchoolIdOverride,
        login,
        loginAs,
        loginWithCredentials,
        logout,
        registerUser,
        registerSchool,

        isDarkMode,
        toggleDarkMode,

        schools,
        users,
        classes,
        sections,
        subjects,
        teachers,
        students,
        attendance,
        timetables,
        homework,
        exams,
        examSchedules,
        examResults,
        feeStructures,
        studentFees,
        feePayments,
        notices,
        notifications,
        documents,
        books,
        libraryIssues,
        vehicles,
        routes,
        auditLogs,
        settings,

        scopedStudents,
        scopedTeachers,
        scopedClasses,
        scopedSections,
        scopedSubjects,
        scopedAttendance,
        scopedTimetable,
        scopedHomework,
        scopedExams,
        scopedExamSchedules,
        scopedExamResults,
        scopedFeeStructures,
        scopedStudentFees,
        scopedFeePayments,
        scopedNotices,
        scopedNotifications,
        scopedDocuments,
        scopedBooks,
        scopedLibraryIssues,
        scopedVehicles,
        scopedRoutes,
        scopedAuditLogs,
        currentSchoolSettings,

        addSchool,
        updateSchool,
        approveSchool,
        toggleSchoolStatus,

        addStudent,
        updateStudent,
        deleteStudent,

        addTeacher,
        updateTeacher,
        deleteTeacher,

        addClass,
        addSection,
        addSubject,

        saveAttendance,
        addHomework,
        updateHomeworkSubmission,

        addExam,
        addExamSchedule,
        saveStudentExamResult,
        saveExamResult,
        publishExamResults,

        addFeeStructure,
        recordFeePayment,
        addFeePayment,

        addNotice,
        toggleNoticePin,
        deleteNotice,

        addDocument,
        deleteDocument,

        addBook,
        issueBook,
        returnBook,

        addVehicle,
        addRoute,

        updateSettings,

        toasts,
        addToast,
        removeToast,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
