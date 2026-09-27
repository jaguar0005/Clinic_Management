import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Plus,
  X,
  Check,
  Star,
  CalendarCheck,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusPill } from '../../components/StatusPill';

export const PatientAppointments = () => {
  const { currentUser, currentPatient, appointments, doctors, bookAppointment, cancelAppointment } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'past'
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(null);

  const activePatientId = currentUser?.patientId || currentPatient.id;

  // Booking Flow State
  const [bookingStep, setBookingStep] = useState(1); // 1: Doctor -> 2: Date & Slot -> 3: Details & Confirm
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [selectedDate, setSelectedDate] = useState('2026-09-29');
  const [selectedSlot, setSelectedSlot] = useState(doctors[0]?.availableSlots[0] || '09:30 AM');
  const [consultType, setConsultType] = useState('Routine Check-up & Consultation');
  const [consultNotes, setConsultNotes] = useState('');

  // Strict patient appointment isolation: patient only sees their own appointments!
  const patientAppointments = appointments.filter(apt => {
    const matchesId = apt.patientId && apt.patientId === activePatientId;
    const matchesEmail = currentUser?.email && apt.patientEmail && apt.patientEmail.toLowerCase() === currentUser.email.toLowerCase();
    const matchesName = currentUser?.name && apt.patientName && apt.patientName.toLowerCase() === currentUser.name.toLowerCase();
    return matchesId || matchesEmail || matchesName;
  });

  const filteredAppointments = patientAppointments.filter(apt => {
    if (filter === 'upcoming') {
      return apt.status === 'Confirmed' || apt.status === 'Requested' || apt.status === 'Checked-In';
    }
    if (filter === 'past') {
      return apt.status === 'Completed' || apt.status === 'Cancelled';
    }
    return true;
  });

  const handleOpenBooking = () => {
    setSelectedDoctor(doctors[0]);
    setSelectedSlot(doctors[0].availableSlots[0]);
    setBookingStep(1);
    setIsBookingModalOpen(true);
  };

  const [bookingErrorMsg, setBookingErrorMsg] = useState(null);

  // Helper to calculate minutes from date & time
  const getSlotMinutes = (dateStr, timeStr) => {
    try {
      const [timePart, modifier] = timeStr.trim().split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day, hours, minutes, 0, 0);
      return Math.floor(d.getTime() / (1000 * 60));
    } catch {
      return 0;
    }
  };

  const checkSlotConflict = (date, slot) => {
    const slotMins = getSlotMinutes(date, slot);
    const activePatientId = currentPatient.id;

    // Check patient conflict (< 60 mins)
    const patientConflict = appointments.find(apt => {
      if (apt.status === 'Cancelled') return false;
      if (apt.date !== date) return false;
      if (apt.patientId !== activePatientId) return false;
      const existingMins = getSlotMinutes(apt.date, apt.time);
      return Math.abs(slotMins - existingMins) < 60;
    });

    if (patientConflict) {
      return { hasConflict: true, reason: `Patient conflict: Existing booking at ${patientConflict.time}` };
    }

    // Check doctor conflict (< 60 mins)
    const doctorConflict = appointments.find(apt => {
      if (apt.status === 'Cancelled') return false;
      if (apt.date !== date) return false;
      if (apt.doctorId !== selectedDoctor?.id) return false;
      const existingMins = getSlotMinutes(apt.date, apt.time);
      return Math.abs(slotMins - existingMins) < 60;
    });

    if (doctorConflict) {
      return { hasConflict: true, reason: `Physician booked at ${doctorConflict.time}` };
    }

    return { hasConflict: false };
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setBookingErrorMsg(null);

    const res = bookAppointment({
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialization: selectedDoctor.specialization,
      hospital: selectedDoctor.hospital,
      date: selectedDate,
      time: selectedSlot,
      type: consultType,
      notes: consultNotes || 'Booked via patient portal'
    });

    if (!res.success) {
      setBookingErrorMsg(res.error);
      return;
    }

    setIsBookingModalOpen(false);
    setBookingSuccessMsg(`Appointment requested with ${selectedDoctor.name} for ${selectedDate} at ${selectedSlot}. Reference: ${res.appointment.id}`);
    setTimeout(() => setBookingSuccessMsg(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
            Patient Appointments
          </h1>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Review your upcoming clinical consultations, schedule new appointments, or cancel existing bookings.
          </p>
        </div>

        <button
          onClick={handleOpenBooking}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {bookingSuccessMsg && (
        <div className="bg-[#E6F4EC] border border-[#C8E6D5] text-[#0F7A4C] p-3.5 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#0F7A4C] stroke-[2.5]" />
            <span className="font-medium">{bookingSuccessMsg}</span>
          </div>
          <button onClick={() => setBookingSuccessMsg(null)} className="text-[#0F7A4C] hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-[#0F7A4C] text-white'
              : 'text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#F7F7F7]'
          }`}
        >
          All Appointments ({patientAppointments.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'upcoming'
              ? 'bg-[#0F7A4C] text-white'
              : 'text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#F7F7F7]'
          }`}
        >
          Upcoming (
          {patientAppointments.filter(a => a.status === 'Confirmed' || a.status === 'Requested' || a.status === 'Checked-In').length}
          )
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'past'
              ? 'bg-[#0F7A4C] text-white'
              : 'text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#F7F7F7]'
          }`}
        >
          Past / Completed (
          {patientAppointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled').length}
          )
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(apt => {
            const canCancel = apt.status === 'Requested' || apt.status === 'Confirmed';

            return (
              <div
                key={apt.id}
                className="health-card p-5 bg-white border border-[#E5E5E5] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusPill status={apt.status} />
                    <span className="text-xs font-mono text-[#5C5C5C]">{apt.id}</span>
                    <span className="text-xs text-[#5C5C5C]">•</span>
                    <span className="text-xs font-semibold text-[#1A1A1A]">{apt.type}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div>
                      <h3 className="text-base font-semibold text-[#1A1A1A]">
                        {apt.doctorName}
                      </h3>
                      <p className="text-xs text-[#0F7A4C] font-medium flex items-center gap-1 mt-0.5">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>{apt.specialization}</span>
                      </p>
                    </div>

                    <div className="text-xs text-[#5C5C5C] space-y-1 border-t sm:border-t-0 sm:border-l border-[#E5E5E5] pt-2 sm:pt-0 sm:pl-6">
                      <div className="flex items-center gap-1.5 text-[#1A1A1A] font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#0F7A4C]" />
                        <span>{apt.date} at {apt.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#5C5C5C]">
                        <MapPin className="w-3.5 h-3.5 text-[#5C5C5C]" />
                        <span className="truncate max-w-xs">{apt.hospital}</span>
                      </div>
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-[#5C5C5C] bg-[#F7F7F7] p-2 rounded border border-[#E5E5E5]">
                      Note: {apt.notes}
                    </p>
                  )}

                  {apt.status === 'Cancelled' && apt.cancellationReason && (
                    <div className="text-xs text-[#C4302B] bg-[#FDE8E8] p-2.5 rounded border border-[#F8B4B4]">
                      <strong>Cancellation Reason ({apt.cancelledBy || 'Clinical Staff'}): </strong>
                      <span>{apt.cancellationReason}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#E5E5E5]">
                  {canCancel ? (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to cancel appointment ${apt.id} with ${apt.doctorName}?`)) {
                          cancelAppointment(apt.id);
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-[#C4302B] hover:bg-[#FDE8E8] border border-[#F8B4B4] rounded-lg transition-colors"
                    >
                      Cancel Appointment
                    </button>
                  ) : (
                    <span className="text-xs text-[#5C5C5C] italic">
                      {apt.status === 'Cancelled' ? 'Booking cancelled' : 'Record archived'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="health-card p-12 text-center bg-white">
            <CalendarCheck className="w-10 h-10 text-[#5C5C5C] mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-semibold text-[#1A1A1A]">No appointments found</h3>
            <p className="text-xs text-[#5C5C5C] mt-1 mb-4">
              You do not have any appointments matching the selected filter.
            </p>
            <button
              onClick={handleOpenBooking}
              className="px-4 py-2 text-xs font-semibold bg-[#0F7A4C] text-white rounded-lg hover:bg-[#0c633d]"
            >
              Book New Appointment
            </button>
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-[#E5E5E5] max-w-2xl w-full p-6 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">
                  Schedule Clinical Appointment
                </h3>
                <p className="text-xs text-[#5C5C5C]">
                  Step {bookingStep} of 3 • {bookingStep === 1 ? 'Select Physician' : bookingStep === 2 ? 'Date & Time Slot' : 'Consultation Details & Confirmation'}
                </p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1 rounded hover:bg-[#F7F7F7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Select Doctor */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs font-medium text-[#1A1A1A]">
                  Select an available physician or specialist:
                </p>

                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {doctors.map(doc => {
                    const isSelected = selectedDoctor.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setSelectedSlot(doc.availableSlots[0]);
                        }}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                          isSelected
                            ? 'bg-[#E6F4EC] border-[#0F7A4C] ring-1 ring-[#0F7A4C]'
                            : 'bg-white border-[#E5E5E5] hover:bg-[#F7F7F7]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#1A1A1A]">{doc.name}</span>
                            <span className="text-[11px] px-2 py-0.5 bg-white border border-[#E5E5E5] rounded text-[#0F7A4C] font-medium">
                              {doc.specialization}
                            </span>
                          </div>
                          <p className="text-xs text-[#5C5C5C]">{doc.hospital}</p>
                          <div className="flex items-center gap-3 text-[11px] text-[#5C5C5C] pt-1">
                            <span className="flex items-center gap-1 text-amber-700">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span className="font-semibold">{doc.rating}</span>
                            </span>
                            <span>•</span>
                            <span>Exp: {doc.experience}</span>
                            <span>•</span>
                            <span className="text-[#0F7A4C] font-medium">Next: {doc.nextAvailable}</span>
                          </div>
                        </div>

                        <div className="w-5 h-5 rounded-full border flex items-center justify-center mt-1">
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#0F7A4C]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium rounded-lg text-[#5C5C5C] hover:bg-[#F7F7F7]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setBookingStep(2)}
                    className="px-5 py-2 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded-lg transition-colors"
                  >
                    Next: Date &amp; Slot
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Select Date & Time Slot Grid */}
            {bookingStep === 2 && (
              <div className="space-y-4">
                <div className="bg-[#F7F7F7] p-3 rounded-lg border border-[#E5E5E5] text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[#5C5C5C]">Selected Physician:</span>
                    <span className="font-semibold text-[#1A1A1A] block">{selectedDoctor.name} ({selectedDoctor.specialization})</span>
                  </div>
                  <button
                    onClick={() => setBookingStep(1)}
                    className="text-xs text-[#0F7A4C] hover:underline"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1.5">
                    Select Consultation Date:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Tomorrow', date: '2026-09-28' },
                      { label: 'Tuesday', date: '2026-09-29' },
                      { label: 'Wednesday', date: '2026-09-30' },
                      { label: 'Thursday', date: '2026-10-01' }
                    ].map(d => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDate(d.date)}
                        className={`p-2.5 rounded-lg border text-center transition-colors text-xs ${
                          selectedDate === d.date
                            ? 'bg-[#0F7A4C] text-white border-[#0F7A4C] font-semibold'
                            : 'bg-white text-[#1A1A1A] border-[#E5E5E5] hover:bg-[#F7F7F7]'
                        }`}
                      >
                        <span className="block text-[11px] opacity-80">{d.label}</span>
                        <span className="font-semibold block">{d.date.split('-').slice(1).join('/')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#1A1A1A]">
                      Select Available Time Slot:
                    </label>
                    <span className="text-[11px] text-[#5C5C5C]">
                      Rule: Min. 1 hr interval between bookings
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedDoctor.availableSlots.map(slot => {
                      const conflict = checkSlotConflict(selectedDate, slot);
                      const isSelected = selectedSlot === slot && !conflict.hasConflict;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={conflict.hasConflict}
                          onClick={() => setSelectedSlot(slot)}
                          title={conflict.hasConflict ? conflict.reason : 'Available slot'}
                          className={`p-2.5 rounded-lg border text-center text-xs transition-colors flex flex-col items-center justify-center gap-1 ${
                            conflict.hasConflict
                              ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#E6F4EC] text-[#0F7A4C] border-[#0F7A4C] font-bold ring-1 ring-[#0F7A4C]'
                              : 'bg-white text-[#1A1A1A] border-[#E5E5E5] hover:bg-[#F7F7F7]'
                          }`}
                        >
                          <div className={`flex items-center gap-1 ${conflict.hasConflict ? 'line-through' : ''}`}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{slot}</span>
                          </div>
                          {conflict.hasConflict && (
                            <span className="text-[10px] text-[#C4302B] font-semibold">
                              Conflict (&lt;1 hr)
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between gap-2 pt-3 border-t border-[#E5E5E5]">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="px-4 py-2 text-xs font-medium rounded-lg text-[#5C5C5C] hover:bg-[#F7F7F7]"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setBookingStep(3)}
                    className="px-5 py-2 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded-lg transition-colors"
                  >
                    Next: Consultation Reason
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Details & Final Submit */}
            {bookingStep === 3 && (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="bg-[#F7F7F7] p-3.5 rounded-lg border border-[#E5E5E5] text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#5C5C5C]">Patient:</span>
                    <span className="font-semibold text-[#1A1A1A]">{currentPatient.name} ({currentPatient.id})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5C5C5C]">Physician:</span>
                    <span className="font-semibold text-[#1A1A1A]">{selectedDoctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5C5C5C]">Specialization:</span>
                    <span className="font-semibold text-[#0F7A4C]">{selectedDoctor.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5C5C5C]">Facility:</span>
                    <span className="text-[#1A1A1A]">{selectedDoctor.hospital}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E5E5E5] pt-1.5 font-bold">
                    <span className="text-[#5C5C5C]">Slot:</span>
                    <span className="text-[#1A1A1A]">{selectedDate} at {selectedSlot}</span>
                  </div>
                </div>

                {bookingErrorMsg && (
                  <div className="bg-[#FDE8E8] border border-[#F8B4B4] text-[#C4302B] p-3 rounded-lg text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Schedule Policy Error:</span>
                      <span>{bookingErrorMsg}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                    Consultation Type / Primary Concern:
                  </label>
                  <input
                    type="text"
                    required
                    value={consultType}
                    onChange={(e) => setConsultType(e.target.value)}
                    placeholder="e.g. Cardiovascular Check-up, Migraine follow-up"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                    Clinical Notes / Symptoms to Pre-Report (Optional):
                  </label>
                  <textarea
                    rows={3}
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                    placeholder="Describe any symptoms, previous treatments, or questions for the doctor..."
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>

                <div className="flex justify-between gap-2 pt-3 border-t border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="px-4 py-2 text-xs font-medium rounded-lg text-[#5C5C5C] hover:bg-[#F7F7F7]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm &amp; Submit Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
