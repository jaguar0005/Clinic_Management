import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Droplet,
  Truck,
  UserCheck,
  AlertTriangle,
  Users,
  Eye,
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { WeeklyCalendar } from '../../components/WeeklyCalendar';
import { StatusPill } from '../../components/StatusPill';
import { PatientProfileModal } from '../../components/PatientProfileModal';

export const StaffDashboard = () => {
  const {
    currentUser,
    appointments,
    bloodRequests,
    ambulanceRequests,
    doctors,
    patients,
    documents,
    updateAppointmentStatus
  } = useApp();
  const navigate = useNavigate();

  const [selectedPatient, setSelectedPatient] = useState(null);

  const activeDoctorId = currentUser?.doctorId || 'DOC-01';
  const activeDoctorName = currentUser?.name || 'Dr. Sarah Jenkins, MD';

  // Filter to show ONLY this doctor's appointments and blood requests
  const myAppointments = appointments.filter(a => a.doctorId === activeDoctorId);
  const myBloodRequests = bloodRequests.filter(r => r.doctorId === activeDoctorId);

  // Summary counts for this physician
  const todaysAppointments = myAppointments.filter(
    a => a.date === '2026-09-28' && a.status !== 'Cancelled'
  );
  const todaysAppointmentsCount = todaysAppointments.length;

  const pendingBloodCount = myBloodRequests.filter(
    r => r.status === 'Submitted'
  ).length;

  const activeAmbulanceCount = ambulanceRequests.filter(
    r => r.status !== 'Completed'
  ).length;

  const checkedInCount = myAppointments.filter(
    a => a.status === 'Checked-In'
  ).length;

  // Get patient details for today's intake
  const getPatientDetails = (apt) => {
    return patients.find(p => p.id === apt.patientId || p.name.toLowerCase() === apt.patientName?.toLowerCase()) || {
      id: apt.patientId || 'PT-UNKNOWN',
      name: apt.patientName,
      age: 42,
      gender: 'Patient',
      bloodGroup: 'O+',
      phone: '+1 (555) 234-8901',
      email: 'patient@metrohealth.org',
      address: '742 Evergreen Terrace, Metro City',
      emergencyContact: 'Family Contact - +1 (555) 234-8902',
      allergies: 'None reported',
      chronicConditions: 'General outpatient observation'
    };
  };

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

      {/* Today's Scheduled Patients & Quick Intake Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0F7A4C]" />
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Today's Patient Consultations &amp; Intake ({todaysAppointments.length})
            </h2>
          </div>
          <button
            onClick={() => navigate('/staff/patients')}
            className="text-xs text-[#0F7A4C] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Full Patient Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="health-card bg-white border border-[#E5E5E5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#5C5C5C] font-semibold">
                <tr>
                  <th className="p-3">Patient Name / MRN</th>
                  <th className="p-3">Scheduled Time</th>
                  <th className="p-3">Consultation Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Medical Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {todaysAppointments.length > 0 ? (
                  todaysAppointments.map(apt => {
                    const patient = getPatientDetails(apt);
                    return (
                      <tr key={apt.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="p-3 font-semibold text-[#1A1A1A]">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center font-bold text-xs">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div>{patient.name}</div>
                              <div className="text-[11px] font-mono text-[#5C5C5C] font-normal">{patient.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-[#0F7A4C]">
                          {apt.time}
                        </td>
                        <td className="p-3 text-[#5C5C5C]">
                          <div className="text-[#1A1A1A] font-medium">{apt.type}</div>
                          <div className="text-[11px] truncate max-w-xs">{apt.notes}</div>
                        </td>
                        <td className="p-3">
                          <StatusPill status={apt.status} size="sm" />
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedPatient(patient)}
                            className="px-3 py-1.5 text-xs font-semibold bg-[#E6F4EC] hover:bg-[#0F7A4C] text-[#0F7A4C] hover:text-white rounded-lg border border-[#C8E6D5] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Profile</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-xs text-[#5C5C5C]">
                      No patient appointments scheduled for today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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

      {/* Patient Profile Detail Modal with Interactive Documents & Appointments */}
      <PatientProfileModal
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        appointments={appointments}
        documents={documents}
      />
    </div>
  );
};
