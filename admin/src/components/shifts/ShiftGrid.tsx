import { useRef, useEffect } from "react";
import type { CashierShift, Staff } from "@/types/shift";
import ShiftCapsule from "./ShiftCapsule";

interface ShiftGridProps {
  view: "week" | "month";
  shifts: CashierShift[];
  staffMap: Record<number, Staff>;
  onShiftClick: (shift: CashierShift) => void;
  selectedDay: { week: number; day: number };
  onDaySelect: (week: number, day: number) => void;
  monthOffset: number;
}

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4"];

function getDateNumber(weekIdx: number, dayIdx: number, monthOffset: number) {
  const base = new Date(2024, 0 + monthOffset, 1);
  const firstDay = base.getDay();
  const mondayOffset = firstDay === 0 ? -6 : 1 - firstDay;
  const date = new Date(base);
  date.setDate(date.getDate() + mondayOffset + weekIdx * 7 + dayIdx);
  return date.getDate();
}

function formatHour(h: number) {
  if (h === 0) return "12 AM";
  if (h === 12) return "Noon";
  if (h > 12) return `${h - 12} PM`;
  return `${h} AM`;
}

function normalizeShiftForLogic(shift: CashierShift, isPast: boolean, isFuture: boolean): CashierShift {
  if (isFuture) {
    return {
      ...shift,
      status: "closed",
      capsuleType: shift.staff_id ? "scheduled" : "unassigned",
      cash_discrepancy: null,
      actual_cash_counted: null,
    };
  }
  if (isPast && shift.capsuleType === "active") {
    return {
      ...shift,
      status: "closed",
      capsuleType: shift.cash_discrepancy ? "discrepancy" : "closed",
    };
  }
  return shift;
}

export default function ShiftGrid({
  view,
  shifts,
  staffMap,
  onShiftClick,
  selectedDay,
  onDaySelect,
  monthOffset,
}: ShiftGridProps) {
  // Ref container cuộn hợp nhất (Cả X và Y)
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const hasMoved = useRef(false);

  const CELL_HEIGHT = 72;
  const TIME_COL_WIDTH = 64;
  const DAY_COL_WIDTH = 130;

  // --- TỰ ĐỘNG CĂN GIỮA NGÀY & TUẦN ĐANG CHỌN ---
  useEffect(() => {
    if (view === "week" && mainScrollRef.current) {
      const container = mainScrollRef.current;
      const dayIndexGlobal = selectedDay.week * 7 + selectedDay.day;
      const targetDayLeft = TIME_COL_WIDTH + dayIndexGlobal * DAY_COL_WIDTH;
      const containerWidth = container.clientWidth;
      const scrollToPos = targetDayLeft + DAY_COL_WIDTH / 2 - containerWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollToPos),
        behavior: "smooth",
      });
    }
  }, [selectedDay, view]);

  // --- KÉO RÊ CHUỘT MƯỢT KHÔNG BỊ MẤT CON TRỎ ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mainScrollRef.current || e.button !== 0) return;
    isMouseDown.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - mainScrollRef.current.offsetLeft;
    scrollLeftPos.current = mainScrollRef.current.scrollLeft;

    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };

  const handleMouseLeaveOrUp = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !mainScrollRef.current) return;
    const x = e.pageX - mainScrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    if (Math.abs(walk) > 4) {
      hasMoved.current = true;
    }
    mainScrollRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const handleShiftCapsuleClick = (shift: CashierShift) => {
    if (!hasMoved.current) {
      onShiftClick(shift);
    }
  };

  const TODAY_WEEK = 1;
  const TODAY_DAY = 2;

  function getShiftsForCell(weekIdx: number, dayIdx: number, hour: number) {
    const isPast = weekIdx < TODAY_WEEK || (weekIdx === TODAY_WEEK && dayIdx < TODAY_DAY);
    const isFuture = weekIdx > TODAY_WEEK || (weekIdx === TODAY_WEEK && dayIdx > TODAY_DAY);

    return shifts
      .filter(
        (s) =>
          s.weekIndex === weekIdx &&
          s.dayIndex === dayIdx &&
          s.startHour <= hour &&
          s.endHour > hour
      )
      .map((s) => normalizeShiftForLogic(s, isPast, isFuture));
  }

  // --- MONTH VIEW ---
  if (view === "month") {
    return (
      <div
        className="rounded-3xl overflow-hidden flex-1 bg-white p-6"
        style={{ boxShadow: "0px 20px 40px rgba(0, 114, 206, 0.08)" }}
      >
        <div className="grid grid-cols-7 gap-3 mb-3 text-center">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
            <div key={d} className="text-xs font-bold uppercase tracking-wider text-slate-400 py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-3" style={{ minHeight: 520 }}>
          {Array.from({ length: 28 }).map((_, idx) => {
            const wIdx = Math.floor(idx / 7);
            const dIdx = idx % 7;
            const dateNum = getDateNumber(wIdx, dIdx, monthOffset);
            const isSelected = selectedDay.week === wIdx && selectedDay.day === dIdx;
            const dayShifts = shifts.filter((s) => s.weekIndex === wIdx && s.dayIndex === dIdx);

            return (
              <div
                key={idx}
                onClick={() => onDaySelect(wIdx, dIdx)}
                className="rounded-2xl p-2.5 border transition-all cursor-pointer flex flex-col justify-between"
                style={{
                  borderColor: isSelected ? "#0072CE" : "#EEF2FF",
                  background: isSelected ? "rgba(0,114,206,0.04)" : "#FAFBFF",
                  boxShadow: isSelected ? "0 0 0 2px rgba(0,114,206,0.2)" : "none",
                }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                    style={{
                      background: isSelected ? "#0072CE" : "transparent",
                      color: isSelected ? "#fff" : "#1E293B",
                    }}
                  >
                    {dateNum}
                  </span>
                  {dayShifts.length > 0 && (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded-md">
                      {dayShifts.length} ca
                    </span>
                  )}
                </div>
                <div className="space-y-1 mt-2">
                  {dayShifts.slice(0, 2).map((s) => {
                    const st = staffMap[s.staff_id ?? -1];
                    return (
                      <div
                        key={s.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onShiftClick(s);
                        }}
                        className="text-[11px] font-medium truncate px-2 py-1 rounded-lg"
                        style={{ background: "#EEF2FF", color: "#4338CA" }}
                      >
                        {st ? st.full_name : s.label}
                      </div>
                    );
                  })}
                  {dayShifts.length > 2 && (
                    <p className="text-[10px] text-slate-400 text-center font-medium">
                      +{dayShifts.length - 2} ca khác
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- WEEK VIEW ---
  return (
    <div
      className="rounded-3xl overflow-hidden flex-1 flex flex-col"
      style={{
        background: "#fff",
        boxShadow: "0px 20px 40px rgba(0, 114, 206, 0.08)",
        minHeight: 0,
      }}
    >
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
          height: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #F1F5F9;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>

      {/* Frame cuộn hợp nhất */}
      <div
        ref={mainScrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className="overflow-auto flex-1 custom-scroll"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <div style={{ width: TIME_COL_WIDTH + WEEKS.length * 7 * DAY_COL_WIDTH }}>
          
          {/* Header Tuần/Ngày cố định phía trên (Sticky Top) */}
          <div
            className="flex border-b sticky top-0 z-30"
            style={{ borderColor: "#E2E8F0", background: "#fff" }}
          >
            {/* Ô Góc Trên-Trái: Ghim cố định cả 2 chiều Top & Left */}
            <div
              className="flex-shrink-0 border-r sticky left-0 z-40"
              style={{
                width: TIME_COL_WIDTH,
                borderColor: "#E2E8F0",
                background: "#FAFBFF",
              }}
            />

            {/* Các cột tuần & ngày */}
            {WEEKS.map((week, wIdx) => (
              <div
                key={wIdx}
                className="flex-1 border-r last:border-r-0"
                style={{ borderColor: "#E2E8F0", width: DAY_COL_WIDTH * 7 }}
              >
                <div
                  className="text-center py-1.5 text-xs font-semibold tracking-widest uppercase border-b"
                  style={{
                    color: "#64748B",
                    borderColor: "#EEF2FF",
                    background: "#FAFBFF",
                  }}
                >
                  {week}
                </div>
                <div className="flex">
                  {DAYS.map((day, dIdx) => {
                    const dateNum = getDateNumber(wIdx, dIdx, monthOffset);
                    const isSelected = selectedDay.week === wIdx && selectedDay.day === dIdx;
                    const isWeekend = dIdx >= 5;
                    return (
                      <button
                        key={dIdx}
                        onClick={() => {
                          if (!hasMoved.current) onDaySelect(wIdx, dIdx);
                        }}
                        className="flex-1 flex flex-col items-center py-2 transition-all cursor-pointer hover:bg-blue-50/50"
                        style={{
                          width: DAY_COL_WIDTH,
                          background: isSelected
                            ? "rgba(0,114,206,0.12)"
                            : isWeekend
                            ? "#FAFBFF"
                            : "transparent",
                          borderRight: dIdx < 6 ? "1px solid #EEF2FF" : undefined,
                        }}
                      >
                        <span
                          className="text-xs font-semibold"
                          style={{ color: isSelected ? "#0072CE" : "#64748B" }}
                        >
                          {day}
                        </span>
                        <span
                          className="text-sm font-bold mt-0.5 rounded-full w-7 h-7 flex items-center justify-center transition-all"
                          style={{
                            color: isSelected ? "#fff" : isWeekend ? "#94A3B8" : "#1E293B",
                            background: isSelected ? "#0072CE" : "transparent",
                            boxShadow: isSelected ? "0 2px 8px rgba(0,114,206,0.35)" : "none",
                          }}
                        >
                          {dateNum}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Nội dung chính bên dưới */}
          <div className="relative flex">
            
            {/* Cột Mốc Giờ Bên Trái: Ghim cố định mép trái (Sticky Left) */}
            <div
              className="flex-shrink-0 sticky left-0 z-20 border-r"
              style={{
                width: TIME_COL_WIDTH,
                background: "#FAFBFF",
                borderColor: "#EEF2FF",
              }}
            >
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="flex items-start justify-end pr-3 border-b"
                  style={{
                    height: CELL_HEIGHT,
                    borderColor: "#EEF2FF",
                    paddingTop: 6,
                  }}
                >
                  <span className="text-xs font-semibold" style={{ color: "#94A3B8" }}>
                    {formatHour(hour)}
                  </span>
                </div>
              ))}
            </div>

            {/* Lưới các ca làm việc */}
            <div className="flex flex-1 relative">
              {WEEKS.map((_, wIdx) => (
                <div
                  key={wIdx}
                  className="flex-1 border-r last:border-r-0 flex"
                  style={{ borderColor: "#E2E8F0", width: DAY_COL_WIDTH * 7 }}
                >
                  {DAYS.map((_, dIdx) => {
                    const isSelected = selectedDay.week === wIdx && selectedDay.day === dIdx;
                    const isWeekend = dIdx >= 5;
                    return (
                      <div
                        key={dIdx}
                        className="border-r last:border-r-0 flex-1"
                        style={{
                          borderColor: "#EEF2FF",
                          width: DAY_COL_WIDTH,
                          background: isSelected
                            ? "rgba(0,114,206,0.05)"
                            : isWeekend
                            ? "rgba(248,250,252,0.6)"
                            : "transparent",
                        }}
                      >
                        {HOURS.map((hour) => {
                          const cellShifts = getShiftsForCell(wIdx, dIdx, hour);
                          return (
                            <div
                              key={hour}
                              className="border-b relative"
                              style={{
                                height: CELL_HEIGHT,
                                borderColor: "#EEF2FF",
                                padding: "3px 4px",
                              }}
                            >
                              {cellShifts.map((shift) => (
                                <ShiftCapsule
                                  key={shift.id}
                                  shift={shift}
                                  staff={
                                    shift.staff_id != null
                                      ? staffMap[shift.staff_id]
                                      : undefined
                                  }
                                  onClick={() => handleShiftCapsuleClick(shift)}
                                  compact={cellShifts.length > 1}
                                />
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}