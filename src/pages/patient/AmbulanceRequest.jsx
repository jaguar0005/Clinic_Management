import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  AlertTriangle,
  Navigation,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Stepper } from '../../components/Stepper';
import { StatusPill } from '../../components/StatusPill';

const AMBULANCE_STEPS = ['Requested', 'Assigned', 'Dispatched', 'Arriving', 'Completed'];

export const AmbulanceRequest = () => {
  const { currentPatient, ambulanceRequests, createAmbulanceRequest } = useApp();

  const [formData, setFormData] = useState({
    patientName: currentPatient.name,
    pickupLocation: currentPatient.address,
    destination: 'Metro General Hospital Emergency Dept. (100 Hospital Plaza)',
    contact: currentPatient.phone,
    notes: 'Acute chest tightness, non-radiating, resting vitals elevated.'
  });

  const [secondsTicker, setSecondsTicker] = useState(45);

  // Live countdown second ticker for ETA display realism
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsTicker(prev => (prev > 0 ? prev - 1 : 59));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createAmbulanceRequest(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FDE8E8] text-[#C4302B] border border-[#F8B4B4] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                Emergency Ambulance Dispatch
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C4302B] px-2 py-0.5 bg-[#FDE8E8] rounded border border-[#F8B4B4]">
                <Radio className="w-3 h-3 animate-pulse" />
                Live Telemetry
              </span>
            </div>
            <p className="text-xs text-[#5C5C5C] mt-0.5">
              Direct emergency dispatch with automated step progression and live response monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form (5 Cols) + Live Tracked Cards (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ambulance Dispatch Form */}
        <div className="lg:col-span-5">
          <div className="health-card p-5 bg-white border border-[#E5E5E5] space-y-4">
            <div>
              <h2 className="text-base font-semibold text-[#1A1A1A]">
                Dispatch Request Form
              </h2>
              <p className="text-xs text-[#5C5C5C] mt-0.5">
                Submissions automatically trigger paramedic squad routing.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C4302B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                  Pickup Location / Incident Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  placeholder="Street, Building, Flat No."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C4302B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                  Receiving Hospital Destination
                </label>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C4302B]"
                >
                  <option value="Metro General Hospital Emergency Dept. (100 Hospital Plaza)">
                    Metro General Hospital ER (Trauma Level 1)
                  </option>
                  <option value="St. Jude Medical Center Comprehensive ER (1200 Cathedral Pkwy)">
                    St. Jude Medical Center ER (Stroke / Neuro)
                  </option>
                  <option value="Central Health Outpatient Urgent Suite (422 Center St)">
                    Central Health Outpatient Urgent Suite
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C4302B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                  Condition &amp; Triage Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Patient consciousness, breathing state, symptoms..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C4302B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#C4302B] hover:bg-[#a82723] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Submit Emergency Ambulance Request</span>
              </button>
            </form>

            <div className="bg-[#F7F7F7] p-2.5 rounded border border-[#E5E5E5] text-[11px] text-[#5C5C5C]">
              Demo tracking advances state automatically every ~4.5 seconds to preview real-time vehicle dispatch workflows.
            </div>
          </div>
        </div>

        {/* Tracked Active Ambulances */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Live Tracked Vehicles ({ambulanceRequests.length})
            </h2>
            <span className="text-xs text-[#5C5C5C]">
              Auto-Advancing Live Status
            </span>
          </div>

          <div className="space-y-4">
            {ambulanceRequests.map(req => {
              const isFinished = req.status === 'Completed';

              return (
                <div
                  key={req.id}
                  className={`health-card p-5 bg-white border border-[#E5E5E5] space-y-4 ${
                    !isFinished ? 'border-l-4 border-l-[#C4302B]' : 'border-l-4 border-l-[#0F7A4C]'
                  }`}
                >
                  {/* Status header with countdown ETA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1A1A1A]">{req.id}</span>
                      <StatusPill status={req.status} />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-[#FDE8E8] text-[#C4302B] border border-[#F8B4B4] px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {isFinished
                            ? 'ARRIVED AT DESTINATION'
                            : `ETA: ${req.etaMinutes}m ${secondsTicker}s`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stepper with live progression */}
                  <div className="py-1">
                    <Stepper
                      steps={AMBULANCE_STEPS}
                      currentStep={req.status}
                      isEmergency={true}
                    />
                  </div>

                  {/* Dispatch details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-[#F7F7F7] p-3 rounded border border-[#E5E5E5] space-y-1">
                      <div className="flex items-center gap-1.5 text-[#1A1A1A] font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-[#C4302B]" />
                        <span>Pickup Location:</span>
                      </div>
                      <p className="text-[#5C5C5C] pl-5">{req.pickupLocation}</p>
                    </div>

                    <div className="bg-[#F7F7F7] p-3 rounded border border-[#E5E5E5] space-y-1">
                      <div className="flex items-center gap-1.5 text-[#1A1A1A] font-semibold">
                        <Navigation className="w-3.5 h-3.5 text-[#0F7A4C]" />
                        <span>Target Facility:</span>
                      </div>
                      <p className="text-[#5C5C5C] pl-5">{req.destination}</p>
                    </div>
                  </div>

                  {/* Crew and Patient Details */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#5C5C5C]">
                    <div>
                      <strong className="text-[#1A1A1A]">Patient: </strong>
                      <span>{req.patientName}</span> • <span>{req.contact}</span>
                    </div>
                    <div>
                      <strong className="text-[#1A1A1A]">Unit: </strong>
                      <span>{req.unitId}</span>
                    </div>
                  </div>

                  {req.notes && (
                    <div className="text-xs text-[#5C5C5C] bg-[#FAFAFA] p-2.5 rounded border border-[#E5E5E5]">
                      <strong className="text-[#1A1A1A]">Triage Notes: </strong>
                      {req.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
