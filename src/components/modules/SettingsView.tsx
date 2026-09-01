import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ImageUpload } from '../common/ImageUpload';
import {
  Settings,
  Building,
  Clock,
  Shield,
  Save,
  Plus,
  Moon,
  Sun,
  Database,
  Download,
  School,
  CheckCircle2,
  User,
  Camera,
  Mail,
  Phone,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    currentSchool,
    schools,
    updateSettings,
    updateCurrentUser,
    addSchool,
    isDarkMode,
    toggleDarkMode,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'my_account' | 'academic' | 'multi_schools' | 'data'>('profile');

  // School profile form
  const [schoolName, setSchoolName] = useState(currentSchool?.name || '');
  const [schoolLogo, setSchoolLogo] = useState(currentSchool?.logo || '');
  const [affiliationNo, setAffiliationNo] = useState(currentSchool?.affiliationNo || '');
  const [email, setEmail] = useState(currentSchool?.email || '');
  const [phone, setPhone] = useState(currentSchool?.phone || '');
  const [address, setAddress] = useState(currentSchool?.address || '');
  const [city, setCity] = useState(currentSchool?.city || '');
  const [state, setState] = useState(currentSchool?.state || '');
  const [pincode, setPincode] = useState(currentSchool?.pincode || '');
  const [principalName, setPrincipalName] = useState(currentSchool?.principalName || '');
  const [academicYear, setAcademicYear] = useState(currentSchool?.academicYear || '2025-2026');

  // Personal user profile form
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [userAvatar, setUserAvatar] = useState(currentUser?.avatar || '');

  // Add School Modal (Super Admin)
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolCode, setNewSchoolCode] = useState('');
  const [newSchoolCity, setNewSchoolCity] = useState('');
  const [newSchoolState, setNewSchoolState] = useState('');
  const [newPrincipal, setNewPrincipal] = useState('');
  const [newAffiliation, setNewAffiliation] = useState('');
  const [newSchoolLogo, setNewSchoolLogo] = useState(
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&auto=format&fit=crop&q=80'
  );

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canEdit =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSchool) return;

    updateSettings({
      name: schoolName,
      logo: schoolLogo,
      affiliationNo,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      principalName,
      academicSession: academicYear,
    });
  };

  const handleSavePersonalProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: userName,
      phone: userPhone,
      avatar: userAvatar,
    });
    addToast('Your personal account profile has been updated', 'success');
  };

  const handleRegisterSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName || !newSchoolCode) {
      addToast('Please enter school name and code', 'error');
      return;
    }

    addSchool({
      name: newSchoolName,
      code: newSchoolCode.toUpperCase(),
      city: newSchoolCity || 'New Delhi',
      state: newSchoolState || 'Delhi',
      pincode: '110001',
      address: 'Educational Campus Area',
      phone: '+91 11 2345 6789',
      email: `admin@${newSchoolCode.toLowerCase()}.edu.in`,
      principalName: newPrincipal || 'Principal',
      affiliationNo: newAffiliation || `CBSE-${newSchoolCode}`,
      academicYear: '2025-2026',
      logo: newSchoolLogo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&auto=format&fit=crop&q=80',
    });

    setIsAddSchoolOpen(false);
    setNewSchoolName('');
    setNewSchoolCode('');
  };

  const handleExportBackup = () => {
    const data = localStorage.getItem('bharat_school_erp_v1_data');
    if (!data) return;

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BSM-Backup-${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    addToast('Institutional backup downloaded successfully', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            System & Institutional Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage school logo, profile picture, academic particulars, schedules, and data backups
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center flex-wrap gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            School Crest & Details
          </button>
          <button
            onClick={() => setActiveTab('my_account')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'my_account'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            My Profile Picture
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'academic'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Timings & Schedule
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('multi_schools')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'multi_schools'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              School Network ({schools.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'data'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Backup & Data
          </button>
        </div>
      </div>

      {/* Tab 1: School Profile & Emblem */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* School Emblem / Logo Upload Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-50/50 to-amber-50/30 dark:from-slate-800/80 dark:to-slate-800/40 border border-orange-200/70 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <School className="w-4 h-4 text-orange-600" />
                <span>Official Institution Logo / Seal</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                This logo will appear on student ID cards, report cards, fee receipts, circulars, and header banners.
              </p>
              <ImageUpload
                value={schoolLogo}
                onChange={(url) => setSchoolLogo(url)}
                mode="logo"
                label="Institution Logo"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  disabled={!canEdit}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Board Affiliation / Recognition No *
                </label>
                <input
                  type="text"
                  value={affiliationNo}
                  onChange={(e) => setAffiliationNo(e.target.value)}
                  disabled={!canEdit}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Principal / Head of Institution
                </label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Academic Session
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Administrative Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Campus Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  State / UT
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {canEdit && (
              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Update School Logo & Particulars</span>
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Tab 2: My Account & Profile Picture */}
      {activeTab === 'my_account' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Personal Profile & Avatar Customization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload your personal photo or select an avatar preset. This is visible across attendance sheets, communications, and notices.
            </p>
          </div>

          <form onSubmit={handleSavePersonalProfile} className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center md:items-start gap-6">
              <ImageUpload
                value={userAvatar}
                onChange={(url) => setUserAvatar(url)}
                mode="avatar"
                label="Your Profile Picture"
                presetCategory={
                  currentUser?.role === 'teacher'
                    ? 'teachers'
                    : currentUser?.role === 'student'
                    ? 'students'
                    : 'all'
                }
              />
              <div className="flex-1 space-y-1 text-center md:text-left">
                <span className="text-xs uppercase font-bold tracking-wider text-orange-600 dark:text-orange-400">
                  {currentUser?.role?.replace('_', ' ')} Account
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-heading">{currentUser?.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{currentUser?.email}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                  Supports JPG, PNG, WebP or SVG up to 5MB. Real-time preview applied instantly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save My Profile Picture & Details</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Timings & Schedule */}
      {activeTab === 'academic' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">
            Daily Bell Schedule & Academic Timings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block">Morning Assembly</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
                08:00 AM - 08:20 AM
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block">Standard Period Duration</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
                45 Minutes
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block">Recess / Lunch Interval</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
                11:20 AM - 11:55 AM
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Multi-School Network (Super Admin) */}
      {activeTab === 'multi_schools' && isSuperAdmin && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">
                Multi-Tenant School Directory
              </h3>
              <p className="text-xs text-slate-400">
                Schools registered on the Bharat Schools Management national cluster
              </p>
            </div>

            <button
              onClick={() => setIsAddSchoolOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New School</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school) => (
              <div
                key={school.id}
                className={`p-5 rounded-2xl border transition-all ${
                  school.id === currentSchool?.id
                    ? 'bg-orange-50/20 dark:bg-orange-950/20 border-orange-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm font-heading">
                      {school.name}
                    </h4>
                    <p className="text-xs text-orange-600 font-mono font-bold mt-0.5">
                      Code: {school.code}
                    </p>
                  </div>

                  {school.id === currentSchool?.id && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white uppercase">
                      Current School
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>City & State:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {school.city}, {school.state}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Principal:</span>
                    <span>{school.principalName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Affiliation:</span>
                    <span className="font-mono">{school.affiliationNo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Backup & Data */}
      {activeTab === 'data' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">
              Local Data Retention & Institutional Backups
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Export complete encrypted schema and record history for offline archiving
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Export Complete School Database
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Includes all students, faculty records, marksheets, attendance, and fee ledgers.
              </p>
            </div>

            <button
              onClick={handleExportBackup}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 shadow-xs transition-all whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>
        </div>
      )}

      {/* Add School Modal (Super Admin) */}
      <Modal
        isOpen={isAddSchoolOpen}
        onClose={() => setIsAddSchoolOpen(false)}
        title="Register New School on Network"
        subtitle="Provision isolated tenant partition"
        maxWidth="md"
      >
        <form onSubmit={handleRegisterSchool} className="space-y-4">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <ImageUpload
              value={newSchoolLogo}
              onChange={(url) => setNewSchoolLogo(url)}
              mode="logo"
              label="School Emblem"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              School Name *
            </label>
            <input
              type="text"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              placeholder="e.g. Kendriya Vidyalaya No. 2"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Unique School Code *
              </label>
              <input
                type="text"
                value={newSchoolCode}
                onChange={(e) => setNewSchoolCode(e.target.value)}
                placeholder="e.g. KV-DELHI-02"
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 uppercase font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Affiliation Number
              </label>
              <input
                type="text"
                value={newAffiliation}
                onChange={(e) => setNewAffiliation(e.target.value)}
                placeholder="CBSE-2025-..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                City *
              </label>
              <input
                type="text"
                value={newSchoolCity}
                onChange={(e) => setNewSchoolCity(e.target.value)}
                placeholder="e.g. Jaipur"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                State *
              </label>
              <input
                type="text"
                value={newSchoolState}
                onChange={(e) => setNewSchoolState(e.target.value)}
                placeholder="e.g. Rajasthan"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Principal Name
            </label>
            <input
              type="text"
              value={newPrincipal}
              onChange={(e) => setNewPrincipal(e.target.value)}
              placeholder="e.g. Dr. A. Sharma"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddSchoolOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md"
            >
              Provision School Tenant
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
