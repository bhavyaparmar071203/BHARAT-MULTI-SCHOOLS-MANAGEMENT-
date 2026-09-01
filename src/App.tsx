import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { SplashScreen } from './components/common/SplashScreen';
import { AuthPortal } from './components/auth/AuthPortal';

// Modules
import { DashboardView } from './components/modules/DashboardView';
import { StudentsView } from './components/modules/StudentsView';
import { TeachersView } from './components/modules/TeachersView';
import { AttendanceView } from './components/modules/AttendanceView';
import { ClassesView } from './components/modules/ClassesView';
import { SubjectsView } from './components/modules/SubjectsView';
import { TimetableView } from './components/modules/TimetableView';
import { HomeworkView } from './components/modules/HomeworkView';
import { ExamsView } from './components/modules/ExamsView';
import { ResultsView } from './components/modules/ResultsView';
import { FeesView } from './components/modules/FeesView';
import { NoticesView } from './components/modules/NoticesView';
import { DocumentsView } from './components/modules/DocumentsView';
import { LibraryView } from './components/modules/LibraryView';
import { TransportView } from './components/modules/TransportView';
import { ReportsView } from './components/modules/ReportsView';
import { CertificatesView } from './components/modules/CertificatesView';
import { SettingsView } from './components/modules/SettingsView';
import { AuditLogsView } from './components/modules/AuditLogsView';

const MainLayout: React.FC = () => {
  const { currentSchool, currentUser, theme } = useApp();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | undefined>(undefined);

  // Sync theme class to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Global keyboard shortcut: Ctrl+K or Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (navId: string) => {
    setActiveNav(navId);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderModuleView = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} onNavigateTab={handleNavigate} />;
      case 'students':
        return <StudentsView />;
      case 'teachers':
        return <TeachersView />;
      case 'attendance':
        return <AttendanceView />;
      case 'classes':
        return <ClassesView />;
      case 'subjects':
        return <SubjectsView />;
      case 'timetable':
        return <TimetableView />;
      case 'homework':
        return <HomeworkView />;
      case 'exams':
        return (
          <ExamsView
            onNavigateToMarksEntry={(examId) => {
              setSelectedExamId(examId);
              setActiveNav('results');
            }}
          />
        );
      case 'results':
        return <ResultsView initialExamId={selectedExamId} />;
      case 'fees':
        return <FeesView />;
      case 'notices':
        return <NoticesView />;
      case 'documents':
        return <DocumentsView />;
      case 'library':
        return <LibraryView />;
      case 'transport':
        return <TransportView />;
      case 'reports':
        return <ReportsView />;
      case 'certificates':
        return <CertificatesView />;
      case 'settings':
        return <SettingsView />;
      case 'audit_logs':
        return <AuditLogsView />;
      default:
        return <DashboardView onNavigate={handleNavigate} onNavigateTab={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notifications Layer */}
      <ToastContainer />

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateTab={(tab) => handleNavigate(tab)}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={(tab) => handleNavigate(tab)}
      />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeNav={activeNav}
          currentTab={activeNav}
          onNavigate={handleNavigate}
          onSelectTab={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          isOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* Top Navbar */}
          <TopNavbar
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
            onOpenSettings={() => handleNavigate('settings')}
            onOpenProfile={() => handleNavigate('settings')}
            onNavigate={handleNavigate}
            activeNav={activeNav}
          />

          {/* Body Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderModuleView()}
          </main>

          {/* Footer */}
          <footer className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                BHARAT SCHOOLS MANAGEMENT
              </span>
              <span>•</span>
              <span>Smart School Management</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="font-mono">
                Tenant: {currentSchool?.code}
              </span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Free Multi-School Platform</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return (
      <>
        <ToastContainer />
        <AuthPortal />
      </>
    );
  }

  return <MainLayout />;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppProvider>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <AppContent />
      )}
    </AppProvider>
  );
}
