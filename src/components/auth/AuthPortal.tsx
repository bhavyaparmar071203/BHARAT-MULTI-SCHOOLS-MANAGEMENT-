import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { UserRole } from '../../types';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Receipt,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';

export const AuthPortal: React.FC = () => {
  const {
    login,
    registerUser,
    registerSchool,
    schools,
    classes,
    sections,
    isDarkMode,
    toggleDarkMode,
    addToast,
  } = useApp();

  // Mode: 'login' | 'register_user' | 'register_school'
  const [activeTab, setActiveTab] = useState<'login' | 'register_user' | 'register_school'>('login');

  // --- LOGIN STATE ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showCredHelper, setShowCredHelper] = useState(false);

  // --- USER REGISTRATION STATE ---
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSchoolId, setRegSchoolId] = useState(schools[0]?.id || 'school_1');
  const [regClassId, setRegClassId] = useState(classes[0]?.id || 'cls_1');
  const [regSectionId, setRegSectionId] = useState(sections[0]?.id || 'sec_1');
  const [regRollNo, setRegRollNo] = useState('');
  const [regAdmissionNo, setRegAdmissionNo] = useState('');
  const [regDesignation, setRegDesignation] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regChildAdmissionNo, setRegChildAdmissionNo] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);

  // --- SCHOOL REGISTRATION STATE ---
  const [schoolStep, setSchoolStep] = useState<1 | 2>(1);
  const [schoolName, setSchoolName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [schoolCity, setSchoolCity] = useState('New Delhi');
  const [schoolState, setSchoolState] = useState('Delhi');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolAffiliation, setSchoolAffiliation] = useState('CBSE');
  const [schoolAffiliationNo, setSchoolAffiliationNo] = useState('');
  const [schoolEstYear, setSchoolEstYear] = useState('2025');
  const [schoolAdminName, setSchoolAdminName] = useState('');
  const [schoolAdminEmail, setSchoolAdminEmail] = useState('');
  const [schoolAdminPhone, setSchoolAdminPhone] = useState('');
  const [schoolAdminPassword, setSchoolAdminPassword] = useState('');
  const [showSchoolPassword, setShowSchoolPassword] = useState(false);
  const [isRegisteringSchool, setIsRegisteringSchool] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      addToast('Please enter your email address', 'error');
      return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
      const result = login(loginEmail, loginPassword);
      setIsLoggingIn(false);
    }, 250);
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      addToast('Please enter your registered email address', 'error');
      return;
    }
    addToast(`Password recovery link sent to ${forgotEmail}`, 'info');
    setIsForgotPassword(false);
  };

  // Handle User Registration Submit
  const handleUserRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone) {
      addToast('Please fill all mandatory fields', 'error');
      return;
    }
    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      addToast('Passwords do not match. Please verify.', 'error');
      return;
    }

    setIsRegisteringUser(true);
    setTimeout(() => {
      const res = registerUser({
        name: regName,
        email: regEmail,
        password: regPassword || 'password123',
        phone: regPhone,
        role: regRole,
        schoolId: regSchoolId,
        classId: regClassId,
        sectionId: regSectionId,
        rollNo: regRollNo,
        admissionNo: regAdmissionNo,
        designation: regDesignation,
        department: regDepartment,
        studentAdmissionNo: regChildAdmissionNo,
      });
      setIsRegisteringUser(false);
    }, 250);
  };

  // Handle School Registration Submit
  const handleSchoolRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolAdminName || !schoolAdminEmail || !schoolAdminPhone) {
      addToast('Please fill all administrator details', 'error');
      return;
    }

    setIsRegisteringSchool(true);
    setTimeout(() => {
      registerSchool({
        name: schoolName,
        schoolCode: schoolCode || ('BSM-' + Math.floor(100 + Math.random() * 900)),
        city: schoolCity,
        state: schoolState,
        address: schoolAddress,
        affiliationNo: schoolAffiliationNo || `${schoolAffiliation}/REG/2026`,
        establishedYear: Number(schoolEstYear) || 2025,
        adminName: schoolAdminName,
        adminEmail: schoolAdminEmail,
        adminPhone: schoolAdminPhone,
        adminPassword: schoolAdminPassword || 'password123',
      });
      setIsRegisteringSchool(false);
    }, 300);
  };

  // Fill sample credentials helper
  const handleQuickFillCred = (email: string, pass: string = 'password123') => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setShowCredHelper(false);
    addToast(`Credentials filled for ${email}`, 'info');
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col justify-between transition-colors duration-200">
      {/* Top Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" showTagline={true} />
        </div>

        <div className="flex items-center gap-2">
          {/* Default accounts helper for easy verification */}
          <button
            type="button"
            onClick={() => setShowCredHelper(!showCredHelper)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs"
            title="View registered account emails for login testing"
          >
            <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">Account Credentials Helper</span>
            <span className="sm:hidden">Help</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* Helper Modal Popover */}
      {showCredHelper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registered Account Directory</h3>
              </div>
              <button
                onClick={() => setShowCredHelper(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-3">
              Click any account below to autofill its email & default password (<code>password123</code>):
            </p>

            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              <div
                onClick={() => handleQuickFillCred('admin@sunrisepublic.edu.in')}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-orange-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">School Administrator</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">Sunrise Public</span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">admin@sunrisepublic.edu.in</p>
              </div>

              <div
                onClick={() => handleQuickFillCred('priya.sharma@sunrisepublic.edu.in')}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-orange-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Teacher (Class 10-A)</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">Priya Sharma</span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">priya.sharma@sunrisepublic.edu.in</p>
              </div>

              <div
                onClick={() => handleQuickFillCred('rahul.sharma@student.sunrisepublic.edu.in')}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-orange-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Student (Rahul Sharma)</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Roll #10</span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">rahul.sharma@student.sunrisepublic.edu.in</p>
              </div>

              <div
                onClick={() => handleQuickFillCred('suresh.sharma@parent.in')}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-orange-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Parent (Suresh Sharma)</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">Father</span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">suresh.sharma@parent.in</p>
              </div>

              <div
                onClick={() => handleQuickFillCred('superadmin@bharatschools.in')}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-orange-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Super Administrator</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">Platform Lead</span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">superadmin@bharatschools.in</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowCredHelper(false)}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-colors"
              >
                Close Helper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero Sidebar (Enterprise features) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                Enterprise Unified Portal
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight leading-snug">
                Empowering Bharat's Future with Smart Campus ERP
              </h2>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                A modern, high-performance School Management System tailored for CBSE, ICSE, and State Board institutions across India.
              </p>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Student & Academic Records</h4>
                    <p className="text-[11px] text-slate-400">Admissions, roll lists & report cards</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Smart Attendance & Timetables</h4>
                    <p className="text-[11px] text-slate-400">Instant class logs & period schedules</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Fee Management & Invoicing</h4>
                    <p className="text-[11px] text-slate-400">Automated receipts & dues tracking</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-[11px] text-slate-400">
              <span>Secure Multi-School ERP</span>
              <span className="text-emerald-400 font-bold">● System Online</span>
            </div>
          </div>

          {/* Right Forms Area */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Tab Navigation */}
              <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 mb-6 border border-slate-200 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setIsForgotPassword(false);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'login'
                      ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register_user');
                    setIsForgotPassword(false);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'register_user'
                      ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register_school');
                    setIsForgotPassword(false);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'register_school'
                      ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Register School
                </button>
              </div>

              {/* ----------------- TAB 1: SIGN IN ----------------- */}
              {activeTab === 'login' && (
                <div>
                  {isForgotPassword ? (
                    <form onSubmit={handleForgotSubmit} className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                          Reset Account Password
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Enter your registered email address to receive password reset instructions.
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Registered Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="e.g. name@school.edu.in"
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(false)}
                          className="w-1/2 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          Back to Sign In
                        </button>
                        <button
                          type="submit"
                          className="w-1/2 py-2.5 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-colors"
                        >
                          Send Recovery Link
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleLoginSubmit} className="space-y-3.5 animate-in fade-in duration-200">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                          Welcome Back
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Sign in with your registered email and password.
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="admin@sunrisepublic.edu.in"
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-slate-600 dark:text-slate-300">Keep me signed in</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full py-2.5 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {isLoggingIn ? (
                          <span>Verifying session...</span>
                        ) : (
                          <>
                            <span>Sign In to Dashboard</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ----------------- TAB 2: CREATE USER ACCOUNT ----------------- */}
              {activeTab === 'register_user' && (
                <form onSubmit={handleUserRegisterSubmit} className="space-y-3 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                      Create Your Account
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Register as a student, teacher, parent, or administrative staff.
                    </p>
                  </div>

                  {/* Role Selector Pills */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Select Role
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['student', 'teacher', 'parent', 'school_admin'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRegRole(r)}
                          className={`py-1.5 px-2 text-xs font-bold rounded-xl border capitalize transition-all ${
                            regRole === r
                              ? 'bg-orange-50 dark:bg-orange-950/60 border-orange-500 text-orange-700 dark:text-orange-300 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {r === 'school_admin' ? 'Admin' : r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* School Selector */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Select Institution
                    </label>
                    <select
                      value={regSchoolId}
                      onChange={(e) => setRegSchoolId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                    >
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. rahul.sharma@example.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  {/* Role Specific Fields */}
                  {regRole === 'student' && (
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Class
                        </label>
                        <select
                          value={regClassId}
                          onChange={(e) => setRegClassId(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                        >
                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          value={regRollNo}
                          onChange={(e) => setRegRollNo(e.target.value)}
                          placeholder="e.g. 15"
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  )}

                  {regRole === 'teacher' && (
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Designation
                        </label>
                        <input
                          type="text"
                          value={regDesignation}
                          onChange={(e) => setRegDesignation(e.target.value)}
                          placeholder="e.g. Mathematics PGT"
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          value={regDepartment}
                          onChange={(e) => setRegDepartment(e.target.value)}
                          placeholder="e.g. Science Department"
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  )}

                  {regRole === 'parent' && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Child's Admission Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={regChildAdmissionNo}
                        onChange={(e) => setRegChildAdmissionNo(e.target.value)}
                        placeholder="e.g. ADM-1001"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                      />
                    </div>
                  )}

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Password
                      </label>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Confirm Password
                      </label>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRegisteringUser}
                    className="w-full mt-2 py-2.5 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isRegisteringUser ? (
                      <span>Creating profile...</span>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ----------------- TAB 3: REGISTER NEW SCHOOL ----------------- */}
              {activeTab === 'register_school' && (
                <form onSubmit={handleSchoolRegisterSubmit} className="space-y-3 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                      Register Your Institution
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Onboard your school to Bharat Schools Unified ERP platform.
                    </p>
                  </div>

                  {/* Step indicators */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`flex-1 h-1.5 rounded-full transition-colors ${
                        schoolStep >= 1 ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                    <div
                      className={`flex-1 h-1.5 rounded-full transition-colors ${
                        schoolStep >= 2 ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  </div>

                  {schoolStep === 1 ? (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          School / College Name *
                        </label>
                        <input
                          type="text"
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          placeholder="e.g. Modern Public Academy"
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            Board / Affiliation
                          </label>
                          <select
                            value={schoolAffiliation}
                            onChange={(e) => setSchoolAffiliation(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                          >
                            <option value="CBSE">CBSE (Central Board)</option>
                            <option value="ICSE">ICSE / ISC</option>
                            <option value="State Board">State Secondary Board</option>
                            <option value="IB">IB / International</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            School Code (Optional)
                          </label>
                          <input
                            type="text"
                            value={schoolCode}
                            onChange={(e) => setSchoolCode(e.target.value)}
                            placeholder="e.g. MPA-DEL-03"
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            value={schoolCity}
                            onChange={(e) => setSchoolCity(e.target.value)}
                            placeholder="e.g. Jaipur"
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            value={schoolState}
                            onChange={(e) => setSchoolState(e.target.value)}
                            placeholder="e.g. Rajasthan"
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Campus Address
                        </label>
                        <input
                          type="text"
                          value={schoolAddress}
                          onChange={(e) => setSchoolAddress(e.target.value)}
                          placeholder="Plot 4, Institutional Area, Sector 5"
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!schoolName || !schoolCity) {
                            addToast('Please provide the institution name and city', 'error');
                            return;
                          }
                          setSchoolStep(2);
                        }}
                        className="w-full mt-2 py-2.5 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span>Next: Administrator Setup</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Administrator Full Name *
                        </label>
                        <input
                          type="text"
                          value={schoolAdminName}
                          onChange={(e) => setSchoolAdminName(e.target.value)}
                          placeholder="e.g. Dr. Ramesh Chander"
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            Official Email *
                          </label>
                          <input
                            type="email"
                            value={schoolAdminEmail}
                            onChange={(e) => setSchoolAdminEmail(e.target.value)}
                            placeholder="admin@modernacademy.edu.in"
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={schoolAdminPhone}
                            onChange={(e) => setSchoolAdminPhone(e.target.value)}
                            placeholder="+91 98112 00000"
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Administrator Password
                        </label>
                        <div className="relative">
                          <input
                            type={showSchoolPassword ? 'text' : 'password'}
                            value={schoolAdminPassword}
                            onChange={(e) => setSchoolAdminPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSchoolPassword(!showSchoolPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showSchoolPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSchoolStep(1)}
                          className="w-1/3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isRegisteringSchool}
                          className="w-2/3 py-2.5 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          {isRegisteringSchool ? (
                            <span>Provisioning school...</span>
                          ) : (
                            <>
                              <span>Launch School ERP</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Bottom Status / Policy Notice */}
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Encrypted Session • GDPR & NEP 2020 Compliant</span>
              <span>Bharat Schools v2.4</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 Bharat Schools Unified Management Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};
