import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle, UserCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusPill } from '../../components/StatusPill';

export const StaffAppointments = () => {
  const { currentUser, appointments, updateAppointmentStatus, cancelAppointment } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Cancellation modal state
  const [cancellingAppointment, setCancellingAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState(null);

  const activeDoctorId = currentUser?.doctorId || 'DOC-01';
  const activeDoctorName = currentUser?.name || 'Dr. Sarah Jenkins, MD';

  // Rule: Doctor should ONLY see their own appointments
  const doctorAppointments = appointments.filter(apt => apt.doctorId === activeDoctorId);

  const filteredAppointments = doctorAppointments.filter(apt => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDate = dateFilter === 'all' || apt.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleOpenCancelModal = (apt) => {
    setCancellingAppointment(apt);
    setCancelReason('');
    setCancelError(null);
  };

  const handleConfirmCancel = (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      setCancelError('Please provide a clinical or scheduling reason for this cancellation.');
      return;
    }

    cancelAppointment(cancellingAppointment.id, cancelReason.trim(), activeDoctorName);
    setCancellingAppointment(null);
    setCancelReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
            My Clinical Consultations &amp; Intake
          </h1>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Assigned caseload for <strong className="text-[#0F7A4C]">{activeDoctorName}</strong> (ID: {activeDoctorId}). Status changes are one-way and irreversible.
          </p>
        </div>

        <div className="text-xs text-[#5C5C5C] bg-[#F7F7F7] px-3 py-1.5 rounded-lg border border-[#E5E5E5]">
          My Caseload: {doctorAppointments.length} Consultations
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#5C5C5C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, condition, or appointment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-white border border-[#E5E5E5] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C] w-full sm:w-auto"
        >
          <option value="all">All Statuses</option>
          {['Requested', 'Confirmed', 'Checked-In', 'Completed', 'Cancelled'].map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="text-xs bg-white border border-[#E5E5E5] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C] w-full sm:w-auto"
        >
          <option value="all">All Dates</option>
          <option value="2026-09-28">Today (Sep 28)</option>
          <option value="2026-09-29">Tomorrow (Sep 29)</option>
          <option value="2026-09-30">Wednesday (Sep 30)</option>
        </select>
      </div>

      {/* Appointments Management Table */}
      <div className="health-card bg-white border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#5C5C5C] font-semibold">
              <tr>
                <th className="p-3">Ref ID</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Date &amp; Time</th>
                <th className="p-3">Consultation Type &amp; Clinical Notes</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Physician Action (One-Way)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="p-3 font-mono text-[#5C5C5C] font-medium">
                      {apt.id}
                    </td>
                    <td className="p-3 font-semibold text-[#1A1A1A]">
                      <div>{apt.patientName}</div>
                      <div className="text-[11px] font-mono text-[#5C5C5C] font-normal">{apt.patientId}</div>
                    </td>
                    <td className="p-3 text-[#1A1A1A] whitespace-nowrap">
                      <div className="font-semibold">{apt.date}</div>
                      <div className="text-[11px] text-[#0F7A4C] font-medium">{apt.time}</div>
                    </td>
                    <td className="p-3 text-[#5C5C5C] max-w-xs">
                      <div className="text-[#1A1A1A] font-semibold">{apt.type}</div>
                      <div className="text-[11px] text-[#5C5C5C] truncate">{apt.notes}</div>

                      {/* Display cancellation reason if cancelled */}
                      {apt.status === 'Cancelled' && apt.cancellationReason && (
                        <div className="mt-1 text-[11px] text-[#C4302B] bg-[#FDE8E8] p-1.5 rounded border border-[#F8B4B4]">
                          <strong>Reason:</strong> {apt.cancellationReason}
                        </div>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <StatusPill status={apt.status} />
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {/* One-way progression actions */}
                      {apt.status === 'Requested' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                            className="px-2.5 py-1 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                          <button
                            onClick={() => handleOpenCancelModal(apt)}
                            className="px-2.5 py-1 text-xs font-medium text-[#C4302B] hover:bg-[#FDE8E8] border border-[#F8B4B4] rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {apt.status === 'Confirmed' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Checked-In')}
                            className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Check-In</span>
                          </button>
                          <button
                            onClick={() => handleOpenCancelModal(apt)}
                            className="px-2.5 py-1 text-xs font-medium text-[#C4302B] hover:bg-[#FDE8E8] border border-[#F8B4B4] rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {apt.status === 'Checked-In' && (
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                            className="px-3 py-1 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded transition-colors"
                          >
                            Complete Consultation
                          </button>
                        </div>
                      )}

                      {apt.status === 'Completed' && (
                        <span className="text-xs text-[#5C5C5C] font-semibold bg-[#F7F7F7] px-2.5 py-1 rounded border border-[#E5E5E5]">
                          Completed (Final)
                        </span>
                      )}

                      {apt.status === 'Cancelled' && (
                        <span className="text-xs text-[#C4302B] font-semibold bg-[#FDE8E8] px-2.5 py-1 rounded border border-[#F8B4B4]">
                          Cancelled (Final)
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#5C5C5C]">
                    No consultations found for {activeDoctorName} matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancellation Modal with Required Note */}
      {cancellingAppointment && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E5E5E5] max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#FDE8E8] text-[#C4302B]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1A1A1A]">
                  Cancel Appointment
                </h3>
              </div>
              <button
                onClick={() => setCancellingAppointment(null)}
                className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#F7F7F7] p-3 rounded-lg border border-[#E5E5E5] text-xs space-y-1">
              <div><strong>Reference ID:</strong> <span className="font-mono">{cancellingAppointment.id}</span></div>
              <div><strong>Patient:</strong> {cancellingAppointment.patientName}</div>
              <div><strong>Scheduled:</strong> {cancellingAppointment.date} at {cancellingAppointment.time}</div>
            </div>

            <div className="bg-[#FDE8E8] border border-[#F8B4B4] text-[#C4302B] p-2.5 rounded text-xs leading-relaxed">
              <strong>Notice:</strong> Once cancelled, this appointment cannot be reversed, re-opened, or confirmed. This cancellation is final.
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                  Cancellation Reason &amp; Clinical Note:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Physician scheduled for emergency surgical revision; patient notified to book alternate slot."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C4302B]"
                />
              </div>

              {cancelError && (
                <p className="text-xs text-[#C4302B] font-semibold">{cancelError}</p>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setCancellingAppointment(null)}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-[#5C5C5C] hover:bg-[#F7F7F7]"
                >
                  Keep Appointment
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#C4302B] hover:bg-[#a82723] text-white rounded-lg transition-colors"
                >
                  Confirm Final Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
