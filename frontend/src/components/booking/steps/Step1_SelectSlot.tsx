import React, { useState } from 'react';
import type { BookingData } from '../../../pages/BookingWizardPage';
import { motion } from 'framer-motion';
import { FaVideo, FaUserMd, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Props {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  next: () => void;
}

export const Step1_SelectSlot: React.FC<Props> = ({ data, updateData, next }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const timeSlots = data.type === 'Online'
    ? (data.doctor?.onlineHours || [])
    : (data.doctor?.inPersonHours || []);

  const handleNext = () => {
    if (data.date && data.timeSlot && data.type) {
      next();
    }
  };

  const isComplete = data.date && data.timeSlot && data.type;

  // Generate calendar grid array
  const calendarCells = [];
  // previous month padding
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  // current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  // Create date string for comparison YYYY-MM-DD
  const getDateString = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-xl  text-gray-800">Select Date & Time</h3>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-hide">

        {/* Left: Large Calendar Grid */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col min-w-0">

          {/* Calendar Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
            <h4 className="text-xl  text-gray-800 flex items-center gap-4">
              {monthNames[month]} {year}
              <div className="flex gap-1">
                <button onClick={prevMonth} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  <FaChevronLeft className="text-sm" />
                </button>
                <button onClick={nextMonth} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            </h4>

            <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded bg-[var(--color-primary)] text-white text-sm font-medium shadow-sm">Month</button>
              <button className="px-4 py-1.5 rounded text-gray-500 hover:bg-white text-sm font-medium">Week</button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100 flex-1">
            {/* Day Headers */}
            {dayNames.map(day => (
              <div key={day} className="bg-gray-50 py-3 text-center text-sm font-semibold text-gray-500">
                {day}
              </div>
            ))}

            {/* Calendar Cells */}
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="bg-white min-h-[90px]" />;
              }

              const dateStr = getDateString(day);
              const isSelected = data.date === dateStr;
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
              const isUnavailable = data.doctor?.unavailableDates?.includes(dateStr);

              // Randomly mock some events/availability just for visual flair as in screenshot, but not if unavailable
              const hasEvents = !isUnavailable && ((day % 3 === 0) || (day % 7 === 0));

              return (
                <button
                  key={day}
                  disabled={isUnavailable}
                  onClick={() => updateData({ date: dateStr, timeSlot: null })} // Reset time slot when changing date
                  className={`bg-white min-h-[90px] p-2 flex flex-col items-start transition-all relative border-b border-r border-gray-100 ${isSelected ? 'ring-2 ring-inset ring-[var(--color-primary)] bg-blue-50/30' : ''
                    } ${isUnavailable ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}`}
                >
                  <span className={`text-sm  w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-[var(--color-primary)] text-white' : isSelected ? 'text-[var(--color-primary)]' : 'text-gray-700'
                    } ${isUnavailable ? 'line-through text-gray-400' : ''}`}>
                    {day}
                  </span>

                  {hasEvents && !isSelected && (
                    <div className="mt-2 w-full px-1">
                      <div className="w-full bg-[#fdf0f3] text-[#d65b79] text-[10px]  p-1 rounded mb-1 truncate">3 Available</div>
                    </div>
                  )}
                  {isUnavailable && (
                    <div className="mt-2 w-full px-1">
                      <div className="w-full bg-gray-200 text-gray-500 text-[10px]  p-1 rounded mb-1 truncate shadow-sm">Unavailable</div>
                    </div>
                  )}
                  {isSelected && (
                    <div className="mt-2 w-full px-1">
                      <div className="w-full bg-[var(--color-primary)] text-white text-[10px]  p-1 rounded mb-1 truncate shadow-sm">Selected</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selection Controls (Type & Time) */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">

          {/* Consultation Type */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <label className="block text-sm  text-gray-800 mb-4">Consultation Type</label>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => updateData({ type: 'In-Person' })}
                className={`p-3 border rounded-xl flex items-center gap-3 transition-all ${data.type === 'In-Person'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.type === 'In-Person' ? 'bg-[var(--color-primary)]/10' : 'bg-gray-100'}`}>
                  <FaUserMd className="text-lg" />
                </div>
                <div className="text-left">
                  <div className="">In-Person</div>
                  <div className="text-xs opacity-70 mt-0.5">Visit the clinic</div>
                </div>
              </button>
              <button
                onClick={() => updateData({ type: 'Online' })}
                className={`p-3 border rounded-xl flex items-center gap-3 transition-all ${data.type === 'Online'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.type === 'Online' ? 'bg-[var(--color-primary)]/10' : 'bg-gray-100'}`}>
                  <FaVideo className="text-lg" />
                </div>
                <div className="text-left">
                  <div className="">Online Video</div>
                  <div className="text-xs opacity-70 mt-0.5">Consult from home</div>
                </div>
              </button>
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex-1">
            <label className="block text-sm  text-gray-800 mb-4">
              Time Slot {data.date && <span className="text-[var(--color-primary)] ml-1">({new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</span>}
            </label>

            {!data.date ? (
              <div className="h-40 flex items-center justify-center text-sm text-gray-400 text-center border-2 border-dashed border-gray-100 rounded-xl">
                Please select a date from the calendar first.
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-3"
              >
                {timeSlots.length === 0 ? (
                  <div className="col-span-2 text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
                    No slots available for this consultation type.
                  </div>
                ) : (
                  timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => updateData({ timeSlot: time })}
                      className={`py-3 px-3 text-sm font-semibold rounded-xl transition-all ${data.timeSlot === time
                          ? 'bg-[var(--color-primary)] text-white shadow-md'
                          : 'bg-gray-50 border border-gray-100 hover:border-[var(--color-primary)] hover:bg-blue-50/30 text-gray-700'
                        }`}
                    >
                      {time}
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </div>

        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!isComplete}
          className={`px-10 py-3.5 rounded-xl  transition-all text-lg ${isComplete
              ? 'bg-[var(--color-primary)] text-white hover:opacity-90 shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
