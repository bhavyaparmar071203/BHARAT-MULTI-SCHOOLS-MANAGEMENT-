import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  FolderLock,
  Plus,
  Search,
  FileText,
  Download,
  Trash2,
  Lock,
  FileCheck,
  Tag,
} from 'lucide-react';
import { SchoolDocument } from '../../types';

export const DocumentsView: React.FC = () => {
  const {
    currentUser,
    scopedDocuments,
    addDocument,
    deleteDocument,
    addToast,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'policy' | 'syllabus' | 'circular' | 'certificate' | 'other'>('policy');
  const [fileSize, setFileSize] = useState('1.4 MB');

  const canManage =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal';

  const categories = ['All', 'policy', 'syllabus', 'circular', 'certificate', 'other'];

  const filteredDocs = scopedDocuments.filter((doc) => {
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      !selectedCategoryFilter || selectedCategoryFilter === 'All'
        ? true
        : doc.category === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      addToast('Please enter document title', 'error');
      return;
    }

    addDocument({
      title,
      category,
      fileUrl: '#',
      fileType: 'application/pdf',
      fileSize: fileSize || '2.1 MB',
      uploadedBy: currentUser?.name || 'Administration',
      uploadedDate: new Date().toISOString().substring(0, 10),
    });

    setIsAddModalOpen(false);
  };

  const handleDownload = (doc: SchoolDocument) => {
    addToast(`Downloading ${doc.title} (.pdf)...`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Institutional Document Locker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Store and access official policies, CBSE syllabus guides, circulars, and dossiers
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
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
            placeholder="Search document locker by title..."
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
              {c} Category
            </option>
          ))}
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600">
                  <FileText className="w-6 h-6" />
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {doc.category}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-heading mt-3">
                {doc.title}
              </h3>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {doc.fileSize}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded By:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{doc.uploadedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-mono">{doc.uploadedDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleDownload(doc)}
                className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              {canManage && (
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Remove Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Upload Institutional Document"
        subtitle="Attach PDF file to school repository"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Document Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CBSE Senior Secondary Curriculum Guide 2025-26"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Document Classification
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold capitalize"
            >
              <option value="policy">School Safety & Administrative Policy</option>
              <option value="syllabus">Academic Syllabus & Curriculum</option>
              <option value="circular">Government / Board Circular</option>
              <option value="certificate">Affiliation & Inspection Certificate</option>
              <option value="other">General Educational Dossier</option>
            </select>
          </div>

          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Click to select PDF or drag and drop
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Maximum file size: 25 MB</p>
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
              Save to Locker
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
