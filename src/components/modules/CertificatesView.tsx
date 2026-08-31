import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  CreditCard,
  FileText,
  Printer,
  GraduationCap,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const CertificatesView: React.FC = () => {
  const {
    currentSchool,
    scopedStudents,
    scopedClasses,
    scopedSections,
    scopedExams,
    scopedExamResults,
    scopedSubjects,
  } = useApp();

  const [documentType, setDocumentType] = useState<'id_card' | 'report_card' | 'transfer_cert'>(
    'id_card'
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    scopedStudents[0]?.id || ''
  );
  const [selectedExamId, setSelectedExamId] = useState<string>(
    scopedExams[0]?.id || ''
  );

  const selectedStudent = scopedStudents.find((s) => s.id === selectedStudentId);
  const studentClass = scopedClasses.find((c) => c.id === selectedStudent?.classId);
  const studentSection = scopedSections.find((s) => s.id === selectedStudent?.sectionId);
  const studentExamResult = scopedExamResults.find(
    (r) => r.studentId === selectedStudentId && r.examId === selectedExamId
  );
  const currentExam = scopedExams.find((e) => e.id === selectedExamId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Official Certificates & ID Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Generate print-ready Student ID Cards, Marksheets, and Transfer Certificates
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Document</span>
        </button>
      </div>

      {/* Document Selector & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Document Type tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setDocumentType('id_card')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              documentType === 'id_card'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Student ID Card</span>
          </button>

          <button
            onClick={() => setDocumentType('report_card')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              documentType === 'report_card'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>CBSE Marksheet</span>
          </button>

          <button
            onClick={() => setDocumentType('transfer_cert')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              documentType === 'transfer_cert'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transfer Certificate (TC)</span>
          </button>
        </div>

        {/* Target Student Selector */}
        <div className="flex items-center gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Select Student:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:border-orange-500"
            >
              {scopedStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.admissionNo}) - Roll #{s.rollNo}
                </option>
              ))}
            </select>
          </div>

          {documentType === 'report_card' && (
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Assessment Term:
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:border-orange-500"
              >
                {scopedExams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Canvas */}
      <div className="flex justify-center p-4 sm:p-8 bg-slate-100 dark:bg-slate-950/60 rounded-3xl border border-slate-200 dark:border-slate-800">
        {/* DOCUMENT 1: STUDENT ID CARD */}
        {documentType === 'id_card' && selectedStudent && (
          <div
            id="printable-id-card"
            className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-white text-slate-900 border-2 border-slate-300 relative"
          >
            {/* ID Header with School Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-4 text-center text-white relative">
              <div className="w-10 h-10 mx-auto rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center font-bold text-orange-400 mb-1">
                BSM
              </div>
              <h3 className="font-extrabold text-sm tracking-wide font-heading">
                {currentSchool?.name || 'Bharat Model Higher Secondary School'}
              </h3>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">
                Affiliation No: {currentSchool?.affiliationNo || 'CBSE-99120'}
              </p>
            </div>

            {/* Student Photo & Identity */}
            <div className="p-5 text-center">
              <img
                src={
                  selectedStudent.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={selectedStudent.name}
                className="w-24 h-24 rounded-2xl mx-auto object-cover ring-4 ring-orange-500 shadow-md"
              />
              <h4 className="font-extrabold text-lg text-slate-900 mt-3 font-heading">
                {selectedStudent.name}
              </h4>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Class {studentClass?.name} - Sec {studentSection?.name}
              </p>

              {/* ID Metadata Fields */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Admission No:</span>
                  <span className="font-mono font-bold">{selectedStudent.admissionNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Roll Number:</span>
                  <span className="font-mono font-bold">#{selectedStudent.rollNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date of Birth:</span>
                  <span className="font-semibold">{selectedStudent.dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blood Group:</span>
                  <span className="font-bold text-rose-600">{selectedStudent.bloodGroup || 'B+'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Emergency Phone:</span>
                  <span className="font-semibold">{selectedStudent.parentPhone}</span>
                </div>
              </div>

              {/* Barcode & Seal */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="text-left font-mono text-[9px] text-slate-400">
                  ||||| | |||| |||||| || |
                  <span className="block mt-0.5">{selectedStudent.admissionNo}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">
                    Principal Seal
                  </span>
                  <span className="text-[10px] font-bold text-slate-800">VALID 2025-26</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 2: CBSE MARKSHEET REPORT CARD */}
        {documentType === 'report_card' && selectedStudent && (
          <div
            id="printable-report-card"
            className="w-full max-w-2xl bg-white text-slate-900 p-8 rounded-2xl shadow-xl border-2 border-slate-300 space-y-6 text-xs"
          >
            {/* Header */}
            <div className="text-center border-b-2 pb-4 border-slate-800 space-y-1">
              <div className="w-12 h-12 mx-auto rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center text-lg mb-1">
                BSM
              </div>
              <h2 className="text-lg font-black tracking-wide font-heading">
                {currentSchool?.name || 'Bharat Model Higher Secondary School'}
              </h2>
              <p className="text-[11px] text-slate-500 font-serif">
                Affiliated to Central Board of Secondary Education (CBSE), New Delhi
              </p>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-orange-700 pt-1">
                PROGRESS REPORT CARD : {currentExam?.name || 'MID-TERM ASSESSMENT 2025'}
              </h3>
            </div>

            {/* Student Info Box */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="space-y-1">
                <p>
                  <strong>Student Name:</strong> {selectedStudent.name}
                </p>
                <p>
                  <strong>Admission No:</strong> {selectedStudent.admissionNo}
                </p>
                <p>
                  <strong>Father / Guardian:</strong> {selectedStudent.parentName}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p>
                  <strong>Class / Section:</strong> {studentClass?.name} - {studentSection?.name}
                </p>
                <p>
                  <strong>Roll No:</strong> #{selectedStudent.rollNo}
                </p>
                <p>
                  <strong>Academic Year:</strong> 2025-2026
                </p>
              </div>
            </div>

            {/* Scholastic Achievement Table */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] border-b border-slate-300">
                  <tr>
                    <th className="p-2.5">Subject Code & Title</th>
                    <th className="p-2.5 text-center">Max Marks</th>
                    <th className="p-2.5 text-center">Pass Marks</th>
                    <th className="p-2.5 text-center">Marks Obtained</th>
                    <th className="p-2.5 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {studentExamResult?.subjectMarks.map((sm) => {
                    const subj = scopedSubjects.find((s) => s.id === sm.subjectId);
                    return (
                      <tr key={sm.subjectId}>
                        <td className="p-2.5 font-sans font-medium text-slate-800">
                          {subj ? subj.name : 'Subject'} ({subj?.code})
                        </td>
                        <td className="p-2.5 text-center">{sm.maxMarks}</td>
                        <td className="p-2.5 text-center text-slate-500">35</td>
                        <td className="p-2.5 text-center font-bold">{sm.marksObtained}</td>
                        <td className="p-2.5 text-center font-bold text-orange-600">
                          {sm.grade}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-2.5 font-sans">Grand Total Aggregate</td>
                    <td className="p-2.5 text-center">{studentExamResult?.maxTotalMarks || 500}</td>
                    <td className="p-2.5 text-center">—</td>
                    <td className="p-2.5 text-center text-orange-600">
                      {studentExamResult?.totalMarks || 420}
                    </td>
                    <td className="p-2.5 text-center text-orange-600">
                      {studentExamResult?.grade || 'A1'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Remarks and Assessment summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <p>
                <strong>Overall Percentage:</strong> {studentExamResult?.percentage || 84}% • <strong>Result:</strong> PASSED
              </p>
              <p>
                <strong>Teacher Remarks:</strong> {studentExamResult?.remarks || 'Demonstrates exceptional critical thinking and sincere participation.'}
              </p>
            </div>

            {/* Signatures */}
            <div className="flex items-center justify-between pt-12">
              <div className="text-center">
                <div className="w-28 border-b border-dashed border-slate-800 mx-auto" />
                <span className="text-[10px] text-slate-500 block mt-1">Class Teacher</span>
              </div>
              <div className="text-center">
                <div className="w-28 border-b border-dashed border-slate-800 mx-auto" />
                <span className="text-[10px] text-slate-500 block mt-1">School Seal</span>
              </div>
              <div className="text-center">
                <div className="w-28 border-b border-dashed border-slate-800 mx-auto" />
                <span className="text-[10px] text-slate-500 block mt-1">Principal Signature</span>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 3: TRANSFER CERTIFICATE (TC) */}
        {documentType === 'transfer_cert' && selectedStudent && (
          <div
            id="printable-tc"
            className="w-full max-w-2xl bg-white text-slate-900 p-8 rounded-2xl shadow-xl border-2 border-slate-300 space-y-6 text-xs font-serif"
          >
            <div className="text-center border-b-2 pb-4 border-slate-800 space-y-1">
              <h2 className="text-xl font-bold font-heading">
                {currentSchool?.name || 'Bharat Model Higher Secondary School'}
              </h2>
              <p className="text-xs text-slate-600">
                Affiliated to Central Board of Secondary Education • School Code: 20491
              </p>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pt-2">
                SCHOOL LEAVING / TRANSFER CERTIFICATE
              </h3>
              <p className="text-[10px] font-mono text-slate-500">TC No: TC-2025-0914</p>
            </div>

            <div className="space-y-3 leading-relaxed text-slate-800">
              <p>
                1. Name of Pupil: <strong>{selectedStudent.name}</strong>
              </p>
              <p>
                2. Father's / Guardian's Name: <strong>{selectedStudent.parentName}</strong>
              </p>
              <p>
                3. Nationality: <strong>Indian</strong>
              </p>
              <p>
                4. Date of first admission in the school: <strong>{selectedStudent.admissionDate}</strong> (Class {studentClass?.name})
              </p>
              <p>
                5. Date of Birth according to Admission Register: <strong>{selectedStudent.dob}</strong>
              </p>
              <p>
                6. Class in which the pupil last studied: <strong>Class {studentClass?.name}</strong>
              </p>
              <p>
                7. School / Board Annual Examination last taken: <strong>PASSED</strong>
              </p>
              <p>
                8. Month up to which school dues have been cleared: <strong>All Dues Paid in Full</strong>
              </p>
              <p>
                9. Total number of working days during academic session: <strong>210 Days</strong>
              </p>
              <p>
                10. Total number of working days pupil present: <strong>202 Days (96.2%)</strong>
              </p>
              <p>
                11. General Conduct: <strong>Exemplary & Good</strong>
              </p>
              <p>
                12. Reason for leaving the school: <strong>Parent's Relocation / Promotion to Higher Standard</strong>
              </p>
            </div>

            <div className="flex items-center justify-between pt-12">
              <div className="text-center">
                <div className="w-28 border-b border-dashed border-slate-800 mx-auto" />
                <span className="text-[10px] text-slate-500 block mt-1">Prepared By</span>
              </div>
              <div className="text-center">
                <div className="w-28 border-b border-dashed border-slate-800 mx-auto" />
                <span className="text-[10px] text-slate-500 block mt-1">Checked By</span>
              </div>
              <div className="text-center">
                <div className="w-28 border-b border-dashed border-slate-800 mx-auto" />
                <span className="text-[10px] text-slate-500 block mt-1">Principal (With Seal)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
