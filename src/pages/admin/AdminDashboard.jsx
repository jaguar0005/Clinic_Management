import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  Droplet,
  Truck,
  Stethoscope,
  ShieldCheck,
  Building2,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { WeeklyCalendar } from '../../components/WeeklyCalendar';

export const AdminDashboard = () => {
  const { appointments, bloodRequests, ambulanceRequests, doctors, patients, updateAppointmentStatus } = useApp();
  const navigate = useNavigate();

  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  const pendingBloodCount = bloodRequests.filter(r => r.status === 'Submitted').length;
  const activeAmbulances = ambulanceRequests.filter(r => r.status !== 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              System Administration &amp; Hospital Operations
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#E6F4EC] text-[#0F7A4C] rounded border border-[#C8E6D5] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full Oversight Mode</span>
            </span>
          </div>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Centralized platform monitoring for all physicians, outpatient consultations, patient records, and emergency logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/users')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F7F7F7] rounded-lg transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-[#0F7A4C]" />
            <span>Database Accounts</span>
          </button>
        </div>
      </div>

      {/* Network KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Registered Patients"
          value={totalPatients}
          subtitle="Active medical records"
          icon={Users}
          onClick={() => navigate('/admin/patients')}
        />
        <StatCard
          title="Active Physicians"
          value={totalDoctors}
          subtitle="Across 5 departments"
          icon={Stethoscope}
          onClick={() => navigate('/admin/appointments')}
        />
        <StatCard
          title="All Consultations"
          value={totalAppointments}
          subtitle="Hospital-wide caseload"
          icon={CalendarDays}
          onClick={() => navigate('/admin/appointments')}
        />
        <StatCard
          title="Blood Requisitions"
          value={bloodRequests.length}
          subtitle={`${pendingBloodCount} pending MD sign-off`}
          icon={Droplet}
          alert={pendingBloodCount > 0}
          onClick={() => navigate('/admin/emergency')}
        />
        <StatCard
          title="Emergency EMS"
          value={activeAmbulances}
          subtitle="Active transit dispatches"
          icon={Truck}
          alert={activeAmbulances > 0}
          onClick={() => navigate('/admin/emergency')}
        />
      </div>

      {/* Master Hospital Schedule Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Master Hospital Schedule Grid (All Physicians)
            </h2>
            <span className="text-[11px] font-bold text-[#0F7A4C] bg-[#E6F4EC] px-2 py-0.5 rounded border border-[#C8E6D5]">
              Administrative Master View
            </span>
          </div>
          <span className="text-xs text-[#5C5C5C]">
            Use physician dropdown to filter individual schedules
          </span>
        </div>

        <WeeklyCalendar
          appointments={appointments}
          doctors={doctors}
          onUpdateStatus={updateAppointmentStatus}
        />
      </div>
    </div>
  );
};
