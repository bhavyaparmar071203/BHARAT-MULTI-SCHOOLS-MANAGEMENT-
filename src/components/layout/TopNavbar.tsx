import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Settings,
  Building2,
  CheckCircle2,
  Menu,
} from 'lucide-react';
import { UserRole } from '../../types';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  currentPageTitle?: string;
  activeNav?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleSidebar,
  onToggleMobileSidebar,
  onOpenSearch,
  onOpenNotifications,
  onOpenSettings,
  onOpenProfile,
  currentPageTitle,
  activeNav,
}) => {
  const {
    currentUser,
    currentSchool,
    schools,
    activeSchoolId,
    setActiveSchoolId,
    logout,
    isDarkMode,
    toggleDarkMode,
    scopedNotifications,
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSchoolScope, setShowSchoolScope] = useState(false);

  const toggleSidebarFn = onToggleSidebar || onToggleMobileSidebar || (() => {});

  const displayTitle =
    currentPageTitle ||
    (activeNav
      ? activeNav
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Dashboard');

  const unreadCount = scopedNotifications.filter((n) => !n.isRead).length;

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
    school_admin: { label: 'School Admin', color: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
    principal: { label: 'Principal', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
    teacher: { label: 'Teacher', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    student: { label: 'Student', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    parent: { label: 'Parent', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
    accountant: { label: 'Accountant', color: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
  };

  const currentRoleInfo = currentUser ? roleLabels[currentUser.role] : { label: 'Guest', color: 'bg-slate-100 text-slate-800' };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggleSidebarFn}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-500 uppercase tracking-wider hidden sm:inline">
              {currentUser?.role === 'super_admin'
                ? 'Central Super Admin Console'
                : currentSchool?.name || 'Bharat Schools'}
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-heading truncate max-w-[200px] sm:max-w-xs md:max-w-none">
              {displayTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Center: Global Search Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:border-orange-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
            <span className="text-slate-500 dark:text-slate-400">Search students, teachers, notices, classes...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: School Context (Super Admin), Notifications, Dark Mode & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Super Admin School Scope Selector */}
        {currentUser?.role === 'super_admin' && (
          <div className="relative">
            <button
              onClick={() => {
                setShowSchoolScope(!showSchoolScope);
                setShowProfileMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all shadow-xs"
              title="Filter by School"
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden md:inline font-bold">
                {activeSchoolId ? schools.find((s) => s.id === activeSchoolId)?.name || 'Filtered' : 'All Institutions'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showSchoolScope && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSchoolScope(false)} />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Multi-School Scope Filter
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Select an institution to view filtered operations.
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveSchoolId(null);
                        setShowSchoolScope(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                        !activeSchoolId
                          ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span>All Institutions (Global Overview)</span>
                      {!activeSchoolId && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                    </button>
                    {schools.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveSchoolId(s.id);
                          setShowSchoolScope(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                          activeSchoolId === s.id
                            ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.city}, {s.state}</p>
                        </div>
                        {activeSchoolId === s.id && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Mobile Search Icon */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* In-app Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-extrabold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowSchoolScope(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.name || 'User'}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                {currentUser?.name || 'User'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-none">
                {currentRoleInfo.label}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:inline" />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{currentUser?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                  <div className={`mt-2 inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md border ${currentRoleInfo.color}`}>
                    {currentRoleInfo.label}
                  </div>
                </div>

                {/* Actions */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      onOpenProfile();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      onOpenSettings();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    School & Account Settings
                  </button>
                  <button
                    onClick={() => {
                      onOpenNotifications();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Bell className="w-4 h-4 text-slate-400" />
                    Notification Center
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
