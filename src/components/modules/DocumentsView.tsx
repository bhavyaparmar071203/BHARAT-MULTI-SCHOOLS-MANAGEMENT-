import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { FileUpload } from '../common/FileUpload';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
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
  Eye,
  Paperclip,
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
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'policy' | 'syllabus' | 'circular' | 'certificate' | 'other'>('policy');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('application/pdf');
  const [fileSize, setFileSize] = useState('');

  // Document Viewer state
  const [viewerFile, setViewerFile] = useState<{
    url: string;
    name: string;
    type?: string;
  } | null>(null);

  const canManage =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal';

  const categories = ['All', 'policy', 'syllabus', 'circular', 'certificate', 'other'];

  const filteredDocs = scopedDocuments.filter((doc) => {
    const matchSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat =
      !selectedCategoryFilter || selectedCategoryFilter === 'All'
        ? true
        : doc.category === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setCategory('policy');
    setFileUrl('');
    setFileName('');
    setFileType('application/pdf');
    setFileSize('');
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      addToast('Please enter document title', 'error');
      return;
    }

    addDocument({
      title,
      description: description || undefined,
      category,
      fileUrl: fileUrl || '#',
      fileName: fileName || `${title}.pdf`,
      fileType: fileType || 'application/pdf',
      fileSize: fileSize || '1.5 MB',
      fileData: fileUrl || undefined,
      uploadedBy: currentUser?.name || 'Administration',
      uploadedDate: new Date().toISOString().substring(0, 10),
    });

    addToast('Document uploaded and broadcasted to school members', 'success');
    setIsAddModalOpen(false);
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
            Store, view, and distribute official syllabus guides, policies, and study material
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
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
            placeholder="Search document locker by title or keyword..."
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
        {filteredDocs.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-sm">No documents found in repository</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-orange-500/40 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {doc.category}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-heading mt-3 line-clamp-2">
                  {doc.title}
                </h3>

                {doc.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {doc.description}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>File Size:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {doc.fileSize}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded By:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px] text-right">
                      {doc.uploadedBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-mono">{doc.uploadedDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() =>
                    setViewerFile({
                      url: doc.fileUrl || doc.fileData || '',
                      name: doc.fileName || doc.title,
                      type: doc.fileType,
                    })
                  }
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View PDF</span>
                </button>

                {canManage && (
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Remove Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Upload Institutional Document / Notes"
        subtitle="Attach PDF file to school repository and notify users"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Document / Note Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CBSE Class 10 Science Revision Notes"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
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
              <option value="syllabus">Academic Syllabus & Revision Notes</option>
              <option value="policy">School Safety & Administrative Policy</option>
              <option value="circular">Government / Board Circular</option>
              <option value="certificate">Affiliation & Inspection Certificate</option>
              <option value="other">General Educational Dossier</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Brief Overview / Chapters (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Complete chapter-wise formulas, diagrams, and NCERT exemplars."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
            />
          </div>

          {/* File Upload Box */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Upload PDF or Document File
            </label>
            <FileUpload
              value={fileUrl}
              fileName={fileName}
              fileSize={fileSize}
              onChange={(data) => {
                setFileUrl(data.url);
                setFileName(data.name);
                setFileType(data.type);
                setFileSize(data.sizeFormatted);
              }}
              acceptedTypes={['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.png', '.jpg']}
              maxSizeMB={25}
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
              Upload & Broadcast
            </button>
          </div>
        </form>
      </Modal>

      {/* Interactive Document Viewer */}
      {viewerFile && (
        <DocumentViewerModal
          isOpen={!!viewerFile}
          onClose={() => setViewerFile(null)}
          fileUrl={viewerFile.url}
          fileName={viewerFile.name}
          fileType={viewerFile.type}
        />
      )}
    </div>
  );
};
