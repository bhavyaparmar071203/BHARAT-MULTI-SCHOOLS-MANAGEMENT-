import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ImageUpload } from '../common/ImageUpload';
import { FileUpload } from '../common/FileUpload';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  User,
  Layers,
  FileText,
  Eye,
  Download,
  BookMarked,
  Tag,
} from 'lucide-react';
import { Book, BookIssue } from '../../types';

export const LibraryView: React.FC = () => {
  const {
    currentUser,
    scopedBooks,
    scopedBookIssues,
    scopedLibraryIssues,
    scopedStudents,
    scopedTeachers,
    addBook,
    issueBook,
    returnBook,
    addToast,
  } = useApp();

  const allIssues = scopedBookIssues || scopedLibraryIssues || [];

  const [activeTab, setActiveTab] = useState<'catalog' | 'issued'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Modals
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isIssueBookOpen, setIsIssueBookOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('978-81-7992-162-3');
  const [category, setCategory] = useState('Science');
  const [rackNumber, setRackNumber] = useState('Rack A-3');
  const [copies, setCopies] = useState(5);
  const [coverUrl, setCoverUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [pdfSize, setPdfSize] = useState('');

  // Viewer state
  const [viewerFile, setViewerFile] = useState<{
    url: string;
    name: string;
    type?: string;
  } | null>(null);

  // Issue Form
  const [issueBookId, setIssueBookId] = useState(scopedBooks?.[0]?.id || '');
  const [issueStudentId, setIssueStudentId] = useState(scopedStudents?.[0]?.id || '');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000 * 14).toISOString().substring(0, 10)
  );

  const canManage =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal' ||
    currentUser?.role === 'teacher';

  const categories = ['All', 'Science', 'Mathematics', 'Literature', 'History', 'Technology', 'General Reference', 'Revision Notes'];

  const filteredBooks = (scopedBooks || []).filter((b) => {
    if (!b) return false;
    const matchSearch =
      (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.author || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.isbn || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      !selectedCategoryFilter || selectedCategoryFilter === 'All'
        ? true
        : b.category === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  const handleOpenAdd = () => {
    setTitle('');
    setAuthor('');
    setIsbn(`978-81-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`);
    setCategory('Science');
    setRackNumber('Rack A-1');
    setCopies(5);
    setCoverUrl('');
    setPdfUrl('');
    setPdfName('');
    setPdfSize('');
    setIsAddBookOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) {
      addToast('Please fill book title and author', 'error');
      return;
    }

    addBook({
      title,
      author,
      isbn: isbn || 'N/A',
      category,
      rackNumber,
      totalCopies: Number(copies) || 1,
      availableCopies: Number(copies) || 1,
      coverUrl: coverUrl || undefined,
      fileUrl: pdfUrl || undefined,
      fileName: pdfName || undefined,
      fileSize: pdfSize || undefined,
      fileData: pdfUrl || undefined,
    });

    addToast('Book / Notes added to library catalog and broadcasted to school', 'success');
    setIsAddBookOpen(false);
  };

  const handleSaveIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueBookId || !issueStudentId) {
      addToast('Please select book and student', 'error');
      return;
    }

    issueBook(issueBookId, issueStudentId, dueDate);
    setIsIssueBookOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Campus Library & Resource Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Physical book circulation, digital e-books, chapter notes, and syllabus PDFs
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Tab switches */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Book & Notes Catalog
            </button>
            <button
              onClick={() => setActiveTab('issued')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'issued'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Circulation ({allIssues.filter((i) => i && i.status === 'issued').length})
            </button>
          </div>

          {canManage && (
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Book / Notes</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <div className="space-y-4">
          {/* Search Toolbar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog by book title, notes, author, or ISBN..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Book Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.length === 0 ? (
              <div className="col-span-full p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="font-semibold text-sm">No books or study notes match your search</p>
              </div>
            ) : (
              filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-orange-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                        {book.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          book.availableCopies > 0
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {book.availableCopies} / {book.totalCopies} Available
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {/* Optional Book Cover */}
                      <div className="w-12 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm font-heading line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
                          by {book.author}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">ISBN:</span>
                        <span>{book.isbn}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Rack Location:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {book.rackNumber || 'Rack A-1'}
                        </span>
                      </div>
                    </div>

                    {/* PDF E-Book / Note attachment if available */}
                    {(book.fileUrl || book.fileData) && (
                      <div className="mt-3 p-2.5 rounded-xl bg-orange-50/60 dark:bg-slate-800/80 border border-orange-200/50 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                          <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {book.fileName || 'Digital PDF Notes'}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setViewerFile({
                              url: book.fileUrl || book.fileData || '',
                              name: book.fileName || book.title,
                              type: 'application/pdf',
                            })
                          }
                          className="px-2 py-1 text-[11px] font-bold text-orange-600 bg-white dark:bg-slate-900 border border-orange-200 dark:border-slate-700 rounded-md hover:bg-orange-50 flex items-center gap-1 flex-shrink-0"
                        >
                          <Eye className="w-3 h-3" /> Read PDF
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    {canManage && (
                      <button
                        onClick={() => {
                          setIssueBookId(book.id);
                          setIsIssueBookOpen(true);
                        }}
                        disabled={book.availableCopies === 0}
                        className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white disabled:opacity-40 disabled:hover:bg-slate-100 dark:disabled:hover:bg-slate-800 disabled:hover:text-slate-400 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Issue to Student</span>
                      </button>
                    )}

                    {(book.fileUrl || book.fileData) && (
                      <button
                        onClick={() =>
                          setViewerFile({
                            url: book.fileUrl || book.fileData || '',
                            name: book.fileName || book.title,
                            type: 'application/pdf',
                          })
                        }
                        className="px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 font-bold text-xs hover:bg-orange-100 transition-colors flex items-center gap-1"
                        title="Read Digital E-Book"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Read</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Issued Books Circulation Register */
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3.5">Book Title</th>
                  <th className="px-4 py-3.5">Issued To</th>
                  <th className="px-4 py-3.5">Issue Date</th>
                  <th className="px-4 py-3.5">Due Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allIssues.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-semibold">
                      No circulation records active
                    </td>
                  </tr>
                ) : (
                  allIssues.map((issue) => {
                    const book = (scopedBooks || []).find((b) => b && b.id === issue.bookId);
                    const student = (scopedStudents || []).find((s) => s && s.id === issue.studentId);
                    const isOverdue = new Date(issue.dueDate) < new Date() && issue.status === 'issued';

                    return (
                      <tr key={issue.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                          {book ? book.title : 'Book'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {student ? student.name : 'Student'}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {student?.admissionNo}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono">{issue.issueDate}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {issue.dueDate}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              issue.status === 'returned'
                                ? 'bg-slate-100 text-slate-600'
                                : isOverdue
                                ? 'bg-rose-100 text-rose-700 font-bold animate-pulse'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {issue.status === 'returned' ? 'Returned' : isOverdue ? 'Overdue' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {issue.status === 'issued' && canManage && (
                            <button
                              onClick={() => returnBook(issue.id)}
                              className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 hover:bg-emerald-100 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Return</span>
                            </button>
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
      )}

      {/* Add Book / Notes Modal */}
      <Modal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        title="Add Book / Study Notes to Library"
        subtitle="Catalog physical volumes or upload digital e-books & PDFs"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveBook} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Book / Notes Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Concepts of Physics - Vol 1"
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Author / Publisher / Faculty *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Dr. H.C. Verma"
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
              >
                {['Science', 'Mathematics', 'Literature', 'History', 'Technology', 'Revision Notes', 'General Reference'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Rack Location
              </label>
              <input
                type="text"
                value={rackNumber}
                onChange={(e) => setRackNumber(e.target.value)}
                placeholder="Rack B-2"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Copies Count
              </label>
              <input
                type="number"
                min={1}
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>

          {/* Book Cover Photo / Artwork */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Book Cover / Thumbnail Image (Optional)
            </label>
            <ImageUpload
              value={coverUrl}
              onChange={(url) => setCoverUrl(url)}
              mode="logo"
              label="Book Cover Art"
            />
          </div>

          {/* E-Book / Study Notes PDF Upload */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Attach Digital E-Book / Chapter Notes PDF (Optional)
            </label>
            <FileUpload
              value={pdfUrl}
              fileName={pdfName}
              fileSize={pdfSize}
              onChange={(data) => {
                setPdfUrl(data.url);
                setPdfName(data.name);
                setPdfSize(data.sizeFormatted);
              }}
              acceptedTypes={['.pdf', '.epub', '.doc', '.docx']}
              maxSizeMB={25}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddBookOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md"
            >
              Save & Broadcast Book
            </button>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueBookOpen}
        onClose={() => setIsIssueBookOpen(false)}
        title="Issue Book to Student"
        subtitle="Record circulation lending"
        maxWidth="md"
      >
        <form onSubmit={handleSaveIssue} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Select Student *
            </label>
            <select
              value={issueStudentId}
              onChange={(e) => setIssueStudentId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
            >
              {scopedStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.admissionNo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Return Due Date *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsIssueBookOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md"
            >
              Confirm Issue
            </button>
          </div>
        </form>
      </Modal>

      {/* Document & PDF Viewer Modal */}
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
