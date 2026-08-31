import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  CalendarCheck,
  Plus,
  Clock,
  Printer,
  BookOpen,
  User,
  Building2,
  Trash2,
} from 'lucide-react';
import { TimetableEntry } from '../../types';

export const TimetableView: React.FC = () => {
  const {
    currentUser,
    scopedClasses,
    scopedSections,
    scopedSubjects,
    scopedTeachers,
    scopedTimetable,
    addTimetableEntry,
    deleteTimetableEntry,
    addToast,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(scopedClasses[0]?.id || '');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    scopedSections.find((s) => s.classId === scopedClasses[0]?.id)?.id || ''
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add slot form
  const [day, setDay] = useState<string>('Monday');
  const [periodNumber, setPeriodNumber] = useState<number>(1);
  const [subjectId, setSubjectId] = useState<string>(scopedSubjects[0]?.id || '');
  const [teacherId, setTeacherId] = useState<string>(scopedTeachers[0]?.id || '');
  const [roomNo, setRoomNo] = useState<string>('Room 101');
  const [startTime, setStartTime] = useState<string>('08:30');
  const [endTime, setEndTime] = useState<string>('09:15');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periodSlots = [
    { period: 1, time: '08:30 - 09:15' },
    { period: 2, time: '09:15 - 10:00' },
    { period: 3, time: '10:00 - 10:45' },
    { period: 4, time: '11:00 - 11:45' },
    { period: 5, time: '11:45 - 12:30' },
    { period: 6, time: '13:00 - 13:45' },
    { period: 7, time: '13:45 - 14:30' },
  ];

  const canManage =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal';

  const handleOpenAdd = (dayName?: string, pNum?: number) => {
    if (dayName) setDay(dayName);
    if (pNum) setPeriodNumber(pNum);
    setSubjectId(scopedSubjects[0]?.id || '');
    setTeacherId(scopedTeachers[0]?.id || '');
    setRoomNo('Room 101');
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !selectedSectionId || !subjectId || !teacherId) {
      addToast('Please fill all schedule fields', 'error');
      return;
    }

    addTimetableEntry({
      classId: selectedClassId,
      sectionId: selectedSectionId,
      day: day as any,
      periodNumber: Number(periodNumber),
      subjectId,
      teacherId,
      roomNo,
      startTime,
      endTime,
    });

    setIsAddModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Academic Schedule & Timetable
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Weekly period allocations, classrooms, and teacher routines
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Routine</span>
          </button>

          {canManage && (
            <button
              onClick={() => handleOpenAdd()}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Period Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* Class & Section Selectors */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Class:</label>
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              const firstSec = scopedSections.find((s) => s.classId === e.target.value);
              if (firstSec) setSelectedSectionId(firstSec.id);
            }}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:border-orange-500"
          >
            {scopedClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Section:</label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:border-orange-500"
          >
            {scopedSections
              .filter((s) => s.classId === selectedClassId)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  Section {s.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Weekly Matrix Schedule Grid */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 w-28 border-r border-slate-200 dark:border-slate-800">Day</th>
                {periodSlots.map((slot) => (
                  <th key={slot.period} className="p-3 text-center border-r border-slate-200 dark:border-slate-800 last:border-r-0">
                    <div>Period {slot.period}</div>
                    <span className="text-[9px] font-normal lowercase opacity-75">{slot.time}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {days.map((d) => (
                <tr key={d} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30 border-r border-slate-200 dark:border-slate-800">
                    {d}
                  </td>
                  {periodSlots.map((slot) => {
                    const entry = scopedTimetable.find(
                      (t) =>
                        t.classId === selectedClassId &&
                        t.sectionId === selectedSectionId &&
                        t.day.toLowerCase() === d.toLowerCase() &&
                        t.periodNumber === slot.period
                    );

                    const subj = entry ? scopedSubjects.find((s) => s.id === entry.subjectId) : null;
                    const teacher = entry ? scopedTeachers.find((t) => t.id === entry.teacherId) : null;

                    return (
                      <td
                        key={slot.period}
                        className="p-2 border-r border-slate-200 dark:border-slate-800 last:border-r-0 align-top min-w-[120px]"
                      >
                        {entry ? (
                          <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/70 dark:border-orange-800/40 relative group">
                            <p className="font-bold text-orange-900 dark:text-orange-200 text-xs">
                              {subj ? subj.name : 'Subject'}
                            </p>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                              {teacher ? teacher.name : 'Teacher'}
                            </p>
                            <span className="text-[9px] font-mono text-orange-600 dark:text-orange-400 block mt-0.5">
                              {entry.roomNo || 'Room 101'}
                            </span>

                            {canManage && (
                              <button
                                onClick={() => deleteTimetableEntry(entry.id)}
                                className="absolute right-1 top-1 p-1 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-100 rounded transition-opacity"
                                title="Remove Slot"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : canManage ? (
                          <button
                            onClick={() => handleOpenAdd(d, slot.period)}
                            className="w-full h-14 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-orange-500/60 text-slate-300 dark:text-slate-700 hover:text-orange-500 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="h-14 flex items-center justify-center text-slate-300 text-[10px]">
                            —
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Period Slot Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Class Period"
        subtitle="Allocate subject, teacher, and room for weekly routine"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Day of Week
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Period (1 - 7)
              </label>
              <select
                value={periodNumber}
                onChange={(e) => setPeriodNumber(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold"
              >
                {periodSlots.map((p) => (
                  <option key={p.period} value={p.period}>
                    Period {p.period} ({p.time})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Subject *
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold"
            >
              {scopedSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Assigned Teacher *
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold"
            >
              {scopedTeachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.designation || 'Teacher'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Classroom / Laboratory
            </label>
            <input
              type="text"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              placeholder="e.g. Physics Lab 1"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md"
            >
              Schedule Slot
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
