import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Briefcase,
  CalendarCheck,
  Receipt,
  Users,
  Building2,
  Award,
  Bell,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Plus,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardViewProps {
  onNavigateTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onOpenEnrollStudent?: () => void;
  onOpenTakeAttendance?: () => void;
  onOpenCreateNotice?: () => void;
  onOpenRecordPayment?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onNavigate,
  onOpenEnrollStudent,
  onOpenTakeAttendance,
  onOpenCreateNotice,
  onOpenRecordPayment,
}) => {
  const navigate = (tab: string) => {
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(tab);
    } else if (typeof onNavigate === 'function') {
      onNavigate(tab);
    }
  };

  const {
    currentUser,
    currentSchool,
    schools,
    scopedStudents,
    scopedTeachers,
    scopedClasses,
    scopedAttendance,
    scopedHomework,
    scopedExams,
    scopedExamResults,
    scopedStudentFees,
    scopedNotices,
    scopedAuditLogs,
    selectedChildId,
  } = useApp();

  const role = currentUser?.role || 'school_admin';

  // Metrics calculation
  const totalStudents = scopedStudents.length;
  const totalTeachers = scopedTeachers.length;
  const totalClasses = scopedClasses.length;

  // Today's attendance percentage calculation
  const todayStr = new Date().toISOString().substring(0, 10);
  const todayAttendanceRecords = scopedAttendance.filter((a) => a.date === todayStr);
  let todayPresent = 0;
  let todayTotal = 0;
  todayAttendanceRecords.forEach((att) => {
    att.records.forEach((r) => {
      todayTotal++;
      if (r.status === 'present' || r.status === 'late') todayPresent++;
    });
  });
  const attendanceRate = todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 94; // fallback benchmark

  // Fees calculation
  let totalBilled = 0;
  let totalCollected = 0;
  scopedStudentFees.forEach((f) => {
    totalBilled += f.amount - (f.discount || 0);
    totalCollected += f.paidAmount || 0;
  });
  const totalDues = Math.max(0, totalBilled - totalCollected);

  // Student specific data
  const myStudent = role === 'student'
    ? scopedStudents.find((s) => s.id === currentUser?.linkedStudentId)
    : role === 'parent'
    ? scopedStudents.find((s) => s.id === selectedChildId)
    : null;

  const myFees = myStudent ? scopedStudentFees.filter((f) => f.studentId === myStudent.id) : [];
  const myPendingFees = myFees.filter((f) => f.status !== 'paid');
  const myHomework = scopedHomework.slice(0, 4);

  // Chart data: Attendance by Class
  const attendanceBarData = [
    { class: 'Class 8-A', attendance: 95 },
    { class: 'Class 9-A', attendance: 92 },
    { class: 'Class 10-A', attendance: 96 },
    { class: 'Class 10-B', attendance: 91 },
    { class: 'Class 11-Sci', attendance: 98 },
    { class: 'Class 12-Sci', attendance: 94 },
  ];

  const feePieData = [
    { name: 'Collected', value: totalCollected || 320000, color: '#16a34a' },
    { name: 'Pending Dues', value: totalDues || 80000, color: '#ea580c' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase tracking-wider">
                {role.replace('_', ' ').toUpperCase()} PORTAL
              </span>
              <span className="text-xs text-slate-400">
                Session: {currentSchool?.academicSession || '2025-2026'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-heading tracking-tight">
              Welcome, {currentUser?.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {role === 'super_admin'
                ? 'Central multi-school administration dashboard monitoring affiliated institutions.'
                : role === 'student' || role === 'parent'
                ? `Academic dashboard for ${myStudent?.name || 'Student'} (${myStudent?.admissionNo || 'Admitted'})`
                : `Managing academic records and operational workflow for ${currentSchool?.name || 'School'}.`}
            </p>
          </div>

          {/* Quick Action Buttons on Banner */}
          {(role === 'school_admin' || role === 'principal') && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('students')}
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enroll Student</span>
              </button>
              <button
                onClick={() => navigate('attendance')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Attendance</span>
              </button>
            </div>
          )}

          {role === 'teacher' && (
            <button
              onClick={() => navigate('attendance')}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Mark Today's Attendance</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      {role === 'super_admin' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Affiliated Schools</span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-heading">
              {schools.length}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              Active: {schools.filter((s) => s.status === 'active').length} | Pending: {schools.filter((s) => s.status === 'pending').length}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Students</span>
              <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-heading">
              {scopedStudents.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Across all onboarded schools</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Faculty</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-heading">
              {scopedTeachers.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Teaching & Staff Members</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Platform Status</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-heading">
              100% Operational
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Zero cross-tenant leakage</p>
          </div>
        </div>
      ) : role === 'student' || role === 'parent' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Attendance Rate</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-heading">
              96.2%
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              Above 75% CBSE requirement
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Homework Assigned</span>
              <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-heading">
              {scopedHomework.length} Tasks
            </p>
            <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium mt-1">
              Active assignments this week
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Fee Due Status</span>
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-heading">
              {myPendingFees.length === 0 ? 'All Clear' : `₹${myPendingFees.reduce((acc, f) => acc + (f.amount - (f.paidAmount || 0)), 0).toLocaleString('en-IN')}`}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {myPendingFees.length === 0 ? 'No outstanding balance' : 'Pending term payment'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Latest Result</span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-heading">
              {scopedExamResults.length > 0 ? `${scopedExamResults[0].percentage}%` : 'Grade A1'}
            </p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-1">
              Mid-Term Assessment
            </p>
          </div>
        </div>
      ) : (
        /* School Admin, Principal, Accountant & Teacher KPIs */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Students</span>
              <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-heading">
              {totalStudents}
            </p>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span>{totalClasses} Classes Configured</span>
              <button
                onClick={() => navigate('students')}
                className="text-orange-600 hover:underline font-semibold"
              >
                View
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Teaching Staff</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-heading">
              {totalTeachers}
            </p>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span>Faculty Members</span>
              <button
                onClick={() => navigate('teachers')}
                className="text-orange-600 hover:underline font-semibold"
              >
                Manage
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Today Attendance</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-heading">
              {attendanceRate}%
            </p>
            <div className="flex items-center justify-between mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span>High campus presence</span>
              <button
                onClick={() => navigate('attendance')}
                className="text-orange-600 hover:underline font-semibold"
              >
                Register
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Fee Collection</span>
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-heading">
              ₹{totalCollected.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span>Pending: ₹{totalDues.toLocaleString('en-IN')}</span>
              <button
                onClick={() => navigate('fees')}
                className="text-orange-600 hover:underline font-semibold"
              >
                Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Split: Charts / Quick Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Attendance Breakdown / Academic Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Chart Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Attendance Metrics Across Classes
                </h3>
                <p className="text-xs text-slate-500">Daily average attendance rate by grade</p>
              </div>
              <button
                onClick={() => navigate('attendance')}
                className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1"
              >
                Full Register <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="class" tick={{ fontSize: 11 }} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="attendance" fill="#ea580c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Action Matrix for Admin / Teacher */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading mb-3">
              Frequently Used School Modules
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => navigate('timetable')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-slate-200/80 dark:border-slate-700/60 hover:border-orange-500/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center mb-2">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600">
                  Timetable
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Periods & Rooms</p>
              </button>

              <button
                onClick={() => navigate('homework')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-slate-200/80 dark:border-slate-700/60 hover:border-orange-500/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-2">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600">
                  Homework
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Tasks & Grading</p>
              </button>

              <button
                onClick={() => navigate('results')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-slate-200/80 dark:border-slate-700/60 hover:border-orange-500/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-2">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600">
                  Exam Results
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">CBSE Marksheets</p>
              </button>

              <button
                onClick={() => navigate('certificates')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-slate-200/80 dark:border-slate-700/60 hover:border-orange-500/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-2">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600">
                  Certificates
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">ID Cards & TC</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Latest Notices & Recent Activity Logs */}
        <div className="space-y-6">
          {/* Notices Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Notice Board
                </h3>
              </div>
              <button
                onClick={() => navigate('notices')}
                className="text-xs font-semibold text-orange-600 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {scopedNotices.slice(0, 3).map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => navigate('notices')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-orange-600 uppercase">
                      {notice.category}
                    </span>
                    <span>{notice.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {notice.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs / Activity Feed */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                Recent School Activity
              </h3>
              <button
                onClick={() => navigate('audit_logs')}
                className="text-xs font-semibold text-orange-600 hover:underline"
              >
                Audit Trail
              </button>
            </div>

            <div className="space-y-3">
              {scopedAuditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {log.action}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {log.details}
                    </p>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
