import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Stethoscope, MapPin, X } from 'lucide-react';
import { StatusPill } from './StatusPill';

const DAYS = [
  { key: '2026-09-28', label: 'Mon', date: 'Sep 28' },
  { key: '2026-09-29', label: 'Tue', date: 'Sep 29' },
  { key: '2026-09-30', label: 'Wed', date: 'Sep 30' },
  { key: '2026-10-01', label: 'Thu', date: 'Oct 01' },
  { key: '2026-10-02', label: 'Fri', date: 'Oct 02' },
  { key: '2026-10-03', label: 'Sat', date: 'Oct 03' },
  { key: '2026-10-04', label: 'Sun', date: 'Oct 04' }
];

const TIME_SLOTS = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM'
];

export const WeeklyCalendar = ({ appointments, doctors, onUpdateStatus }) => {
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [activeModalAppointment, setActiveModalAppointment] = useState(null);

  const filteredAppointments = appointments.filter(apt => {
    if (selectedDoctor !== 'all' && apt.doctorId !== selectedDoctor) return false;
    return true;
  });

  const getAppointmentsForCell = (dateKey, timeSlot) => {
    return filteredAppointments.filter(apt => {
      if (apt.date !== dateKey) return false;
      // Match hour loosely (e.g. "09:30 AM" matches "09:00 AM" row)
      const slotHour = timeSlot.split(':')[0];
      const slotMeridiem = timeSlot.split(' ')[1];
      const aptHour = apt.time.split(':')[0];
      const aptMeridiem = apt.time.split(' ')[1];
      return slotHour === aptHour && slotMeridiem === aptMeridiem;
    });
  };

  const getEventStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-[#E6F4EC] border-l-4 border-l-[#0F7A4C] text-[#1A1A1A] hover:border-[#0F7A4C]';
      case 'Checked-In':
        return 'bg-blue-50 border-l-4 border-l-blue-600 text-[#1A1A1A] hover:border-blue-600';
      case 'Requested':
        return 'bg-amber-50 border-l-4 border-l-amber-500 text-[#1A1A1A] hover:border-amber-500';
      case 'Completed':
        return 'bg-[#F7F7F7] border-l-4 border-l-[#5C5C5C] text-[#5C5C5C] hover:border-[#5C5C5C]';
      case 'Cancelled':
        return 'bg-[#FDE8E8] border-l-4 border-l-[#C4302B] text-[#C4302B] opacity-60';
      default:
        return 'bg-[#F7F7F7] border-l-4 border-l-neutral-400 text-[#1A1A1A]';
    }
  };

  return (
    <div className="health-card overflow-hidden">
      {/* Calendar Header Controls */}
      <div className="p-4 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E6F4EC] text-[#0F7A4C] rounded-lg">
            <CalendarIcon className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Clinic Schedule Grid
            </h2>
            <p className="text-xs text-[#5C5C5C]">
              Week of September 28 – October 04, 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Doctor filter dropdown */}
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="text-xs bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-1.5 text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
          >
            <option value="all">All Physicians ({doctors.length})</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
            ))}
          </select>

          {/* Legend indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs text-[#5C5C5C] border-l border-[#E5E5E5] pl-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0F7A4C]" /> Confirmed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> Checked-In
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Requested
            </span>
          </div>
        </div>
      </div>

      {/* Grid container with horizontal scroll for responsiveness */}
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-[#E5E5E5] bg-[#F7F7F7] text-xs">
            <div className="p-2.5 text-[#5C5C5C] font-medium text-center border-r border-[#E5E5E5]">
              Time Slot
            </div>
            {DAYS.map(day => (
              <div
                key={day.key}
                className="p-2.5 text-center border-r border-[#E5E5E5] last:border-r-0"
              >
                <span className="text-[11px] uppercase font-semibold text-[#5C5C5C] block">
                  {day.label}
                </span>
                <span className="text-xs font-semibold text-[#1A1A1A]">
                  {day.date}
                </span>
              </div>
            ))}
          </div>

          {/* Time Slot Rows */}
          <div className="divide-y divide-[#E5E5E5]">
            {TIME_SLOTS.map(timeSlot => (
              <div key={timeSlot} className="grid grid-cols-8 min-h-[72px]">
                {/* Time Slot Label */}
                <div className="p-2 text-xs font-medium text-[#5C5C5C] bg-[#F7F7F7] flex items-start justify-center border-r border-[#E5E5E5]">
                  {timeSlot}
                </div>

                {/* Day Cells */}
                {DAYS.map(day => {
                  const cellAppointments = getAppointmentsForCell(day.key, timeSlot);
                  return (
                    <div
                      key={`${day.key}-${timeSlot}`}
                      className="p-1 border-r border-[#E5E5E5] last:border-r-0 hover:bg-[#FBFBFB] transition-colors relative"
                    >
                      {cellAppointments.map(apt => (
                        <div
                          key={apt.id}
                          onClick={() => setActiveModalAppointment(apt)}
                          className={`p-1.5 rounded border border-[#E5E5E5] shadow-xs cursor-pointer text-xs mb-1 transition-transform hover:-translate-y-0.5 ${getEventStyle(apt.status)}`}
                          title={`Click to inspect or change status: ${apt.patientName}`}
                        >
                          <div className="font-semibold text-[11px] truncate flex items-center justify-between">
                            <span>{apt.patientName}</span>
                            <span className="text-[10px] opacity-75">{apt.time}</span>
                          </div>
                          <div className="text-[10px] text-[#5C5C5C] truncate mt-0.5">
                            {apt.doctorName.replace(', MD', '')}
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[9px] px-1 py-0.2 rounded font-medium bg-white/80 text-[#1A1A1A]">
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Detail & Status Update Modal */}
      {activeModalAppointment && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E5E5E5] max-w-md w-full p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-2">
                <StatusPill status={activeModalAppointment.status} />
                <span className="text-xs font-mono text-[#5C5C5C]">{activeModalAppointment.id}</span>
              </div>
              <button
                onClick={() => setActiveModalAppointment(null)}
                className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1 rounded hover:bg-[#F7F7F7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#1A1A1A]">
                {activeModalAppointment.type}
              </h3>
              <p className="text-xs text-[#5C5C5C] mt-0.5">
                {activeModalAppointment.notes}
              </p>
            </div>

            <div className="bg-[#F7F7F7] p-3 rounded-lg border border-[#E5E5E5] space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#0F7A4C]" />
                <span className="font-medium text-[#1A1A1A]">Patient:</span>
                <span className="text-[#5C5C5C]">{activeModalAppointment.patientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#0F7A4C]" />
                <span className="font-medium text-[#1A1A1A]">Provider:</span>
                <span className="text-[#5C5C5C]">{activeModalAppointment.doctorName} ({activeModalAppointment.specialization})</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0F7A4C]" />
                <span className="font-medium text-[#1A1A1A]">Scheduled:</span>
                <span className="text-[#5C5C5C]">{activeModalAppointment.date} at {activeModalAppointment.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F7A4C]" />
                <span className="font-medium text-[#1A1A1A]">Location:</span>
                <span className="text-[#5C5C5C] truncate">{activeModalAppointment.hospital}</span>
              </div>
            </div>

            {/* Quick Status Change Action */}
            <div className="border-t border-[#E5E5E5] pt-3">
              <label className="text-xs font-semibold text-[#1A1A1A] block mb-1.5">
                Update Appointment Status:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['Requested', 'Confirmed', 'Checked-In', 'Completed'].map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateStatus(activeModalAppointment.id, st);
                      setActiveModalAppointment(prev => ({ ...prev, status: st }));
                    }}
                    className={`text-xs py-1.5 px-1 rounded border text-center transition-colors ${
                      activeModalAppointment.status === st
                        ? 'bg-[#0F7A4C] text-white border-[#0F7A4C] font-medium'
                        : 'bg-white text-[#1A1A1A] border-[#E5E5E5] hover:bg-[#F7F7F7]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModalAppointment(null)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[#F7F7F7] hover:bg-[#E5E5E5] text-[#1A1A1A] border border-[#E5E5E5]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
