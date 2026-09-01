import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  FileSpreadsheet,
  Save,
  Send,
  Printer,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { ExamResult } from '../../types';

interface ResultsViewProps {
  initialExamId?: string;
  onOpenReportCard?: (studentId: string, examId: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  initialExamId,
  onOpenReportCard,
}) => {
  const {
    currentUser,
    scopedExams,
    scopedClasses,
    scopedSections,
    scopedSubjects,
    scopedStudents,
    scopedExamResults,
    saveExamResult,
    publishExamResults,
    addToast,
  } = useApp();

  const [selectedExamId, setSelectedExamId] = useState<string>(
    initialExamId || scopedExams[0]?.id || ''
  );
  const [selectedClassId, setSelectedClassId] = useState<string>(scopedClasses[0]?.id || '');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    scopedSections.find((s) => s.classId === scopedClasses[0]?.id)?.id || ''
  );

  // Local marksheet state: studentId -> { subjectId -> marks, remarks }
  const [marksheet, setMarksheet] = useState<
    Record<string, { subjects: Record<string, number>; remarks: string }>
  >({});

  const targetStudents = scopedStudents.filter(
    (s) => s.classId === selectedClassId && s.sectionId === selectedSectionId
  );
  const targetSubjects = scopedSubjects.filter((s) => s.classId === selectedClassId);

  const canManage =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal' ||
    currentUser?.role === 'teacher';

  // Load existing results into local state
  useEffect(() => {
    const existing = (scopedExamResults || []).filter((r) => r && r.examId === selectedExamId);
    const map: Record<string, { subjects: Record<string, number>; remarks: string }> = {};

    (targetStudents || []).forEach((student) => {
      if (!student) return;
      const studentResult = existing.find((r) => r && r.studentId === student.id);
      const subMap: Record<string, number> = {};

      (targetSubjects || []).forEach((subj) => {
        if (!subj) return;
        const foundScore = Array.isArray(studentResult?.subjectMarks)
          ? studentResult.subjectMarks.find((sm) => sm && sm.subjectId === subj.id)
          : undefined;
        subMap[subj.id] = foundScore ? foundScore.marksObtained : 85;
      });

      map[student.id] = {
        subjects: subMap,
        remarks: studentResult?.remarks || 'Good academic understanding and participation',
      };
    });

    setMarksheet(map);
  }, [selectedExamId, selectedClassId, selectedSectionId, scopedExamResults, scopedStudents]);

  const handleScoreChange = (studentId: string, subjectId: string, val: number) => {
    setMarksheet((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        subjects: {
          ...prev[studentId]?.subjects,
          [subjectId]: Math.min(100, Math.max(0, val)),
        },
      },
    }));
  };

  const handleRemarkChange = (studentId: string, val: string) => {
    setMarksheet((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: val,
      },
    }));
  };

  const calculateGrade = (pct: number): string => {
    if (pct >= 91) return 'A1';
    if (pct >= 81) return 'A2';
    if (pct >= 71) return 'B1';
    if (pct >= 61) return 'B2';
    if (pct >= 51) return 'C1';
    if (pct >= 41) return 'C2';
    if (pct >= 33) return 'D';
    return 'E (Needs Improvement)';
  };

  const handleSaveMarksheet = () => {
    if (!selectedExamId || targetStudents.length === 0) return;

    targetStudents.forEach((student) => {
      const studentScores = marksheet[student.id]?.subjects || {};
      const subMarksArray = targetSubjects.map((s) => ({
        subjectId: s.id,
        marksObtained: studentScores[s.id] || 0,
        maxMarks: 100,
        grade: calculateGrade(studentScores[s.id] || 0),
      }));

      const totalObt = subMarksArray.reduce((acc, cur) => acc + cur.marksObtained, 0);
      const totalMax = subMarksArray.length * 100;
      const percentage = totalMax > 0 ? Math.round((totalObt / totalMax) * 100) : 0;
      const grade = calculateGrade(percentage);

      saveExamResult({
        examId: selectedExamId,
        studentId: student.id,
        classId: selectedClassId,
        sectionId: selectedSectionId,
        subjectMarks: subMarksArray,
        totalMarks: totalObt,
        maxTotalMarks: totalMax,
        percentage,
        grade,
        rank: 1,
        remarks: marksheet[student.id]?.remarks || 'Diligent effort',
      });
    });

    addToast('Exam marksheet saved successfully', 'success');
  };

  const handlePublish = () => {
    handleSaveMarksheet();
    publishExamResults(selectedExamId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Academic Performance & Marks Entry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Record subject scores, auto-compute CBSE grades, and publish official marksheets
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleSaveMarksheet}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Marks</span>
            </button>
            <button
              onClick={handlePublish}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish to Students</span>
            </button>
          </div>
        )}
      </div>

      {/* Selectors Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Exam Term
          </label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:border-orange-500"
          >
            {scopedExams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Class
          </label>
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

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Section
          </label>
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

      {/* Marksheet Spreadsheet Matrix */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 w-16">Roll</th>
                <th className="p-3 w-48">Student</th>
                {targetSubjects.map((s) => (
                  <th key={s.id} className="p-3 text-center min-w-[100px]">
                    <div>{s.name}</div>
                    <span className="text-[9px] font-normal opacity-75 font-mono">Max: 100</span>
                  </th>
                ))}
                <th className="p-3 text-center w-20">Total</th>
                <th className="p-3 text-center w-16">%</th>
                <th className="p-3 text-center w-20">Grade</th>
                <th className="p-3 w-48">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {targetStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5 + targetSubjects.length}
                    className="p-12 text-center text-slate-400"
                  >
                    No students in this Section
                  </td>
                </tr>
              ) : (
                targetStudents.map((student) => {
                  const studentScores = marksheet[student.id]?.subjects || {};
                  let totalObt = 0;
                  targetSubjects.forEach((s) => {
                    totalObt += studentScores[s.id] || 0;
                  });
                  const totalMax = Math.max(100, targetSubjects.length * 100);
                  const pct = Math.round((totalObt / totalMax) * 100);
                  const grade = calculateGrade(pct);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        #{student.rollNo}
                      </td>

                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        <div>{student.name}</div>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">
                          {student.admissionNo}
                        </span>
                      </td>

                      {/* Subject Mark Inputs */}
                      {targetSubjects.map((s) => (
                        <td key={s.id} className="p-2 text-center">
                          {canManage ? (
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={studentScores[s.id] ?? 80}
                              onChange={(e) =>
                                handleScoreChange(student.id, s.id, Number(e.target.value))
                              }
                              className="w-16 px-2 py-1 text-center font-mono font-bold text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-orange-500"
                            />
                          ) : (
                            <span className="font-mono font-bold">{studentScores[s.id] ?? 80}</span>
                          )}
                        </td>
                      ))}

                      <td className="p-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                        {totalObt} / {totalMax}
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-orange-600 dark:text-orange-400">
                        {pct}%
                      </td>

                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                          {grade}
                        </span>
                      </td>

                      <td className="p-2">
                        {canManage ? (
                          <input
                            type="text"
                            value={marksheet[student.id]?.remarks || ''}
                            onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                            placeholder="Performance note..."
                            className="w-full px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-orange-500"
                          />
                        ) : (
                          <span className="text-slate-500 text-[11px]">
                            {marksheet[student.id]?.remarks || 'Good effort'}
                          </span>
                        )}
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
