import { useState } from "react";
import { X, Calendar, Clock, User, Building } from "lucide-react";
import type { Staff, Branch } from "@/types/shift";

interface ScheduleShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
  branches: Branch[];
  onSave?: (data: any) => void;
}

export default function ScheduleShiftModal({
  isOpen,
  onClose,
  staffList,
  branches,
  onSave,
}: ScheduleShiftModalProps) {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id.toString() ?? "");
  const [shiftType, setShiftType] = useState("morning");
  const [date, setDate] = useState("2024-01-10");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({ selectedStaff, selectedBranch, shiftType, date });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 transition-all border border-slate-100"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Schedule New Shift</h2>
            <p className="text-xs text-slate-400 mt-0.5">Lên lịch ca làm việc cho thu ngân</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Staff Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-blue-600" />
              Cashier / Staff
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all"
            >
              <option value="">-- Chọn thu ngân (Unassigned) --</option>
              {staffList.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.full_name} ({st.role})
                </option>
              ))}
            </select>
          </div>

          {/* Branch Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Building size={14} className="text-blue-600" />
              Chi nhánh
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-blue-600" />
              Ngày phân công
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all"
            />
          </div>

          {/* Shift Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Clock size={14} className="text-blue-600" />
              Khung giờ ca
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "morning", label: "Morning", time: "8AM - 12PM" },
                { id: "afternoon", label: "Afternoon", time: "1PM - 5PM" },
                { id: "evening", label: "Evening", time: "5PM - 9PM" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShiftType(s.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    shiftType === s.id
                      ? "border-blue-600 bg-blue-50/50 text-blue-700 font-semibold"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  <p className="text-xs">{s.label}</p>
                  <p className="text-[10px] opacity-70 mt-0.5">{s.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
            >
              Tạo ca làm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}