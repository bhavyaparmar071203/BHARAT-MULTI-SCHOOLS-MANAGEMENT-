import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  File,
  X,
  CheckCircle2,
  Download,
  Eye,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export interface UploadedFileInfo {
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
  uploadedAt?: string;
}

interface FileUploadProps {
  fileInfo?: UploadedFileInfo | null;
  onChange: (fileInfo: UploadedFileInfo | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
  allowSamplePresets?: boolean;
  sampleType?: 'pdf_notes' | 'cbse_syllabus' | 'exam_paper' | 'book_pdf';
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  fileInfo,
  onChange,
  accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt,image/*',
  maxSizeMB = 25,
  label = 'Attach Document / PDF',
  helperText = 'PDF, Word, or Presentation files up to 25MB',
  allowSamplePresets = true,
  sampleType = 'pdf_notes',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'application/pdf',
        dataUrl: typeof reader.result === 'string' ? reader.result : undefined,
        uploadedAt: new Date().toISOString(),
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleAttachSample = () => {
    const samples: Record<string, UploadedFileInfo> = {
      pdf_notes: {
        name: 'CBSE_Class10_Science_Revision_Notes.pdf',
        size: '2.4 MB',
        type: 'application/pdf',
        dataUrl: '#sample-doc-pdf',
        uploadedAt: new Date().toISOString(),
      },
      cbse_syllabus: {
        name: 'CBSE_Curriculum_Guidelines_2025-26.pdf',
        size: '1.8 MB',
        type: 'application/pdf',
        dataUrl: '#sample-syllabus-pdf',
        uploadedAt: new Date().toISOString(),
      },
      exam_paper: {
        name: 'Mid_Term_Mathematics_Question_Bank.pdf',
        size: '3.1 MB',
        type: 'application/pdf',
        dataUrl: '#sample-exam-pdf',
        uploadedAt: new Date().toISOString(),
      },
      book_pdf: {
        name: 'Concepts_of_Physics_Vol1_Digital_Notes.pdf',
        size: '4.7 MB',
        type: 'application/pdf',
        dataUrl: '#sample-book-pdf',
        uploadedAt: new Date().toISOString(),
      },
    };

    onChange(samples[sampleType] || samples.pdf_notes);
  };

  const isPdf = fileInfo?.name.toLowerCase().endsWith('.pdf') || fileInfo?.type.includes('pdf');

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {label}
          </label>
          {allowSamplePresets && !fileInfo && (
            <button
              type="button"
              onClick={handleAttachSample}
              className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Attach Sample PDF</span>
            </button>
          )}
        </div>
      )}

      {fileInfo ? (
        /* Selected File Card */
        <div className="p-3.5 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 flex items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              {isPdf ? <FileText className="w-5 h-5" /> : <File className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {fileInfo.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-bold">
                  {fileInfo.size}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready to Upload
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Remove attached file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`p-5 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-orange-400'
          }`}
        >
          <Upload className="w-6 h-6 mx-auto mb-1.5 text-slate-400" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Click to upload or drag & drop file
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
