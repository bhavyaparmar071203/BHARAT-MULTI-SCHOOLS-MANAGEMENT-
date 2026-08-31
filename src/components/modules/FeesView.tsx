import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Printer,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  IndianRupee,
  Layers,
  CreditCard,
} from 'lucide-react';
import { StudentFee, FeeStructure } from '../../types';

export const FeesView: React.FC = () => {
  const {
    currentUser,
    currentSchool,
    scopedStudents,
    scopedClasses,
    scopedFeeStructures,
    scopedStudentFees,
    addFeePayment,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ledger' | 'structures'>('ledger');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

  // Payment Recording Modal
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedFeeRecord, setSelectedFeeRecord] = useState<StudentFee | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(5000);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'bank_transfer' | 'cheque' | 'online_portal'>('cash');
  const [transactionRef, setTransactionRef] = useState('');

  // Receipt Modal
  const [receiptRecord, setReceiptRecord] = useState<StudentFee | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const canRecord =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'principal' ||
    currentUser?.role === 'accountant';

  // Fee metrics
  let totalBilled = 0;
  let totalCollected = 0;
  scopedStudentFees.forEach((f) => {
    totalBilled += f.amount - (f.discount || 0);
    totalCollected += f.paidAmount || 0;
  });
  const totalOutstanding = Math.max(0, totalBilled - totalCollected);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 85;

  const filteredFees = useMemo(() => {
    return scopedStudentFees.filter((fee) => {
      const student = scopedStudents.find((s) => s.id === fee.studentId);
      if (!student) return false;

      const matchSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fee.receiptNo && fee.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchClass = selectedClassFilter ? fee.classId === selectedClassFilter : true;
      const matchStatus = selectedStatusFilter ? fee.status === selectedStatusFilter : true;

      return matchSearch && matchClass && matchStatus;
    });
  }, [scopedStudentFees, scopedStudents, searchQuery, selectedClassFilter, selectedStatusFilter]);

  const handleOpenRecord = (fee: StudentFee) => {
    setSelectedFeeRecord(fee);
    const balance = fee.amount - (fee.discount || 0) - (fee.paidAmount || 0);
    setPaymentAmount(balance > 0 ? balance : 5000);
    setPaymentMode('cash');
    setTransactionRef(`TXN-BSM-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsRecordPaymentOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeRecord) return;

    addFeePayment(selectedFeeRecord.id, paymentAmount, paymentMode, transactionRef);
    setIsRecordPaymentOpen(false);
  };

  const handleViewReceipt = (fee: StudentFee) => {
    setReceiptRecord(fee);
    setIsReceiptOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Fee Records & Accounting Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Maintain transparent school fee accounts, receipt generation, and dues tracking
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ledger'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Student Fee Ledger
          </button>
          <button
            onClick={() => setActiveTab('structures')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'structures'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Fee Structure Rates
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Billed</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-heading">
            ₹{totalBilled.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">Academic Session 2025-26</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block">
            Collected Total
          </span>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1 font-heading">
            ₹{totalCollected.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {collectionRate}% Realization
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400 block">
            Outstanding Dues
          </span>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1 font-heading">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-rose-600 dark:text-rose-400">Pending collections</span>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-orange-700 dark:text-orange-400 block">
            Auditing Mode
          </span>
          <p className="text-lg font-bold text-orange-700 dark:text-orange-300 mt-1 font-heading">
            Zero-Monetization
          </p>
          <span className="text-[10px] text-orange-600 dark:text-orange-400">Free platform records</span>
        </div>
      </div>

      {activeTab === 'ledger' ? (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ledger by student name, admission no, receipt..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="w-1/2 md:w-36 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
              >
                <option value="">All Classes</option>
                {scopedClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-1/2 md:w-36 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
              >
                <option value="">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3.5">Student Details</th>
                    <th className="px-4 py-3.5">Fee Particulars</th>
                    <th className="px-4 py-3.5">Billed Amount</th>
                    <th className="px-4 py-3.5">Paid Amount</th>
                    <th className="px-4 py-3.5">Due Balance</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredFees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        <Receipt className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="font-semibold text-sm">No fee records found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredFees.map((fee) => {
                      const student = scopedStudents.find((s) => s.id === fee.studentId);
                      const cls = scopedClasses.find((c) => c.id === fee.classId);
                      const structure = scopedFeeStructures.find((s) => s.id === fee.feeStructureId);

                      const balance = fee.amount - (fee.discount || 0) - (fee.paidAmount || 0);

                      return (
                        <tr
                          key={fee.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {student ? student.name : 'Student'}
                            </div>
                            <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-semibold">
                              {student ? student.admissionNo : ''}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {structure ? structure.name : 'Tuition Fee'}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              Due: {fee.dueDate} • {cls ? cls.name : ''}
                            </span>
                          </td>

                          <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                            ₹{fee.amount.toLocaleString('en-IN')}
                          </td>

                          <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{(fee.paidAmount || 0).toLocaleString('en-IN')}
                          </td>

                          <td className="px-4 py-3 font-mono font-bold text-rose-600 dark:text-rose-400">
                            ₹{Math.max(0, balance).toLocaleString('en-IN')}
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                fee.status === 'paid'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                  : fee.status === 'partial'
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                              }`}
                            >
                              {fee.status}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {fee.status !== 'paid' && canRecord && (
                                <button
                                  onClick={() => handleOpenRecord(fee)}
                                  className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] transition-colors"
                                >
                                  Record Payment
                                </button>
                              )}

                              <button
                                onClick={() => handleViewReceipt(fee)}
                                className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Print Receipt"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Fee Structures Rates Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scopedFeeStructures.map((struct) => {
            const cls = scopedClasses.find((c) => c.id === struct.classId);

            return (
              <div
                key={struct.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">
                      {struct.name}
                    </h3>
                    <p className="text-xs text-orange-600 font-semibold mt-0.5">
                      {cls ? cls.name : 'Applicable Grade'}
                    </p>
                  </div>
                  <span className="text-lg font-black text-slate-900 dark:text-white font-heading">
                    ₹{struct.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Tuition Component:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      ₹{struct.tuitionFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Examination Fee:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      ₹{struct.examFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sports & Lab Activity:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      ₹{(struct.sportsFee + struct.labFee).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frequency:</span>
                    <span className="font-semibold uppercase text-[10px] text-slate-500">
                      {struct.frequency}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        title="Record Fee Payment Receipt"
        subtitle={`Student: ${scopedStudents.find((s) => s.id === selectedFeeRecord?.studentId)?.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleSavePayment} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Payment Amount (INR ₹) *
            </label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              required
              className="w-full px-3 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Payment Collection Mode
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-bold capitalize"
            >
              <option value="cash">Cash In Hand (School Counter)</option>
              <option value="bank_transfer">Direct Bank Transfer (NEFT/RTGS/IMPS)</option>
              <option value="cheque">Demand Draft / Cheque</option>
              <option value="online_portal">UPI Reference / POS Terminal</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Reference / Instrument / Receipt No
            </label>
            <input
              type="text"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="e.g. UPI-9847120194 or CHQ-00192"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsRecordPaymentOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md"
            >
              Confirm Payment & Issue Receipt
            </button>
          </div>
        </form>
      </Modal>

      {/* Official Printable Fee Receipt Modal */}
      {receiptRecord && (
        <Modal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          title="Official Fee Payment Receipt"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Printable Receipt Card */}
            <div id="official-fee-receipt" className="p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white space-y-4">
              {/* Receipt Header */}
              <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black font-heading text-slate-900 dark:text-white">
                    {currentSchool?.name || 'Bharat Model Higher Secondary School'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Affiliation: {currentSchool?.affiliationNo || 'CBSE-2025-AFF-9921'} • {currentSchool?.city || 'New Delhi'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-mono">
                    FEE RECEIPT
                  </span>
                  <p className="text-[10px] font-mono mt-1 text-slate-400">
                    No: {receiptRecord.receiptNo || 'REC-2025-081'}
                  </p>
                </div>
              </div>

              {/* Student Details Row */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block">Student Name:</span>
                  <span className="font-bold text-sm">
                    {scopedStudents.find((s) => s.id === receiptRecord.studentId)?.name}
                  </span>
                  <span className="text-[10px] block font-mono text-slate-500">
                    Adm: {scopedStudents.find((s) => s.id === receiptRecord.studentId)?.admissionNo}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Date of Payment:</span>
                  <span className="font-bold font-mono">
                    {receiptRecord.paidDate || new Date().toISOString().substring(0, 10)}
                  </span>
                  <span className="text-[10px] block capitalize text-slate-500">
                    Mode: {receiptRecord.paymentMethod || 'Cash'}
                  </span>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="p-2.5">Particulars</th>
                      <th className="p-2.5 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    <tr>
                      <td className="p-2.5 font-sans font-medium">Tuition & Academic Development Fee</td>
                      <td className="p-2.5 text-right">₹{receiptRecord.amount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium">Waiver / Scholarship Discount</td>
                      <td className="p-2.5 text-right text-emerald-600">-₹{(receiptRecord.discount || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="font-bold bg-slate-50 dark:bg-slate-900">
                      <td className="p-2.5 font-sans">Total Paid & Received with Thanks</td>
                      <td className="p-2.5 text-right text-emerald-600">
                        ₹{(receiptRecord.paidAmount || receiptRecord.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Seal and Signature */}
              <div className="flex items-center justify-between pt-6">
                <div className="text-center">
                  <div className="w-20 h-8 border-b border-dashed border-slate-400 mx-auto" />
                  <span className="text-[9px] text-slate-400 mt-1 block">Accountant Seal</span>
                </div>
                <div className="text-center">
                  <div className="w-24 h-8 border-b border-dashed border-slate-400 mx-auto" />
                  <span className="text-[9px] text-slate-400 mt-1 block">Authorized Signature</span>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
