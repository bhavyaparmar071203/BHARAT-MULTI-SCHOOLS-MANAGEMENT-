import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  GraduationCap,
  Briefcase,
  Layers,
  Bell,
  FileText,
  Library,
  ChevronRight,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string, itemId?: string) => void;
  onNavigate?: (tab: string, itemId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onNavigate,
}) => {
  const navigate = (tab: string, itemId?: string) => {
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(tab, itemId);
    } else if (typeof onNavigate === 'function') {
      onNavigate(tab, itemId);
    }
  };

  const {
    scopedStudents,
    scopedTeachers,
    scopedClasses,
    scopedNotices,
    scopedHomework,
    scopedBooks,
  } = useApp();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: string;
      tab: string;
      icon: any;
    }> = [];

    // Students
    scopedStudents.forEach((s) => {
      if (
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q)
      ) {
        results.push({
          id: s.id,
          title: s.name,
          subtitle: `Student · ${s.admissionNo} · Roll ${s.rollNo}`,
          category: 'Students',
          tab: 'students',
          icon: GraduationCap,
        });
      }
    });

    // Teachers
    scopedTeachers.forEach((t) => {
      if (
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.employeeId.toLowerCase().includes(q)
      ) {
        results.push({
          id: t.id,
          title: t.name,
          subtitle: `Teacher · ${t.employeeId} · ${t.designation || 'Faculty'}`,
          category: 'Teachers',
          tab: 'teachers',
          icon: Briefcase,
        });
      }
    });

    // Classes
    (scopedClasses || []).forEach((c) => {
      if ((c.name || '').toLowerCase().includes(q)) {
        results.push({
          id: c.id,
          title: c.name,
          subtitle: `Grade ${c.gradeLevel} · ${(c.sectionIds || []).length} Sections`,
          category: 'Classes',
          tab: 'classes',
          icon: Layers,
        });
      }
    });

    // Notices
    (scopedNotices || []).forEach((n) => {
      if ((n.title || '').toLowerCase().includes(q) || (n.description || '').toLowerCase().includes(q)) {
        results.push({
          id: n.id,
          title: n.title,
          subtitle: `Notice · ${n.date || ''} · For: ${n.targetAudience || 'Everyone'}`,
          category: 'Notices',
          tab: 'notices',
          icon: Bell,
        });
      }
    });

    // Homework
    (scopedHomework || []).forEach((h) => {
      if ((h.title || '').toLowerCase().includes(q) || (h.description || '').toLowerCase().includes(q)) {
        results.push({
          id: h.id,
          title: h.title,
          subtitle: `Homework · Due: ${h.dueDate || ''}`,
          category: 'Homework',
          tab: 'homework',
          icon: FileText,
        });
      }
    });

    // Books
    (scopedBooks || []).forEach((b) => {
      if ((b.title || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q) || (b.isbn || '').includes(q)) {
        results.push({
          id: b.id,
          title: b.title,
          subtitle: `Book · ${b.author} · ISBN: ${b.isbn || 'N/A'}`,
          category: 'Library',
          tab: 'library',
          icon: Library,
        });
      }
    });

    return results.slice(0, 12);
  }, [query, scopedStudents, scopedTeachers, scopedClasses, scopedNotices, scopedHomework, scopedBooks]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, staff, classes, notices, books..."
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Type keywords like <span className="font-semibold text-orange-600 dark:text-orange-400">"Rahul"</span>,{' '}
              <span className="font-semibold text-orange-600 dark:text-orange-400">"Class 10"</span>,{' '}
              <span className="font-semibold text-orange-600 dark:text-orange-400">"Physics"</span> to search your school data.
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching records found for "{query}" in this school.
            </div>
          ) : (
            searchResults.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.tab, item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/40">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
