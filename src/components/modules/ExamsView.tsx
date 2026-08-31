import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Award,
  Plus,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Exam, ExamScheduleItem } from '../../types';

interface ExamsViewProps {
  onNavigateToMarksEntry?: (examId: string) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({ onNavigateToMarksEntry }) => {
  const {
    currentUser,
    scopedExams,
    scopedClasses,
    scopedSubjects,
    addExam,
    addToast,
  } = useApp();

  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [selectedExamForSchedule, setSelectedExamForSchedule] = useState<Exam | null>(null);
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);

  // Add Exam form
  const [name, setName] = useState('Quarterly Term Assessment 2025');
  const [startDate, setStartDate] = useState('2025-10-10');
  const [endDate, setEndDate] = useState('2025-10-22');
  const [classIds, setClassIds] = useState<string[]>(scopedClasses.map((c) => c.id));

  // Schedule slot form
  const [subjectId, setSubjectId] = useState(scopedSubjects[0]?.id || '');
  const [examDate, setExamDate] = useState('2025-10-12');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [maxMarks, setMaxMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(35);
  const [roomNo, setRoomNo] = useState('Hall A');

  const canManage =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal';

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      addToast('Please fill all exam term details', 'error');
      return;
    }

    addExam({
      name,
      academicYear: '2025-2026',
      startDate,
      endDate,
      classIds,
      status: 'upcoming',
      schedule: [],
    });

    setIsAddExamModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Examinations & Assessment Schedules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure examination terms, test papers, and invigilation timetables
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddExamModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Exam Term</span>
          </button>
        )}
      </div>

      {/* Exam Term Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scopedExams.map((exam) => (
          <div
            key={exam.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-heading">
                      {exam.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Session {exam.academicYear} • {exam.startDate} to {exam.endDate}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    exam.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : exam.status === 'ongoing'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                  }`}
                >
                  {exam.status}
                </span>
              </div>

              {/* Schedule Table inside Exam */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Paper Schedule ({exam.schedule.length} Papers)
                </h4>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 text-[10px] uppercase font-bold">
                      <tr>
                        <th className="p-2.5">Subject</th>
                        <th className="p-2.5">Date & Time</th>
                        <th className="p-2.5 text-center">Max / Pass</th>
                        <th className="p-2.5 text-right">Hall</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {exam.schedule.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400">
                            No subject papers scheduled yet
                          </td>
                        </tr>
                      ) : (
                        exam.schedule.map((slot) => {
                          const subj = scopedSubjects.find((s) => s.id === slot.subjectId);
                          return (
                            <tr key={slot.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                                {subj ? subj.name : 'Subject'}
                              </td>
                              <td className="p-2.5 text-slate-600 dark:text-slate-400">
                                <div>{slot.date}</div>
                                <span className="text-[10px] text-slate-400">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                              </td>
                              <td className="p-2.5 text-center font-mono font-semibold">
                                {slot.maxMarks} / <span className="text-emerald-600">{slot.passingMarks}</span>
                              </td>
                              <td className="p-2.5 text-right text-slate-500 font-mono">
                                {slot.roomNo}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Applicable to {exam.classIds.length} Classes
              </span>

              {onNavigateToMarksEntry && (
                <button
                  onClick={() => onNavigateToMarksEntry(exam.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Enter / View Marks</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Exam Modal */}
      <Modal
        isOpen={isAddExamModalOpen}
        onClose={() => setIsAddExamModalOpen(false)}
        title="Create Examination Term"
        subtitle="Define examination window and participating classes"
        maxWidth="md"
      >
        <form onSubmit={handleSaveExam} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Assessment Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Half-Yearly Examinations 2025"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddExamModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md"
            >
              Create Exam Term
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
