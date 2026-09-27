import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Droplet,
  Truck,
  Building2,
  Bell,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusPill } from '../../components/StatusPill';

export const PatientDashboard = () => {
  const { currentPatient, appointments, notifications, bloodRequests, ambulanceRequests } = useApp();
  const navigate = useNavigate();

  // Find next upcoming appointment (non-cancelled, future date or first confirmed)
  const nextAppointment = appointments.find(
    apt => apt.patientId === currentPatient.id && apt.status !== 'Cancelled' && apt.status !== 'Completed'
  ) || appointments[0];

  const activeAmbulance = ambulanceRequests.find(r => r.status !== 'Completed');
  const activeBloodRequest = bloodRequests.find(r => r.patientName === currentPatient.name && r.status !== 'Availability Found');

  return (
    <div className="space-y-6">
      {/* Patient Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Good morning, {currentPatient.name}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#E6F4EC] text-[#0F7A4C] border border-[#C8E6D5]">
              Active Patient
            </span>
          </div>
          <p className="text-xs text-[#5C5C5C] mt-1">
            MRN: {currentPatient.id} • Blood Group: <span className="font-semibold text-[#1A1A1A]">{currentPatient.bloodGroup}</span> • Primary: Central Health Network
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/patient/appointments')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded-lg transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* Active Live Emergency Banner if ambulance is in progress */}
      {activeAmbulance && (
        <div className="bg-[#FDE8E8] border border-[#F8B4B4] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C4302B] text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C4302B]">
                  Active Emergency Transit
                </span>
                <StatusPill status={activeAmbulance.status} size="sm" />
              </div>
              <p className="text-xs text-[#1A1A1A] font-medium mt-0.5">
                {activeAmbulance.unitId} • Destination: {activeAmbulance.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:self-center">
            <div className="text-right">
              <span className="text-[10px] text-[#5C5C5C] uppercase block">Estimated Arrival</span>
              <span className="text-xs font-bold text-[#C4302B]">
                {activeAmbulance.status === 'Completed' ? 'Arrived' : `~${activeAmbulance.etaMinutes} mins`}
              </span>
            </div>
            <button
              onClick={() => navigate('/patient/ambulance')}
              className="px-3 py-1.5 bg-white text-[#C4302B] font-semibold text-xs rounded border border-[#F8B4B4] hover:bg-[#FDE8E8] transition-colors"
            >
              Live Tracker
            </button>
          </div>
        </div>
      )}

      {/* Active Blood Requisition Banner */}
      {activeBloodRequest && (
        <div className="bg-[#E6F4EC] border border-[#C8E6D5] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0F7A4C] text-white flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F7A4C]">
                  Blood Requisition Active
                </span>
                <StatusPill status={activeBloodRequest.status} size="sm" />
              </div>
              <p className="text-xs text-[#1A1A1A] font-medium mt-0.5">
                {activeBloodRequest.bloodGroup} ({activeBloodRequest.units} Units) • Hospital: {activeBloodRequest.hospital}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/patient/blood-request')}
            className="px-3 py-1.5 bg-white text-[#0F7A4C] font-semibold text-xs rounded border border-[#C8E6D5] hover:bg-[#E6F4EC] transition-colors self-start sm:self-center"
          >
            Track Status
          </button>
        </div>
      )}

      {/* Main Grid: Next Appointment + Emergency Quick-Access Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Appointment Card (Left/Main - 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Next Scheduled Appointment
            </h2>
            <button
              onClick={() => navigate('/patient/appointments')}
              className="text-xs text-[#0F7A4C] hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>View All ({appointments.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {nextAppointment ? (
            <div className="health-card p-5 border-l-4 border-l-[#0F7A4C] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#5C5C5C]">
                      {nextAppointment.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A]">
                    {nextAppointment.doctorName}
                  </h3>
                  <p className="text-xs font-medium text-[#0F7A4C] flex items-center gap-1.5 mt-0.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Specialty: {nextAppointment.specialization}</span>
                  </p>
                </div>
                <StatusPill status={nextAppointment.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E5E5E5] text-xs">
                <div className="flex items-start gap-2 bg-[#F7F7F7] p-2.5 rounded border border-[#E5E5E5]">
                  <Clock className="w-4 h-4 text-[#0F7A4C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1A1A1A] block">Date &amp; Time:</span>
                    <span className="text-[#5C5C5C]">{nextAppointment.date} at {nextAppointment.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#F7F7F7] p-2.5 rounded border border-[#E5E5E5]">
                  <MapPin className="w-4 h-4 text-[#0F7A4C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1A1A1A] block">Facility &amp; Ward:</span>
                    <span className="text-[#5C5C5C] line-clamp-1">{nextAppointment.hospital}</span>
                  </div>
                </div>
              </div>

              {nextAppointment.notes && (
                <div className="text-xs text-[#5C5C5C] bg-[#FAFAFA] p-2.5 rounded border border-[#E5E5E5]">
                  <span className="font-semibold text-[#1A1A1A]">Pre-consultation clinical note: </span>
                  {nextAppointment.notes}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#5C5C5C]">
                  Reference ID: <span className="font-mono text-[#1A1A1A]">{nextAppointment.id}</span>
                </span>
                <button
                  onClick={() => navigate('/patient/appointments')}
                  className="px-3 py-1.5 text-xs font-medium text-[#0F7A4C] hover:bg-[#E6F4EC] rounded transition-colors"
                >
                  Manage Booking
                </button>
              </div>
            </div>
          ) : (
            <div className="health-card p-6 text-center text-xs text-[#5C5C5C]">
              No upcoming appointments found.
            </div>
          )}

          {/* Seeded Patient Health Summary Strip */}
          <div className="health-card p-4 bg-white grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[#5C5C5C] block">Known Allergies</span>
              <span className="font-semibold text-[#1A1A1A] mt-0.5 block">{currentPatient.allergies}</span>
            </div>
            <div>
              <span className="text-[#5C5C5C] block">Chronic Condition</span>
              <span className="font-semibold text-[#1A1A1A] mt-0.5 block">{currentPatient.chronicConditions}</span>
            </div>
            <div>
              <span className="text-[#5C5C5C] block">Emergency Contact</span>
              <span className="font-semibold text-[#1A1A1A] mt-0.5 block truncate">{currentPatient.emergencyContact.split(' - ')[0]}</span>
            </div>
            <div>
              <span className="text-[#5C5C5C] block">Contact Phone</span>
              <span className="font-semibold text-[#1A1A1A] mt-0.5 block">{currentPatient.phone}</span>
            </div>
          </div>
        </div>

        {/* Emergency Quick-Access Panel (Right - 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#C4302B]" />
              <span>Emergency Services</span>
            </h2>
            <span className="text-[11px] font-bold text-[#C4302B] uppercase tracking-wider px-2 py-0.5 bg-[#FDE8E8] rounded border border-[#F8B4B4]">
              Priority Queue
            </span>
          </div>

          <div className="health-card p-5 border border-[#E5E5E5] space-y-3 bg-white">
            <p className="text-xs text-[#5C5C5C]">
              Instant coordination protocols for urgent blood requests, critical ambulance transit, and emergency facility lookup.
            </p>

            <div className="space-y-2.5 pt-1">
              {/* Button 1: Request Blood */}
              <button
                onClick={() => navigate('/patient/blood-request')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E5E5E5] hover:border-[#C4302B] hover:bg-[#FDE8E8]/30 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FDE8E8] border border-[#F8B4B4] text-[#C4302B] flex items-center justify-center shrink-0">
                    <Droplet className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1A1A1A] block group-hover:text-[#C4302B] transition-colors">
                      Request Blood Units
                    </span>
                    <span className="text-[11px] text-[#5C5C5C] block">
                      Crossmatch registry &amp; depot availability
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5C5C5C] group-hover:text-[#C4302B] transition-colors" />
              </button>

              {/* Button 2: Request Ambulance */}
              <button
                onClick={() => navigate('/patient/ambulance')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E5E5E5] hover:border-[#C4302B] hover:bg-[#FDE8E8]/30 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FDE8E8] border border-[#F8B4B4] text-[#C4302B] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1A1A1A] block group-hover:text-[#C4302B] transition-colors">
                      Request Ambulance Dispatch
                    </span>
                    <span className="text-[11px] text-[#5C5C5C] block">
                      Rapid response triage with live tracking
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5C5C5C] group-hover:text-[#C4302B] transition-colors" />
              </button>

              {/* Button 3: Find Facility */}
              <button
                onClick={() => navigate('/patient/map')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E5E5E5] hover:border-[#0F7A4C] hover:bg-[#E6F4EC]/40 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E6F4EC] border border-[#C8E6D5] text-[#0F7A4C] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1A1A1A] block group-hover:text-[#0F7A4C] transition-colors">
                      Find Facility &amp; ER
                    </span>
                    <span className="text-[11px] text-[#5C5C5C] block">
                      Interactive Leaflet map &amp; route guidance
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5C5C5C] group-hover:text-[#0F7A4C] transition-colors" />
              </button>
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-[#5C5C5C] leading-tight bg-[#F7F7F7] p-2.5 rounded border border-[#E5E5E5]">
                <strong className="text-[#C4302B]">Emergency Disclaimer:</strong> If you are experiencing acute unresponsiveness, severe hemorrhaging, or stroke symptoms, please dial 911 directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#5C5C5C]" />
            <span>Recent Clinical Alerts &amp; Activity</span>
          </h2>
          <span className="text-xs text-[#5C5C5C]">
            {notifications.length} logged events
          </span>
        </div>

        <div className="health-card divide-y divide-[#E5E5E5] bg-white">
          {notifications.slice(0, 4).map(item => (
            <div key={item.id} className="p-4 flex items-start gap-3 hover:bg-[#FAFAFA] transition-colors">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 border ${
                  item.type === 'emergency'
                    ? 'bg-[#FDE8E8] border-[#F8B4B4] text-[#C4302B]'
                    : item.type === 'appointment'
                    ? 'bg-[#E6F4EC] border-[#C8E6D5] text-[#0F7A4C]'
                    : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#5C5C5C]'
                }`}
              >
                {item.type === 'emergency' ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : item.type === 'appointment' ? (
                  <Calendar className="w-3.5 h-3.5" />
                ) : (
                  <Bell className="w-3.5 h-3.5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#1A1A1A]">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-[#5C5C5C] whitespace-nowrap">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#5C5C5C] mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
