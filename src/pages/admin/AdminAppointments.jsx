import React, { useState } from 'react';
import { Search, Stethoscope, Calendar, Clock, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusPill } from '../../components/StatusPill';

export const AdminAppointments = () => {
  const { appointments, doctors, updateAppointmentStatus, cancelAppointment } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDoc = selectedDoctorFilter === 'all' || apt.doctorId === selectedDoctorFilter;
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

    return matchesSearch && matchesDoc && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
            Master Clinical Consultations Directory
          </h1>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Complete registry of all outpatient and surgical bookings across every physician and department.
          </p>
        </div>

        <div className="text-xs text-[#5C5C5C] bg-[#F7F7F7] px-3 py-1.5 rounded-lg border border-[#E5E5E5]">
          Total Bookings: {appointments.length} Consultations
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#5C5C5C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient, doctor, or reference ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
          />
        </div>

        <select
          value={selectedDoctorFilter}
          onChange={(e) => setSelectedDoctorFilter(e.target.value)}
          className="text-xs bg-white border border-[#E5E5E5] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C] w-full sm:w-auto"
        >
          <option value="all">All Attending Physicians ({doctors.length})</option>
          {doctors.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
          ))}
        </select>

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
      </div>

      {/* Master Appointments Table */}
      <div className="health-card bg-white border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#5C5C5C] font-semibold">
              <tr>
                <th className="p-3">Ref ID</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Attending Physician</th>
                <th className="p-3">Date &amp; Time</th>
                <th className="p-3">Type &amp; Clinical Facility</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredAppointments.map(apt => (
                <tr key={apt.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="p-3 font-mono font-medium text-[#5C5C5C]">
                    {apt.id}
                  </td>
                  <td className="p-3 font-semibold text-[#1A1A1A]">
                    <div>{apt.patientName}</div>
                    <div className="text-[11px] font-mono text-[#5C5C5C] font-normal">{apt.patientId}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-[#1A1A1A]">{apt.doctorName}</div>
                    <div className="text-[11px] text-[#0F7A4C]">{apt.specialization} • ID: {apt.doctorId}</div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-semibold text-[#1A1A1A]">{apt.date}</div>
                    <div className="text-[11px] text-[#5C5C5C]">{apt.time}</div>
                  </td>
                  <td className="p-3 max-w-xs text-[#5C5C5C]">
                    <div className="text-[#1A1A1A] font-medium">{apt.type}</div>
                    <div className="text-[11px] truncate">{apt.hospital}</div>
                    {apt.cancellationReason && (
                      <div className="text-[11px] text-[#C4302B] bg-[#FDE8E8] p-1 rounded mt-1">
                        <strong>Reason: </strong>{apt.cancellationReason}
                      </div>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <StatusPill status={apt.status} />
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    {apt.status !== 'Completed' && apt.status !== 'Cancelled' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'Requested' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                            className="px-2.5 py-1 text-xs font-semibold bg-[#0F7A4C] text-white rounded hover:bg-[#0c633d]"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status === 'Confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Checked-In')}
                            className="px-2.5 py-1 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Check-In
                          </button>
                        )}
                        {apt.status === 'Checked-In' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                            className="px-2.5 py-1 text-xs font-semibold bg-[#0F7A4C] text-white rounded hover:bg-[#0c633d]"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const reason = prompt('Admin cancellation reason note:');
                            if (reason) cancelAppointment(apt.id, reason, 'System Administrator');
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-[#C4302B] hover:bg-[#FDE8E8] border border-[#F8B4B4] rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#5C5C5C] italic">Final State</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
