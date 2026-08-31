import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { BrandLogo } from '../common/BrandLogo';
import { Building2, User, Mail, Phone, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RegisterSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const RegisterSchoolModal: React.FC<RegisterSchoolModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const { registerSchool, addToast } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    schoolCode: '',
    establishedYear: '2025',
    affiliationNo: '',
    address: '',
    city: 'New Delhi',
    state: 'Delhi',
    principalName: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city) {
      addToast('Please fill in required school details', 'error');
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.adminName || !formData.adminEmail || !formData.adminPhone) {
      addToast('Please fill in administrator contact details', 'error');
      return;
    }

    registerSchool({
      ...formData,
      establishedYear: Number(formData.establishedYear),
    });

    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setStep(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" maxWidth="lg">
      <div className="flex flex-col items-center">
        <BrandLogo size="lg" showTagline={true} className="mb-4" />

        {isSuccess ? (
          <div className="text-center py-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              School Registration Submitted!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto mt-2 leading-relaxed">
              Your institution <strong className="text-slate-900 dark:text-white font-semibold">{formData.name}</strong> has been registered. You can immediately access the portal with full administrative tools!
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onOpenLogin();
                }}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Proceed to Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Register Your School (100% Free Forever)
              </h3>
              <p className="text-xs text-slate-500">
                Step {step} of 2: {step === 1 ? 'School Information' : 'Administrator & Contact Details'}
              </p>
            </div>

            {/* Step Progress bar */}
            <div className="flex items-center gap-2 mb-5">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
            </div>

            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    School / Institution Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Kendriya Vidyalaya / Delhi Public Academy"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      School Code (Short)
                    </label>
                    <input
                      type="text"
                      name="schoolCode"
                      value={formData.schoolCode}
                      onChange={handleChange}
                      placeholder="e.g. DPA-DELHI"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Affiliation / Board
                    </label>
                    <input
                      type="text"
                      name="affiliationNo"
                      value={formData.affiliationNo}
                      onChange={handleChange}
                      placeholder="e.g. CBSE / ICSE / State"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Jaipur"
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Rajasthan"
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Sector 4, Main Institutional Area"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors mt-2"
                >
                  Continue to Administrator Setup →
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Administrator Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Ramesh Gupta"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Admin Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      placeholder="admin@myschool.org"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone / Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="adminPhone"
                      value={formData.adminPhone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                  >
                    Complete Free Registration
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onOpenLogin();
                }}
                className="text-xs text-slate-500 hover:text-orange-600 transition-colors"
              >
                Already have an account? <strong className="font-bold underline">Sign In</strong>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
