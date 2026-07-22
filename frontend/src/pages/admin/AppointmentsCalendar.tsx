import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import type { Appointment, Tenant, Doctor } from '../../services/db';
import { FaChevronLeft, FaChevronRight, FaCalendarDay, FaUser, FaPhone, FaMapMarkerAlt, FaVideo, FaInfoCircle } from 'react-icons/fa';

export const AppointmentsCalendar = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'day'>('month');
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    db.getAllTenants().then(t => {
      setTenants(t);
      if (t.length > 0) setSelectedTenant(t[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedTenant) {
      setLoading(true);
      // Fetch doctors first
      db.getDoctorsByTenant(selectedTenant).then(setDoctors);
      setSelectedDoctor(''); // reset filter
      
      db.getAppointments(selectedTenant).then(appts => {
        setAppointments(appts);
        setLoading(false);
      });
    }
  }, [selectedTenant]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevDay = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  const nextDay = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));

  const getDateString = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getAppointmentsForDate = (dateStr: string) => {
    return appointments.filter(a => {
      const isDateMatch = a.date === dateStr;
      const isDoctorMatch = selectedDoctor ? a.doctor_id === selectedDoctor : true;
      return isDateMatch && isDoctorMatch;
    });
  };

  // Calendar cells
  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded overflow-hidden mt-4">
      {dayNames.map(day => (
        <div key={day} className="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-500">
          {day}
        </div>
      ))}
      {calendarCells.map((day, idx) => {
        if (day === null) return <div key={`empty-${idx}`} className="bg-white min-h-[120px]" />;

        const dateStr = getDateString(new Date(year, month, day));
        const dayAppts = getAppointmentsForDate(dateStr);
        const isToday = getDateString(new Date()) === dateStr;

        return (
          <div key={day} className={`bg-white min-h-[120px] p-2 flex flex-col border-b border-r border-gray-100 ${isToday ? 'bg-blue-50/20' : ''}`}>
            <span className={`text-sm w-8 h-8 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
              {day}
            </span>
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] scrollbar-hide">
              {dayAppts.map(appt => (
                <button
                  key={appt.id}
                  onClick={() => setSelectedAppointment(appt)}
                  className="text-left bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs p-1.5 rounded truncate border border-indigo-100 transition-colors flex flex-col gap-0.5"
                >
                  <span className="truncate"><span className="font-semibold">{appt.time_slot}</span> - {appt.patient_name}</span>
                  {!selectedDoctor && appt.doctor && (
                    <span className="text-[9px] text-indigo-500 font-medium truncate">Dr. {appt.doctor.name}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDayView = () => {
    const dateStr = getDateString(currentDate);
    const dayAppts = getAppointmentsForDate(dateStr).sort((a, b) => {
      // Very basic time sort assuming HH:MM AM/PM
      return new Date(`1970/01/01 ${a.time_slot}`).getTime() - new Date(`1970/01/01 ${b.time_slot}`).getTime();
    });

    return (
      <div className="mt-4 flex flex-col gap-3">
        {dayAppts.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded p-12 text-center text-gray-500">
            No appointments scheduled for this date.
          </div>
        ) : (
          dayAppts.map(appt => (
            <div key={appt.id} onClick={() => setSelectedAppointment(appt)} className="bg-white border border-gray-100 rounded p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 items-center">
              <div className="w-24 shrink-0 text-center border-r border-gray-100 pr-4">
                <div className="text-lg font-bold text-indigo-600">{appt.time_slot.split(' ')[0]}</div>
                <div className="text-xs text-gray-500 font-semibold">{appt.time_slot.split(' ')[1]}</div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-bold text-gray-800">{appt.patient_name}</h4>
                  {!selectedDoctor && appt.doctor && (
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold">Dr. {appt.doctor.name}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><FaUser className="text-gray-400" /> {appt.patient_gender}, {appt.patient_age} Yrs</span>
                  <span className="flex items-center gap-1"><FaPhone className="text-gray-400" /> +91 {appt.patient_mobile}</span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${appt.type === 'Online' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {appt.type === 'Online' ? <FaVideo /> : <FaMapMarkerAlt />} {appt.type}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                <FaInfoCircle />
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointments Calendar</h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-64 p-2.5 outline-none"
              >
                <option value="" disabled>Select a Hospital</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              {selectedTenant && (
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-64 p-2.5 outline-none"
                >
                  <option value="">All Specialists</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.speciality})</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded border border-gray-100">
              <button onClick={view === 'month' ? prevMonth : prevDay} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-indigo-600 shadow-sm transition-colors">
                <FaChevronLeft className="text-sm" />
              </button>
              <div className="w-36 text-center font-bold text-gray-800">
                {view === 'month'
                  ? `${monthNames[month]} ${year}`
                  : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <button onClick={view === 'month' ? nextMonth : nextDay} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-indigo-600 shadow-sm transition-colors">
                <FaChevronRight className="text-sm" />
              </button>
            </div>

            <div className="flex bg-gray-100 p-1 rounded">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Month
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${view === 'day' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        {/* Main Calendar View */}
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">Loading appointments...</div>
        ) : (
          view === 'month' ? renderMonthView() : renderDayView()
        )}

      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Appointment Details</h3>
              <button onClick={() => setSelectedAppointment(null)} className="text-white/80 hover:text-white">&times;</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Patient</span>
                <span className="font-bold text-gray-900">{selectedAppointment.patient_name}</span>
              </div>
              {selectedAppointment.doctor && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Doctor</span>
                  <span className="font-bold text-gray-900">Dr. {selectedAppointment.doctor.name}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Date & Time</span>
                <span className="font-bold text-gray-900">{selectedAppointment.date} at {selectedAppointment.time_slot}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Type</span>
                <span className="font-bold text-gray-900">{selectedAppointment.type}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Mobile</span>
                <span className="font-bold text-gray-900">+91 {selectedAppointment.patient_mobile}</span>
              </div>
              {selectedAppointment.patient_email && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Email</span>
                  <span className="font-bold text-gray-900">{selectedAppointment.patient_email}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Gender/Age</span>
                <span className="font-bold text-gray-900">{selectedAppointment.patient_gender}, {selectedAppointment.patient_age}</span>
              </div>
              {selectedAppointment.patient_description && (
                <div className="pt-2">
                  <span className="text-gray-500 block mb-2">Reason / Symptoms</span>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-800 border border-gray-100">
                    {selectedAppointment.patient_description}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setSelectedAppointment(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
