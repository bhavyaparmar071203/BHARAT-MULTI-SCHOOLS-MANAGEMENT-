import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Users,
  Calendar,
  Sparkles,
  Search,
  Download,
} from 'lucide-react';
import { AttendanceStatus } from '../../types';

export const AttendanceView: React.FC = () => {
  const {
    currentUser,
    scopedStudents,
    scopedClasses,
    scopedSections,
    scopedAttendance,
    saveAttendance,
    addToast,
  } = useApp();

  const isTeacher = currentUser?.role === 'teacher';
  const isParent = currentUser?.role === 'parent';
  const isStudent = currentUser?.role === 'student';

  // Default selection
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );

  // Local attendance grid state: studentId -> { status, remark }
  const [attendanceSheet, setAttendanceSheet] = useState<
    Record<string, { status: AttendanceStatus; remark: string }>
  >({});

  // Initialize default class and section on mount
  useEffect(() => {
    if (scopedClasses.length > 0 && !selectedClassId) {
      const firstClass = scopedClasses[0];
      setSelectedClassId(firstClass.id);
      const firstSec = scopedSections.find((s) => s.classId === firstClass.id);
      if (firstSec) setSelectedSectionId(firstSec.id);
    }
  }, [scopedClasses, scopedSections, selectedClassId]);

  // Target students for the chosen class/section
  const targetStudents = useMemo(() => {
    return scopedStudents.filter(
      (s) => s.classId === selectedClassId && s.sectionId === selectedSectionId
    );
  }, [scopedStudents, selectedClassId, selectedSectionId]);

  // Load existing attendance record for selected date or initialize all to 'present'
  useEffect(() => {
    const existingRecord = scopedAttendance.find(
      (a) =>
        a.classId === selectedClassId &&
        a.sectionId === selectedSectionId &&
        a.date === selectedDate
    );

    const initialMap: Record<string, { status: AttendanceStatus; remark: string }> = {};

    (targetStudents || []).forEach((student) => {
      if (existingRecord && Array.isArray(existingRecord.records)) {
        const found = existingRecord.records.find((r) => r && r.studentId === student.id);
        if (found) {
          initialMap[student.id] = {
            status: found.status,
            remark: found.remark || '',
          };
          return;
        }
      }
      initialMap[student.id] = { status: 'present', remark: '' };
    });

    setAttendanceSheet(initialMap);
  }, [selectedClassId, selectedSectionId, selectedDate, scopedAttendance, targetStudents]);

  // Bulk actions
  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; remark: string }> = {};
    targetStudents.forEach((s) => {
      updated[s.id] = { status, remark: attendanceSheet[s.id]?.remark || '' };
    });
    setAttendanceSheet(updated);
    addToast(`All students marked as ${status.toUpperCase()}`, 'info');
  };

  const handleToggleStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceSheet((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setAttendanceSheet((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remark,
      },
    }));
  };

  const handleSave = () => {
    if (!selectedClassId || !selectedSectionId) {
      addToast('Please select a Class and Section', 'error');
      return;
    }

    const records = targetStudents.map((s) => ({
      studentId: s.id,
      status: attendanceSheet[s.id]?.status || 'present',
      remark: attendanceSheet[s.id]?.remark || '',
    }));

    saveAttendance(selectedClassId, selectedSectionId, selectedDate, records);
  };

  const handleExportCSV = () => {
    if (targetStudents.length === 0) {
      addToast('No students to export for the selected class/section', 'warning');
      return;
    }

    const clsName = scopedClasses.find((c) => c.id === selectedClassId)?.name || 'Class';
    const secName = scopedSections.find((s) => s.id === selectedSectionId)?.name || 'Section';
    const headers = ['Roll No', 'Student Name', 'Admission No', 'Class', 'Section', 'Date', 'Status', 'Remark'];
    
    const rows = targetStudents.map((st) => {
      const rec = attendanceSheet[st.id] || { status: 'present', remark: '' };
      return [
        `"${st.rollNo}"`,
        `"${st.name}"`,
        `"${st.admissionNo}"`,
        `"${clsName}"`,
        `"${secName}"`,
        `"${selectedDate}"`,
        `"${rec.status.toUpperCase()}"`,
        `"${rec.remark || ''}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${clsName}_Sec${secName}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(`Exported attendance sheet (${targetStudents.length} students) to CSV`, 'success');
  };

  // Summary counts
  const sheetValues = Object.values(attendanceSheet) as { status: AttendanceStatus; remark: string }[];
  const presentCount = sheetValues.filter((a) => a.status === 'present').length;
  const absentCount = sheetValues.filter((a) => a.status === 'absent').length;
  const lateCount = sheetValues.filter((a) => a.status === 'late').length;
  const halfDayCount = sheetValues.filter((a) => a.status === 'half_day').length;
  const totalCount = targetStudents.length;
  const rate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Daily Attendance Register
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Record, monitor, and publish daily student attendance
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5"
            title="Download CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Register CSV</span>
          </button>

          {!isStudent && !isParent && (
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Attendance</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Toolbar: Class, Section, Date Selectors */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Academic Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                const firstSec = scopedSections.find((s) => s.classId === e.target.value);
                if (firstSec) setSelectedSectionId(firstSec.id);
              }}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold"
            >
              {scopedClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Section
            </label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold"
            >
              {scopedSections
                .filter((s) => s.classId === selectedClassId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    Section {s.name} (Room {s.roomNo})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold"
            />
          </div>
        </div>

        {/* Bulk Action Buttons */}
        {!isStudent && !isParent && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMarkAll('present')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('absent')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 transition-colors"
            >
              Mark All Absent
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Students</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
            {totalCount}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">Present</span>
          <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 font-heading">
            {presentCount}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 block">Absent</span>
          <span className="text-xl font-extrabold text-rose-700 dark:text-rose-300 font-heading">
            {absentCount}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">Late / Half Day</span>
          <span className="text-xl font-extrabold text-amber-700 dark:text-amber-300 font-heading">
            {lateCount + halfDayCount}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-orange-700 dark:text-orange-400 block">Presence Rate</span>
          <span className="text-xl font-extrabold text-orange-700 dark:text-orange-300 font-heading">
            {rate}%
          </span>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Roll No</th>
                <th className="px-4 py-3.5">Student Name</th>
                <th className="px-4 py-3.5">Admission No</th>
                <th className="px-4 py-3.5 text-center">Status Selector</th>
                <th className="px-4 py-3.5">Teacher Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {targetStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    <CalendarCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-sm">No students found in this Section</p>
                  </td>
                </tr>
              ) : (
                targetStudents.map((student) => {
                  const currentStatus = attendanceSheet[student.id]?.status || 'present';
                  const currentRemark = attendanceSheet[student.id]?.remark || '';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        #{student.rollNo}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              student.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                            }
                            alt={student.name}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">{student.name}</p>
                            <p className="text-[10px] text-slate-400">Parent: {student.parentName}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {student.admissionNo}
                      </td>

                      {/* Status Toggle Buttons */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(student.id, 'present')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            P
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(student.id, 'absent')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            A
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(student.id, 'late')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                          >
                            L
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(student.id, 'half_day')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'half_day'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                          >
                            HD
                          </button>
                        </div>
                      </td>

                      {/* Remark Input */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={currentRemark}
                          onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                          placeholder="Optional notes (e.g. sick leave)..."
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-orange-500"
                        />
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
  );
};
