import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  CalendarCheck,
  Calendar,
  FileText,
  Award,
  Receipt,
  Bell,
  FolderArchive,
  Library,
  Bus,
  BarChart3,
  History,
  Settings,
  X,
  FileCheck2,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const { currentUser, currentSchool, selectedChildId, setSelectedChildId, scopedStudents } = useApp();

  const role = currentUser?.role || 'school_admin';

  // Navigation Items per role
  const getNavItems = () => {
    switch (role) {
      case 'super_admin':
        return [
          { id: 'dashboard', label: 'Super Dashboard', icon: LayoutDashboard },
          { id: 'schools', label: 'School Directory', icon: Building2 },
          { id: 'users', label: 'Platform Users', icon: Users },
          { id: 'reports', label: 'Central Reports', icon: BarChart3 },
          { id: 'notices', label: 'System Circulars', icon: Bell },
          { id: 'logs', label: 'Platform Audit Trail', icon: History },
          { id: 'settings', label: 'Platform Settings', icon: Settings },
        ];

      case 'teacher':
        return [
          { id: 'dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'My Students', icon: GraduationCap },
          { id: 'attendance', label: 'Take Attendance', icon: CalendarCheck },
          { id: 'timetable', label: 'My Timetable', icon: Calendar },
          { id: 'homework', label: 'Homework Manager', icon: FileText },
          { id: 'results', label: 'Marks & Results', icon: Award },
          { id: 'notices', label: 'School Notices', icon: Bell },
          { id: 'documents', label: 'Study Documents', icon: FolderArchive },
        ];

      case 'student':
        return [
          { id: 'dashboard', label: 'Student Portal', icon: LayoutDashboard },
          { id: 'my-profile', label: 'My Profile', icon: GraduationCap },
          { id: 'attendance', label: 'My Attendance', icon: CalendarCheck },
          { id: 'timetable', label: 'Class Timetable', icon: Calendar },
          { id: 'homework', label: 'My Homework', icon: FileText },
          { id: 'exams', label: 'Exam Schedules', icon: Award },
          { id: 'results', label: 'Report Cards', icon: FileCheck2 },
          { id: 'fees', label: 'Fee Records', icon: Receipt },
          { id: 'notices', label: 'School Notices', icon: Bell },
          { id: 'certificates', label: 'ID Card & Certificates', icon: Award },
        ];

      case 'parent':
        return [
          { id: 'dashboard', label: 'Parent Portal', icon: LayoutDashboard },
          { id: 'my-profile', label: 'Child Profile', icon: GraduationCap },
          { id: 'attendance', label: 'Attendance Record', icon: CalendarCheck },
          { id: 'homework', label: 'Homework Tracker', icon: FileText },
          { id: 'results', label: 'Exam Results', icon: FileCheck2 },
          { id: 'fees', label: 'Fee Dues & Receipts', icon: Receipt },
          { id: 'timetable', label: 'Class Timetable', icon: Calendar },
          { id: 'notices', label: 'School Notices', icon: Bell },
          { id: 'certificates', label: 'Report Cards & Docs', icon: Award },
        ];

      case 'accountant':
        return [
          { id: 'dashboard', label: 'Finance Dashboard', icon: LayoutDashboard },
          { id: 'fees', label: 'Student Fee Records', icon: Receipt },
          { id: 'fee-structures', label: 'Fee Structures', icon: Layers },
          { id: 'students', label: 'Students Directory', icon: GraduationCap },
          { id: 'certificates', label: 'Payment Receipts', icon: FileCheck2 },
          { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
          { id: 'logs', label: 'Transactions Log', icon: History },
        ];

      case 'principal':
      case 'school_admin':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'teachers', label: 'Teachers & Staff', icon: Briefcase },
          { id: 'classes', label: 'Classes & Sections', icon: Layers },
          { id: 'subjects', label: 'Subjects', icon: BookOpen },
          { id: 'attendance', label: 'Attendance System', icon: CalendarCheck },
          { id: 'timetable', label: 'Timetable Manager', icon: Calendar },
          { id: 'homework', label: 'Homework & Tasks', icon: FileText },
          { id: 'exams', label: 'Examinations', icon: Award },
          { id: 'results', label: 'Results & Marks', icon: FileCheck2 },
          { id: 'fees', label: 'Fee Management', icon: Receipt },
          { id: 'notices', label: 'Notice Board', icon: Bell },
          { id: 'documents', label: 'Document Vault', icon: FolderArchive },
          { id: 'certificates', label: 'Certificates & ID', icon: Award },
          { id: 'library', label: 'Library Module', icon: Library },
          { id: 'transport', label: 'Transport Fleet', icon: Bus },
          { id: 'reports', label: 'Central Reports', icon: BarChart3 },
          { id: 'logs', label: 'Audit Activity Log', icon: History },
          { id: 'settings', label: 'School Settings', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-100 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header: Platform Identity & Mobile Close */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/40">
          <BrandLogo size="md" showTagline={true} inverted={true} />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tenant Identity Card (Inside School Account) */}
        {role !== 'super_admin' && currentSchool && (
          <div className="mx-3 mt-3.5 p-3 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black font-heading text-sm flex-shrink-0">
                {currentSchool.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate font-heading">{currentSchool.name}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-mono text-orange-400 bg-orange-950/50 px-1.5 py-0.2 rounded border border-orange-800/40">
                    {currentSchool.schoolCode}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">{currentSchool.city}</span>
                </div>
              </div>
            </div>

            {/* Parent Child Switcher if multiple kids */}
            {role === 'parent' && currentUser?.linkedStudentIds && currentUser.linkedStudentIds.length > 1 && (
              <div className="mt-2.5 pt-2 border-t border-slate-700/50">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Select Child Profile:
                </label>
                <select
                  value={selectedChildId || ''}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full text-xs bg-slate-950/80 border border-slate-700 text-white rounded-lg px-2 py-1.5 outline-none focus:border-orange-500 font-medium"
                >
                  {currentUser.linkedStudentIds.map((sid) => {
                    const student = scopedStudents.find((s) => s.id === sid);
                    return (
                      <option key={sid} value={sid}>
                        {student?.name || 'Student'} ({student?.admissionNo})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Super Admin Tenant Badge */}
        {role === 'super_admin' && (
          <div className="mx-3 mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-purple-950/40 border border-purple-800/50 shadow-md">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-purple-200">Global Administration</h4>
                <p className="text-[10px] text-slate-400">Managing All Affiliated Schools</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            {role === 'super_admin' ? 'Platform Modules' : 'School Management'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md shadow-orange-600/20 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-400 group-hover:scale-110'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </button>
            );
          })}
        </nav>

        {/* Footer info: Free platform guarantee */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <p className="text-[11px] font-bold text-orange-400 font-heading">BHARAT SCHOOLS ERP</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Free School Management</p>
          </div>
        </div>
      </aside>
    </>
  );
};
