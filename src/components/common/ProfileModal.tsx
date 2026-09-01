import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { ImageUpload } from './ImageUpload';
import { User, Phone, Mail, Shield, GraduationCap, Briefcase, Building, Save, CheckCircle2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, currentSchool, updateCurrentUser, addToast } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      updateCurrentUser({
        name,
        phone,
        avatar,
      });
      addToast('Your profile picture and account details have been updated', 'success');
      onClose();
    } catch (err) {
      addToast('Failed to save profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadge = () => {
    const roleColors: Record<string, string> = {
      super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200',
      school_admin: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200',
      principal: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200',
      teacher: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200',
      student: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200',
      parent: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200',
      accountant: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200',
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
          roleColors[currentUser.role] || 'bg-slate-100 text-slate-800'
        }`}
      >
        {currentUser.role.replace('_', ' ')}
      </span>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Account & Profile Picture" size="md">
      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile Picture Upload Section */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <ImageUpload
            value={avatar}
            onChange={(url) => setAvatar(url)}
            mode="avatar"
            label="Your Profile Picture"
            presetCategory={
              currentUser.role === 'teacher'
                ? 'teachers'
                : currentUser.role === 'student'
                ? 'students'
                : 'all'
            }
          />
          <div className="mt-3 text-center">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{currentUser.email}</p>
            <div className="mt-2">{getRoleBadge()}</div>
          </div>
        </div>

        {/* User Particulars */}
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-orange-500" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
              <Mail className="w-3.5 h-3.5 text-orange-500" />
              <span>Registered Email (Permanent Login ID)</span>
            </label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-orange-500" />
              <span>Mobile Contact Number</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
            />
          </div>

          {/* School Affiliation Info */}
          {currentSchool && (
            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 flex items-center gap-3">
              <Building className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-orange-900 dark:text-orange-200">{currentSchool.name}</p>
                <p className="text-[11px] text-orange-700 dark:text-orange-400">
                  Affiliation Code: <span className="font-mono font-bold">{currentSchool.schoolCode}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
