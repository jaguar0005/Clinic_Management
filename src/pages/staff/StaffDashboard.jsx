import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Droplet,
  Truck,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { WeeklyCalendar } from '../../components/WeeklyCalendar';

export const StaffDashboard = () => {
  const { currentUser, appointments, bloodRequests, ambulanceRequests, doctors, updateAppointmentStatus } = useApp();
  const navigate = useNavigate();

  const activeDoctorId = currentUser?.doctorId || 'DOC-01';
  const activeDoctorName = currentUser?.name || 'Dr. Sarah Jenkins, MD';

  // Filter to show ONLY this doctor's appointments and blood requests
  const myAppointments = appointments.filter(a => a.doctorId === activeDoctorId);
  const myBloodRequests = bloodRequests.filter(r => r.doctorId === activeDoctorId);

  // Summary counts for this physician
  const todaysAppointmentsCount = myAppointments.filter(
    a => a.date === '2026-09-28' && a.status !== 'Cancelled'
  ).length;

  const pendingBloodCount = myBloodRequests.filter(
    r => r.status === 'Submitted'
  ).length;

  const activeAmbulanceCount = ambulanceRequests.filter(
    r => r.status !== 'Completed'
  ).length;

  const checkedInCount = myAppointments.filter(
    a => a.status === 'Checked-In'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Physician Consultation Dashboard
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#E6F4EC] text-[#0F7A4C] rounded border border-[#C8E6D5]">
              Active Provider: {activeDoctorName} ({activeDoctorId})
            </span>
          </div>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Personal clinic schedule, patient intake queue, and authorized emergency blood sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/staff/emergency')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors border ${
              pendingBloodCount > 0 || activeAmbulanceCount > 0
                ? 'bg-[#C4302B] text-white border-[#C4302B] hover:bg-[#a82723]'
                : 'bg-white text-[#1A1A1A] border-[#E5E5E5] hover:bg-[#F7F7F7]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Emergency Center ({pendingBloodCount + activeAmbulanceCount})</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards at Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={todaysAppointmentsCount}
          subtitle="Sep 28, 2026 • 2 confirmed, 1 requested"
          icon={CalendarDays}
          alert={false}
          onClick={() => navigate('/staff/appointments')}
        />
        <StatCard
          title="Pending Blood Verifications"
          value={pendingBloodCount}
          subtitle={pendingBloodCount > 0 ? "Requisitions awaiting MD sign-off" : "All requests verified"}
          icon={Droplet}
          alert={pendingBloodCount > 0}
          onClick={() => navigate('/staff/emergency')}
        />
        <StatCard
          title="Active Ambulance Requests"
          value={activeAmbulanceCount}
          subtitle={activeAmbulanceCount > 0 ? "Vehicles en-route in transit" : "No active dispatches"}
          icon={Truck}
          alert={activeAmbulanceCount > 0}
          onClick={() => navigate('/staff/emergency')}
        />
        <StatCard
          title="Currently Checked-In"
          value={checkedInCount}
          subtitle="Patients in clinic waiting room"
          icon={UserCheck}
          alert={false}
          onClick={() => navigate('/staff/appointments')}
        />
      </div>

      {/* High Priority Visual Component: Weekly Calendar / Schedule Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Weekly Outpatient &amp; Surgery Schedule
            </h2>
            <span className="text-[11px] font-bold text-[#0F7A4C] bg-[#E6F4EC] px-2 py-0.5 rounded border border-[#C8E6D5]">
              Real-time Shared Local State
            </span>
          </div>
          <span className="text-xs text-[#5C5C5C]">
            Click any booking block to inspect or change status
          </span>
        </div>

        <WeeklyCalendar
          appointments={myAppointments}
          doctors={doctors}
          onUpdateStatus={updateAppointmentStatus}
        />
      </div>
    </div>
  );
};
