import React from 'react';
import { ShieldAlert, Droplet, Truck, CheckCircle, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusPill } from '../../components/StatusPill';
import { Stepper } from '../../components/Stepper';

const BLOOD_STEPS = ['Submitted', 'Doctor Verified', 'Searching', 'Availability Found'];
const AMBULANCE_STEPS = ['Requested', 'Assigned', 'Dispatched', 'Arriving', 'Completed'];

export const AdminEmergency = () => {
  const { bloodRequests, ambulanceRequests, verifyBloodRequest } = useApp();

  const pendingCount = bloodRequests.filter(r => r.status === 'Submitted').length;
  const activeAmbulances = ambulanceRequests.filter(r => r.status !== 'Completed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FDE8E8] text-[#C4302B] border border-[#F8B4B4] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 stroke-[2]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Hospital-Wide Emergency &amp; Transfusion Oversight
            </h1>
          </div>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Master command dashboard monitoring blood bank demands across all physician wards and live ambulance telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#FDE8E8] text-[#C4302B] rounded border border-[#F8B4B4] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Emergency Operations Center Active</span>
          </span>
        </div>
      </div>

      {/* Blood Requisitions Across All Doctors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1A1A1A]">
                All Hospital Blood Requisitions ({bloodRequests.length})
              </h2>
              <p className="text-xs text-[#5C5C5C]">
                {pendingCount} requisitions awaiting doctor verification across departments.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {bloodRequests.map(req => (
            <div
              key={req.id}
              className={`health-card p-5 bg-white border border-[#E5E5E5] space-y-4 ${
                req.status === 'Submitted' ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-[#0F7A4C]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#5C5C5C]">{req.id}</span>
                    <span className="text-xs text-[#5C5C5C]">•</span>
                    <span className="text-xs font-bold text-[#C4302B] px-2 py-0.5 bg-[#FDE8E8] rounded border border-[#F8B4B4]">
                      {req.bloodGroup} — {req.units} Units
                    </span>
                    <span className="text-xs text-[#5C5C5C]">•</span>
                    <span className="text-xs font-semibold text-[#1A1A1A]">Patient: {req.patientName}</span>
                  </div>
                  <div className="text-xs text-[#5C5C5C] mt-1 flex flex-wrap items-center gap-3">
                    <span>Facility: <strong className="text-[#1A1A1A]">{req.hospital}</strong></span>
                    <span>•</span>
                    <span>Assigned Doctor: <strong className="text-[#0F7A4C]">{req.doctorName}</strong> ({req.doctorId})</span>
                    <span>•</span>
                    <span>Target: <strong>{req.requiredBy}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusPill status={req.status} />
                  {req.status === 'Submitted' && (
                    <button
                      onClick={() => verifyBloodRequest(req.id)}
                      className="px-3 py-1 text-xs font-semibold bg-[#0F7A4C] text-white rounded hover:bg-[#0c633d]"
                    >
                      Admin Verify Override
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="pt-2 pb-1 border-t border-[#E5E5E5]">
                <Stepper steps={BLOOD_STEPS} currentStep={req.status} />
              </div>

              {req.notes && (
                <div className="text-xs text-[#5C5C5C] bg-[#F7F7F7] p-2.5 rounded border border-[#E5E5E5]">
                  <strong>Clinical Rationale: </strong>{req.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Ambulances Telemetry */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FDE8E8] text-[#C4302B] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1A1A1A]">
                EMS Telemetry &amp; Fleet Operations ({activeAmbulances} Active)
              </h2>
              <p className="text-xs text-[#5C5C5C]">
                Real-time rapid response vehicle positioning and hospital destination tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {ambulanceRequests.map(req => (
            <div
              key={req.id}
              className="health-card p-5 bg-white border border-[#E5E5E5] space-y-4 border-l-4 border-l-[#C4302B]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1A1A1A]">{req.id}</span>
                  <StatusPill status={req.status} />
                  <span className="text-xs text-[#5C5C5C]">• Unit: <strong className="text-[#1A1A1A]">{req.unitId}</strong></span>
                </div>
                <div className="text-xs font-bold text-[#C4302B] bg-[#FDE8E8] px-3 py-1 rounded border border-[#F8B4B4]">
                  {req.status === 'Completed' ? 'ARRIVED & ADMITTED' : `ESTIMATED ETA: ~${req.etaMinutes} MINS`}
                </div>
              </div>

              <Stepper steps={AMBULANCE_STEPS} currentStep={req.status} isEmergency={true} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F7F7F7] p-3 rounded border border-[#E5E5E5]">
                <div><strong>Pickup:</strong> {req.pickupLocation}</div>
                <div><strong>Receiving Emergency Ward:</strong> {req.destination}</div>
                <div><strong>Patient &amp; Contact:</strong> {req.patientName} ({req.contact})</div>
                <div><strong>Triage Notes:</strong> {req.notes || 'Emergency dispatch'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
