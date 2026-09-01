import React from 'react';
import { Modal } from './Modal';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  User,
  ExternalLink,
  BookOpen,
  Share2,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    title: string;
    category?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
    fileType?: string;
    uploadedBy?: string;
    uploadedDate?: string;
    description?: string;
    targetRole?: string;
  } | null;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const { addToast } = useApp();

  if (!document) return null;

  const handleDownload = () => {
    addToast(`Downloading ${document.fileName || document.title}...`, 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.title}
      subtitle={document.category ? `Category: ${document.category.toUpperCase()}` : 'Institutional Document'}
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Document Meta Strip */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-600 text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {document.fileName || `${document.title}.pdf`}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                  {document.fileSize || '2.4 MB'}
                </span>
                <span>•</span>
                <span>Uploaded by {document.uploadedBy || 'Administration'}</span>
                {document.uploadedDate && (
                  <>
                    <span>•</span>
                    <span>{document.uploadedDate}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description if present */}
        {document.description && (
          <div className="p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-orange-800 dark:text-orange-300">Instructions / Notes: </strong>
            {document.description}
          </div>
        )}

        {/* Embedded Interactive Document Sheet / Viewer */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-inner overflow-hidden min-h-[380px] flex flex-col justify-between">
          {/* Mock PDF Header Ribbon */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="ml-2 font-bold text-slate-800 dark:text-slate-200">
                PDF Reader Preview (Page 1 of 4)
              </span>
            </div>
            <span className="text-[11px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-bold">
              100% Zoom
            </span>
          </div>

          {/* Document Content Canvas */}
          <div className="p-8 space-y-6 text-slate-800 dark:text-slate-200 max-h-[360px] overflow-y-auto">
            <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-orange-600 bg-orange-100 dark:bg-orange-950/60 px-3 py-1 rounded-full">
                OFFICIAL INSTITUTIONAL REPOSITORY
              </span>
              <h2 className="text-lg font-extrabold font-heading mt-2">{document.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Verified Digital Copy • Authorized by Central School Board
              </p>
            </div>

            <div className="space-y-3 text-xs leading-relaxed font-serif">
              <p>
                <strong>Chapter / Topic Outline:</strong> This digital educational document has been
                published by the institutional academic council. It includes structured modules,
                syllabus guidelines, concept notes, and examination patterns formatted strictly in
                accordance with national educational benchmarks.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 font-sans text-xs">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Curriculum & Compliance Verified</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  Target Audience: {document.targetRole?.toUpperCase() || 'ALL STUDENTS & FACULTY'}
                </p>
              </div>
              <p>
                Students are advised to review the chapters and consult with their respective subject
                teachers regarding assignments and self-assessment question banks.
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
            <span>Secure Cloud Vault Storage</span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg font-bold transition-colors"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
