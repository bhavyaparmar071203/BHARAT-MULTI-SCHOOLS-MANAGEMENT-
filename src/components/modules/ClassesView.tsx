import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Layers,
  Plus,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

interface ClassesViewProps {
  onSelectSection?: (classId: string, sectionId: string) => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({ onSelectSection }) => {
  const {
    currentUser,
    scopedClasses,
    scopedSections,
    scopedStudents,
    scopedTeachers,
    addClass,
    addSection,
    addToast,
  } = useApp();

  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);

  const [targetClassId, setTargetClassId] = useState<string>('');

  // Form states
  const [className, setClassName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('10');

  const [sectionName, setSectionName] = useState('B');
  const [roomNo, setRoomNo] = useState('Room 202');
  const [classTeacherId, setClassTeacherId] = useState('');

  const canManage =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal';

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className) {
      addToast('Please enter a class name', 'error');
      return;
    }
    addClass(className, Number(gradeLevel) || 1);
    setClassName('');
    setIsAddClassModalOpen(false);
  };

  const handleOpenAddSection = (classId: string) => {
    setTargetClassId(classId);
    setSectionName('B');
    setRoomNo('Room ' + Math.floor(100 + Math.random() * 300));
    setClassTeacherId(scopedTeachers[0]?.id || '');
    setIsAddSectionModalOpen(true);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName || !targetClassId) {
      addToast('Please specify section name', 'error');
      return;
    }
    addSection(targetClassId, sectionName, roomNo, classTeacherId);
    setIsAddSectionModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Academic Classes & Sections
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize grade levels, classrooms, and designated class teachers
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddClassModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Class</span>
          </button>
        )}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scopedClasses.map((cls) => {
          const sections = scopedSections.filter((s) => s.classId === cls.id);
          const totalClassStudents = scopedStudents.filter((s) => s.classId === cls.id).length;

          return (
            <div
              key={cls.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-heading">
                        {cls.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Grade Level: {cls.gradeLevel}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold font-mono">
                    {totalClassStudents} Students
                  </span>
                </div>

                {/* Sections List */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    <span>Configured Sections</span>
                    <span>Classroom</span>
                  </div>

                  {sections.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center italic">
                      No sections configured yet
                    </p>
                  ) : (
                    sections.map((sec) => {
                      const teacher = scopedTeachers.find((t) => t.id === sec.classTeacherId);
                      const secStudentsCount = scopedStudents.filter(
                        (s) => s.classId === cls.id && s.sectionId === sec.id
                      ).length;

                      return (
                        <div
                          key={sec.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-orange-600 dark:text-orange-400 text-sm font-heading">
                                Sec {sec.name}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                ({secStudentsCount} enrolled)
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Teacher: {teacher ? teacher.name : 'Unassigned'}
                            </p>
                          </div>

                          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-semibold">
                            {sec.roomNo || 'Room 101'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Add Section Action Button */}
              {canManage && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenAddSection(cls.id)}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section to {cls.name}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Class Modal */}
      <Modal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        title="Create Academic Class"
        subtitle="Define a grade standard (e.g. Class 11 - Science / Class 6)"
        maxWidth="md"
      >
        <form onSubmit={handleSaveClass} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Class Display Name *
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. Class 11 - Commerce"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Grade Standard (1 to 12)
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddClassModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md"
            >
              Create Class
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Section Modal */}
      <Modal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        title="Add Class Section"
        subtitle="Assign classroom number and designated Class Teacher"
        maxWidth="md"
      >
        <form onSubmit={handleSaveSection} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Section Label (e.g. A, B, C, D) *
            </label>
            <input
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="e.g. B"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 uppercase"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Classroom / Room Number
            </label>
            <input
              type="text"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              placeholder="e.g. Room 204"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Designated Class Teacher
            </label>
            <select
              value={classTeacherId}
              onChange={(e) => setClassTeacherId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
            >
              <option value="">Select Faculty</option>
              {scopedTeachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.designation || 'Teacher'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddSectionModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md"
            >
              Save Section
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
