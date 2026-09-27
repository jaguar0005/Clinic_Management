import React from 'react';
import {
  Droplet,
  Truck,
  CheckCircle,
  XCircle,
  Radio,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusPill } from '../../components/StatusPill';
import { Stepper } from '../../components/Stepper';

const BLOOD_STEPS = ['Submitted', 'Doctor Verified', 'Searching', 'Availability Found'];
const AMBULANCE_STEPS = ['Requested', 'Assigned', 'Dispatched', 'Arriving', 'Completed'];

export const StaffEmergency = () => {
  const {
    currentUser,
    bloodRequests,
    ambulanceRequests,
    verifyBloodRequest,
    requestBloodCorrection
  } = useApp();

  const activeDoctorId = currentUser?.doctorId || 'DOC-01';
  const activeDoctorName = currentUser?.name || 'Dr. Sarah Jenkins, MD';

  // Rule: Doctor should ONLY see and verify blood requests sent to them!
  const myBloodRequests = bloodRequests.filter(r => r.doctorId === activeDoctorId);
  const pendingBloodCount = myBloodRequests.filter(r => r.status === 'Submitted').length;
  const activeAmbulanceCount = ambulanceRequests.filter(r => r.status !== 'Completed').length;

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
              Emergency Coordination &amp; Triage Center
            </h1>
          </div>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Authorizing physician station for <strong className="text-[#0F7A4C]">{activeDoctorName}</strong> (ID: {activeDoctorId}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#FDE8E8] text-[#C4302B] rounded border border-[#F8B4B4] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Priority Live Channel</span>
          </span>
        </div>
      </div>

      {/* Section 1: Pending Blood Requests & Verification Station */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center">
              <Droplet className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1A1A1A]">
                Assigned Blood Requisitions Queue ({myBloodRequests.length})
              </h2>
              <p className="text-xs text-[#5C5C5C]">
                {pendingBloodCount} requisitions awaiting your clinical sign-off. Approved requests auto-commence depot search.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {myBloodRequests.length > 0 ? (
            myBloodRequests.map(req => {
              const isPending = req.status === 'Submitted';
              const isVerified = req.status === 'Doctor Verified';

              return (
                <div
                  key={req.id}
                  className={`health-card p-5 bg-white border border-[#E5E5E5] space-y-4 ${
                    isPending ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-[#0F7A4C]'
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
                        <span>Hospital: <strong className="text-[#1A1A1A]">{req.hospital}</strong></span>
                        <span>•</span>
                        <span>Target: <strong className="text-[#1A1A1A]">{req.requiredBy}</strong></span>
                        <span>•</span>
                        <span>Contact: {req.contact}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <StatusPill status={req.status} />
                    </div>
                  </div>

                  {/* Progress Stepper */}
                  <div className="pt-2 pb-1 border-t border-[#E5E5E5]">
                    <Stepper
                      steps={BLOOD_STEPS}
                      currentStep={req.status}
                      isEmergency={false}
                    />
                  </div>

                  {req.notes && (
                    <div className="text-xs text-[#5C5C5C] bg-[#F7F7F7] p-2.5 rounded border border-[#E5E5E5]">
                      <strong className="text-[#1A1A1A]">Clinical Note: </strong>
                      {req.notes}
                    </div>
                  )}

                  {/* Staff Action Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5E5E5]">
                    <span className="text-xs text-[#5C5C5C]">
                      Logged: {req.createdAt} • Urgency: <strong className="text-[#C4302B]">{req.urgency}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const note = prompt('Enter correction instructions for this requisition:');
                          if (note) requestBloodCorrection(req.id, note);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-[#C4302B] hover:bg-[#FDE8E8] border border-[#F8B4B4] rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Request Correction</span>
                      </button>

                      <button
                        onClick={() => verifyBloodRequest(req.id)}
                        disabled={req.status === 'Availability Found'}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                          req.status === 'Availability Found'
                            ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                            : 'bg-[#0F7A4C] hover:bg-[#0c633d] text-white'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>
                          {isPending
                            ? 'Verify Requirement (Approve)'
                            : isVerified
                            ? 'Auto-Searching Depot...'
                            : req.status === 'Searching'
                            ? 'Searching Repositories...'
                            : 'Units Allocated'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="health-card p-8 text-center bg-white border border-[#E5E5E5] text-xs text-[#5C5C5C]">
              <Droplet className="w-8 h-8 text-[#0F7A4C] mx-auto mb-2 opacity-50" />
              <h3 className="text-sm font-semibold text-[#1A1A1A]">No blood requisitions assigned to your ID</h3>
              <p className="mt-1">
                You are logged in as {activeDoctorName} ({activeDoctorId}). Requisitions assigned to other clinicians are restricted to their staff views.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Active Ambulance Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FDE8E8] text-[#C4302B] flex items-center justify-center">
              <Truck className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1A1A1A]">
                Active Ambulance Transit &amp; Dispatch Monitoring
              </h2>
              <p className="text-xs text-[#5C5C5C]">
                {activeAmbulanceCount} vehicles currently operating emergency routes.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {ambulanceRequests.map(req => {
            const isCompleted = req.status === 'Completed';

            return (
              <div
                key={req.id}
                className={`health-card p-5 bg-white border border-[#E5E5E5] space-y-4 ${
                  !isCompleted ? 'border-l-4 border-l-[#C4302B]' : 'border-l-4 border-l-[#0F7A4C]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1A1A1A]">{req.id}</span>
                    <StatusPill status={req.status} />
                    <span className="text-xs text-[#5C5C5C]">• Unit: <strong className="text-[#1A1A1A]">{req.unitId}</strong></span>
                  </div>

                  <div className="text-xs font-bold text-[#C4302B] bg-[#FDE8E8] px-3 py-1 rounded border border-[#F8B4B4] self-start sm:self-auto">
                    {isCompleted ? 'ARRIVED & ADMITTED' : `ESTIMATED ETA: ~${req.etaMinutes} MINS`}
                  </div>
                </div>

                <div className="py-1">
                  <Stepper
                    steps={AMBULANCE_STEPS}
                    currentStep={req.status}
                    isEmergency={true}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F7F7F7] p-3 rounded border border-[#E5E5E5]">
                  <div>
                    <span className="text-[#5C5C5C] block">Pickup Location:</span>
                    <span className="font-semibold text-[#1A1A1A]">{req.pickupLocation}</span>
                  </div>
                  <div>
                    <span className="text-[#5C5C5C] block">Receiving Emergency Facility:</span>
                    <span className="font-semibold text-[#1A1A1A]">{req.destination}</span>
                  </div>
                  <div>
                    <span className="text-[#5C5C5C] block">Patient Name &amp; Contact:</span>
                    <span className="font-semibold text-[#1A1A1A]">{req.patientName} ({req.contact})</span>
                  </div>
                  <div>
                    <span className="text-[#5C5C5C] block">Triage Notes:</span>
                    <span className="text-[#1A1A1A]">{req.notes || 'Emergency transport requested'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
