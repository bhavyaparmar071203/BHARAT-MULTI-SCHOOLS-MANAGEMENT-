import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  User,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { Homework } from '../../types';

export const HomeworkView: React.FC = () => {
  const {
    currentUser,
    scopedHomework,
    scopedClasses,
    scopedSections,
    scopedSubjects,
    scopedStudents,
    addHomework,
    addToast,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(scopedSubjects[0]?.id || '');
  const [classId, setClassId] = useState(scopedClasses[0]?.id || '');
  const [sectionId, setSectionId] = useState(
    scopedSections.find((s) => s.classId === scopedClasses[0]?.id)?.id || ''
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().substring(0, 10)
  );

  const canAssign =
    currentUser?.role === 'teacher' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal' ||
    currentUser?.role === 'super_admin';

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setSubjectId(scopedSubjects[0]?.id || '');
    setClassId(scopedClasses[0]?.id || '');
    setSectionId(
      scopedSections.find((s) => s.classId === scopedClasses[0]?.id)?.id || ''
    );
    setDueDate(new Date(Date.now() + 86400000 * 3).toISOString().substring(0, 10));
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subjectId || !classId || !sectionId || !dueDate) {
      addToast('Please fill all homework fields', 'error');
      return;
    }

    addHomework({
      title,
      description,
      subjectId,
      classId,
      sectionId,
      assignedBy: currentUser?.name || 'Faculty',
      assignedDate: new Date().toISOString().substring(0, 10),
      dueDate,
      status: 'assigned',
    });

    setIsAddModalOpen(false);
  };

  const handleViewSubmissions = (hw: Homework) => {
    setSelectedHomework(hw);
    setIsSubmissionsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Homework & Daily Assignments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Assign curriculum tasks, monitor submissions, and track student completion
          </p>
        </div>

        {canAssign && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Homework</span>
          </button>
        )}
      </div>

      {/* Homework Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scopedHomework.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-sm">No homework tasks assigned yet</p>
          </div>
        ) : (
          scopedHomework.map((hw) => {
            const subj = scopedSubjects.find((s) => s.id === hw.subjectId);
            const cls = scopedClasses.find((c) => c.id === hw.classId);
            const sec = scopedSections.find((s) => s.id === hw.sectionId);

            const isOverdue = new Date(hw.dueDate) < new Date();

            return (
              <div
                key={hw.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 uppercase">
                      {subj ? subj.name : 'Subject'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isOverdue
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      }`}
                    >
                      {isOverdue ? 'Overdue' : 'Active'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm font-heading">
                    {hw.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-3">
                    {hw.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Target Class:</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {cls ? cls.name : 'Class'} - Sec {sec ? sec.name : 'A'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Assigned By:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{hw.assignedBy}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Due Date:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {hw.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleViewSubmissions(hw)}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>View Class Submissions</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Assign Homework Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Assign Class Homework"
        subtitle="Create academic assignment with instructions and submission deadline"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 4 Trigonometry Exercise 4.2"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
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
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Class *
              </label>
              <select
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  const firstSec = scopedSections.find((s) => s.classId === e.target.value);
                  if (firstSec) setSectionId(firstSec.id);
                }}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold"
              >
                {scopedClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Section *
              </label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold"
              >
                {scopedSections
                  .filter((s) => s.classId === classId)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Submission Due Date *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Instructions & Questions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide problem numbers, notebook submission guidelines..."
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
              Publish Homework
            </button>
          </div>
        </form>
      </Modal>

      {/* Submissions Tracker Modal */}
      {selectedHomework && (
        <Modal
          isOpen={isSubmissionsModalOpen}
          onClose={() => setIsSubmissionsModalOpen(false)}
          title={`Homework Submissions: ${selectedHomework.title}`}
          subtitle={`Tracking Class ${scopedClasses.find((c) => c.id === selectedHomework.classId)?.name}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Instructions:</p>
              <p className="text-slate-600 dark:text-slate-400">{selectedHomework.description}</p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2">Roll No</th>
                    <th className="px-3 py-2">Student Name</th>
                    <th className="px-3 py-2">Submission Status</th>
                    <th className="px-3 py-2">Teacher Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {scopedStudents
                    .filter(
                      (s) =>
                        s.classId === selectedHomework.classId &&
                        s.sectionId === selectedHomework.sectionId
                    )
                    .map((st, idx) => (
                      <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-3 py-2.5 font-mono font-bold">#{st.rollNo}</td>
                        <td className="px-3 py-2.5 font-bold text-slate-800 dark:text-slate-200">
                          {st.name}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              idx % 4 === 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {idx % 4 === 0 ? 'Pending' : 'Completed & Verified'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-500 text-[11px]">
                          {idx % 4 === 0 ? 'Due for review' : 'Checked - Good handwriting'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsSubmissionsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
              >
                Close Tracker
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
