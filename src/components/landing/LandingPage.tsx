import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  CalendarCheck,
  Calendar,
  FileText,
  Award,
  Receipt,
  Users,
  Bus,
  Library,
  FolderArchive,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
  Globe2,
  ChevronRight,
  Layers,
  UserCheck,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
}) => {
  const rolePortals = [
    {
      title: 'School Administrator',
      desc: 'Complete campus operations, student admissions, staff management, fee records, and timetables.',
      icon: Building2,
      badge: 'Institution Lead',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300',
    },
    {
      title: 'Class & Subject Teachers',
      desc: 'Digital daily attendance marking, homework distribution, syllabus tracking, and exam mark entry.',
      icon: Users,
      badge: 'Faculty',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300',
    },
    {
      title: 'Student Portal',
      desc: 'View live weekly period timetables, homework assignments, exam schedules, and CBSE report cards.',
      icon: GraduationCap,
      badge: 'Learner',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
    },
    {
      title: 'Parent & Guardian Portal',
      desc: 'Track your child’s daily attendance, homework completion status, and official fee payment receipts.',
      icon: UserCheck,
      badge: 'Guardian',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
    },
    {
      title: 'Accounts & Finance Desk',
      desc: 'Fee category structures, installment tracking, instant receipt generation, and collection ledger.',
      icon: Receipt,
      badge: 'Finance',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300',
    },
    {
      title: 'Super Administrator',
      desc: 'Platform-wide oversight, multi-school onboarding, security compliance, and comprehensive audit logs.',
      icon: ShieldCheck,
      badge: 'Platform Control',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300',
    },
  ];

  const modulesList = [
    { title: 'Student Information System', desc: 'Comprehensive admission records, roll numbers, parent links, and document vault.', icon: GraduationCap },
    { title: 'Smart Attendance Register', desc: 'Daily one-click attendance tracking with instant stats and leave logs.', icon: CalendarCheck },
    { title: 'Academic Timetable Matrix', desc: 'Interactive weekly grid for class periods, rooms, and faculty schedules.', icon: Calendar },
    { title: 'Digital Homework Desk', desc: 'Structured assignments with due dates, attachments, and submission tracking.', icon: FileText },
    { title: 'CBSE / State Exam Engine', desc: 'Schedules, max/passing marks, automated percentage, grade calculation, and report cards.', icon: Award },
    { title: 'Fee Records & Invoices', desc: 'Transparent fee structures, payment logging, and print-ready receipts without paywalls.', icon: Receipt },
    { title: 'Multi-Channel Notice Board', desc: 'Role-targeted circulars for students, teachers, parents, or school-wide broadcasts.', icon: FileText },
    { title: 'Library Catalog Management', desc: 'ISBN tracking, book issuance, return logs, overdue fines, and availability tracker.', icon: Library },
    { title: 'Transport Fleet Tracking', desc: 'Vehicle registrations, routes, driver contacts, and student pick-up allocations.', icon: Bus },
    { title: 'Print-Ready ID & Certificates', desc: 'Automated student ID cards, transfer certificates, and official marksheets.', icon: Award },
    { title: 'Document & Resource Vault', desc: 'Syllabus, circulars, assignments, and study materials in one secure repository.', icon: FolderArchive },
    { title: 'Multi-Tenant Security', desc: 'Strict database isolation guaranteeing School A can never view School B data.', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo size="md" showTagline={true} />

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Modules
            </a>
            <a href="#roles" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              User Portals
            </a>
            <a href="#isolation" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Multi-Tenancy
            </a>
            <a href="#faq" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              Register School Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="absolute w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none -top-40 left-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/60 text-orange-700 dark:text-orange-300 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>100% Free Multi-School Platform for Indian Education</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading max-w-4xl mx-auto leading-tight">
            Next-Generation <span className="text-orange-600 dark:text-orange-500">Multi-School</span> ERP System
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Empowering schools across Bharat with a free, high-performance platform for attendance, timetables, CBSE report cards, fee records, student dossiers, and parent collaboration.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenLogin}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/25 transition-all flex items-center gap-2 group"
            >
              <span>Sign In to Your Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onOpenRegister}
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-xs transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-orange-600" />
              <span>Onboard Your School (Free)</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-xl sm:text-2xl font-black text-orange-600 font-heading">100% Free</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">No ads, no billing limits</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">Multi-Tenant</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Isolated school databases</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-xl sm:text-2xl font-black text-emerald-600 font-heading">6 Portals</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Admin, Teacher, Parent & more</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-xl sm:text-2xl font-black text-blue-600 font-heading">CBSE & State</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Standard grading & cards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Portals Section */}
      <section id="roles" className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Unified Platform
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
              Dedicated Portals for Every Stakeholder
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Tailored workspaces with dedicated permissions, automated notifications, and real-time reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rolePortals.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-orange-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <button
                    onClick={onOpenLogin}
                    className="mt-5 w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60 dark:border-slate-700/60 group"
                  >
                    <span>Sign In to Portal</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comprehensive Modules Grid */}
      <section id="features" className="py-16 sm:py-20 border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              End-to-End Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
              Built for Modern Campus Administration
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Every tool your academic, operational, and financial team needs to run smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulesList.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/40 dark:border-orange-800/30 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">{m.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Multi-Tenant Zero-Leak Security Guarantee */}
      <section id="isolation" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-700/60 text-orange-400 text-xs font-bold mb-4">
                <Lock className="w-3.5 h-3.5" />
                <span>Strict Architectural Multi-Tenancy</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight">
                Complete Isolation Between Institutions
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every record in Bharat Schools Management is strictly tied to a unique <code className="text-orange-400 font-mono">school_id</code>. A teacher, student, or admin from Sunrise Public School can never query, see, or modify records belonging to Green Valley School.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Scoped database indexes ensuring zero cross-tenant leakage</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Role-Based Access Control (RBAC) across 6 distinct personas</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Immutable audit logs recording every creation, update, and fee receipt</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>TENANT_ISOLATION_CHECK</span>
                <span className="text-emerald-400 font-bold">STATUS: ENFORCED</span>
              </div>
              <div className="mt-4 space-y-3 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-orange-500/30">
                  <p className="text-orange-400 font-bold">SCHOOL_A (Sunrise Public School):</p>
                  <p className="text-slate-400">Students: 1,240 | Teachers: 48 | Fees: Isolated</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30">
                  <p className="text-emerald-400 font-bold">SCHOOL_B (Green Valley School):</p>
                  <p className="text-slate-400">Students: 850 | Teachers: 34 | Fees: Isolated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">Everything you need to know about Bharat Schools ERP</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Is this platform really 100% free with no hidden charges?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Yes. There are no subscriptions, ads, credit card requirements, or paywalled features. Any recognized school in India can register and manage their students for free.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Does it support Indian board grading (CBSE, ICSE, State Boards)?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Yes. The examination module supports customizable maximum marks, passing percentages, letter grades (A1 to E), and formatted printable report cards.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Can parents view attendance and homework on mobile?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Yes, the parent portal is fully responsive and allows guardians to monitor daily attendance, homework deadlines, and download payment receipts on smartphones.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo size="md" showTagline={true} />
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-right">
            © {new Date().getFullYear()} Bharat Schools Management · Free Educational Infrastructure for India.
          </p>
        </div>
      </footer>
    </div>
  );
};
