import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Bell,
  Plus,
  Pin,
  Calendar,
  Users,
  Search,
  Tag,
  Trash2,
} from 'lucide-react';
import { Notice } from '../../types';

export const NoticesView: React.FC = () => {
  const {
    currentUser,
    scopedNotices,
    addNotice,
    deleteNotice,
    addToast,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'academic' | 'event' | 'holiday' | 'exam' | 'general'>('general');
  const [targetAudience, setTargetAudience] = useState<'all' | 'teachers' | 'students' | 'parents'>('all');
  const [isPinned, setIsPinned] = useState(false);

  const canManage =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal';

  const categories = ['All', 'general', 'academic', 'exam', 'holiday', 'event'];

  const filteredNotices = scopedNotices.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      !selectedCategoryFilter || selectedCategoryFilter === 'All'
        ? true
        : n.category === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setCategory('general');
    setTargetAudience('all');
    setIsPinned(false);
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      addToast('Please fill all notice fields', 'error');
      return;
    }

    addNotice({
      title,
      description,
      category,
      targetAudience,
      isPinned,
      publishDate: new Date().toISOString().substring(0, 10),
      authorName: currentUser?.name || 'Principal Office',
      authorRole: currentUser?.role || 'school_admin',
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Official Notices & Circulars
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Broadcast institutional circulars, academic notices, and holiday announcements
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Circular</span>
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars by keyword..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-medium"
          />
        </div>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="w-full sm:w-44 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold capitalize"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c} Notices
            </option>
          ))}
        </select>
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-sm">No circulars found</p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                notice.isPinned
                  ? 'border-orange-500/60 shadow-sm bg-gradient-to-r from-orange-50/30 to-transparent dark:from-orange-950/20'
                  : 'border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {notice.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-600 text-white">
                        <Pin className="w-3 h-3" /> PINNED
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {notice.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Target: {notice.targetAudience.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-line leading-relaxed">
                    {notice.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Issued by <strong className="text-slate-700 dark:text-slate-300">{notice.authorName}</strong> ({notice.authorRole})
                    </span>
                    <span>{notice.publishDate}</span>
                  </div>
                </div>

                {canManage && (
                  <button
                    onClick={() => deleteNotice(notice.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Publish Notice Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Publish Institutional Circular"
        subtitle="Issue official notification to school community"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Circular Headline *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Schedule for Annual Sports Meet 2025"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold capitalize"
              >
                <option value="general">General Administrative</option>
                <option value="academic">Academic & Curriculum</option>
                <option value="exam">Examinations & Tests</option>
                <option value="holiday">Official Holiday</option>
                <option value="event">Campus Event</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold capitalize"
              >
                <option value="all">Entire School Community</option>
                <option value="teachers">Teaching Staff Only</option>
                <option value="students">Students Only</option>
                <option value="parents">Parents & Guardians</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Notice Full Body & Instructions *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter full notice text, guidelines, timings..."
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 leading-relaxed"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded text-orange-600 focus:ring-orange-500"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pin to top of school bulletin board
            </span>
          </label>

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
              Publish Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
