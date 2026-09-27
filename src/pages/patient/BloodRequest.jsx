import React, { useState } from 'react';
import { Droplet, Check, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Stepper } from '../../components/Stepper';
import { StatusPill } from '../../components/StatusPill';

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const BLOOD_STEPPER_STEPS = ['Submitted', 'Doctor Verified', 'Searching', 'Availability Found'];

export const BloodRequest = () => {
  const { currentPatient, bloodRequests, bloodBanks, doctors, createBloodRequest } = useApp();

  const [formData, setFormData] = useState({
    patientName: currentPatient.name,
    bloodGroup: currentPatient.bloodGroup || 'O+',
    units: 2,
    hospital: 'Metro General Hospital (Surgical Ward 3)',
    doctorId: doctors[0]?.id || 'DOC-01',
    doctorName: doctors[0]?.name || 'Dr. Sarah Jenkins, MD',
    requiredBy: '2026-09-29T14:00',
    contact: currentPatient.phone,
    urgency: 'High',
    notes: ''
  });

  const [submittedBanner, setSubmittedBanner] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReq = createBloodRequest({
      ...formData,
      requiredBy: formData.requiredBy.replace('T', ' ')
    });

    setSubmittedBanner(`Blood unit requisition ${newReq.id} recorded. Initial status: Submitted.`);
    setTimeout(() => setSubmittedBanner(null), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FDE8E8] text-[#C4302B] border border-[#F8B4B4] flex items-center justify-center">
            <Droplet className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Urgent Blood Requisition
            </h1>
            <p className="text-xs text-[#5C5C5C]">
              Log official transfusion demands, track verification through clinical staff, and monitor certified regional blood banks.
            </p>
          </div>
        </div>
      </div>

      {submittedBanner && (
        <div className="bg-[#E6F4EC] border border-[#C8E6D5] text-[#0F7A4C] p-4 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span className="font-semibold">{submittedBanner}</span>
          </div>
        </div>
      )}

      {/* Grid: Form on Left, Tracked Active Requests on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Requisition Form (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="health-card p-5 bg-white border border-[#E5E5E5]">
            <h2 className="text-base font-semibold text-[#1A1A1A] mb-1">
              New Blood Request
            </h2>
            <p className="text-xs text-[#5C5C5C] mb-4">
              Enter clinical requirements. Requests require physician verification in staff coordination.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                    Units Required
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                  Authorizing Physician &amp; ID (Required for Verification)
                </label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => {
                    const doc = doctors.find(d => d.id === e.target.value);
                    setFormData({
                      ...formData,
                      doctorId: e.target.value,
                      doctorName: doc ? doc.name : ''
                    });
                  }}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} (ID: {d.id}) — {d.specialization}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-[#5C5C5C] mt-0.5 block">
                  Only the physician with this ID can verify and authorize this request in their staff portal.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                  Receiving Hospital / Ward
                </label>
                <input
                  type="text"
                  required
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  placeholder="e.g. Metro General Hospital (Surgical Ward 3)"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                    Required By Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.requiredBy}
                    onChange={(e) => setFormData({ ...formData, requiredBy: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                  Clinical Indication / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Scheduled elective vascular revision, pre-op reserve."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0F7A4C] hover:bg-[#0c633d] text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Droplet className="w-4 h-4" />
                <span>Submit Blood Requisition</span>
              </button>
            </form>
          </div>
        </div>

        {/* Tracked Active Blood Requests (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Tracked Blood Requests ({bloodRequests.length})
            </h2>
            <span className="text-xs text-[#5C5C5C]">
              Synced with Staff Emergency Center
            </span>
          </div>

          <div className="space-y-4">
            {bloodRequests.map(req => (
              <div
                key={req.id}
                className="health-card p-5 bg-white border border-[#E5E5E5] space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-[#5C5C5C]">{req.id}</span>
                      <span className="text-xs text-[#5C5C5C]">•</span>
                      <span className="text-xs font-bold text-[#C4302B] px-2 py-0.5 bg-[#FDE8E8] rounded border border-[#F8B4B4]">
                        {req.bloodGroup} — {req.units} Units
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1A1A1A] mt-1">
                      {req.patientName}
                    </h3>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">
                      Facility: {req.hospital}
                    </p>
                    <p className="text-xs text-[#0F7A4C] font-medium mt-0.5">
                      Authorizing MD: {req.doctorName || 'Dr. Sarah Jenkins, MD'} ({req.doctorId || 'DOC-01'})
                    </p>
                  </div>
                  <StatusPill status={req.status} />
                </div>

                {/* Status Stepper */}
                <div className="pt-2 pb-1 border-t border-[#E5E5E5]">
                  <Stepper
                    steps={BLOOD_STEPPER_STEPS}
                    currentStep={req.status}
                    isEmergency={false}
                  />
                </div>

                {req.status === 'Doctor Verified' && (
                  <div className="bg-[#E6F4EC] border border-[#C8E6D5] text-[#0F7A4C] p-2.5 rounded text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F7A4C] animate-ping" />
                    <span>Verified by {req.doctorName || 'Physician'}. Automated repository search commencing...</span>
                  </div>
                )}
                {req.status === 'Searching' && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span className="font-semibold">Searching regional repositories across Metro City for compatible {req.bloodGroup} units...</span>
                  </div>
                )}
                {req.status === 'Availability Found' && (
                  <div className="bg-[#E6F4EC] border border-[#C8E6D5] text-[#0F7A4C] p-2.5 rounded text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0F7A4C]" />
                    <span className="font-semibold">Compatible units located and pre-allocated at Metro Regional Blood Center!</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#F7F7F7] p-2.5 rounded border border-[#E5E5E5]">
                  <div>
                    <span className="text-[#5C5C5C] block">Required By:</span>
                    <span className="font-semibold text-[#1A1A1A]">{req.requiredBy}</span>
                  </div>
                  <div>
                    <span className="text-[#5C5C5C] block">Contact:</span>
                    <span className="font-semibold text-[#1A1A1A]">{req.contact}</span>
                  </div>
                  {req.notes && (
                    <div className="col-span-2 pt-1 border-t border-[#E5E5E5] text-[#5C5C5C]">
                      <strong className="text-[#1A1A1A]">Clinical Rationale: </strong>
                      {req.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Static Seeded Blood Banks Table */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Regional Blood Depot Inventory (Static Reported Data)
            </h2>
            <p className="text-xs text-[#5C5C5C]">
              Availability counts reported by accredited repositories across Metro Area.
            </p>
          </div>
          <span className="text-xs text-[#5C5C5C] self-start sm:self-auto">
            4 Facilities Active
          </span>
        </div>

        <div className="health-card overflow-hidden bg-white border border-[#E5E5E5]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#5C5C5C] font-semibold">
                <tr>
                  <th className="p-3">Facility Name</th>
                  <th className="p-3">Distance</th>
                  <th className="p-3 text-center">O+</th>
                  <th className="p-3 text-center">O-</th>
                  <th className="p-3 text-center">A+</th>
                  <th className="p-3 text-center">A-</th>
                  <th className="p-3 text-center">B+</th>
                  <th className="p-3 text-center">B-</th>
                  <th className="p-3 text-center">AB+</th>
                  <th className="p-3 text-center">AB-</th>
                  <th className="p-3">Reported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {bloodBanks.map(bank => (
                  <tr key={bank.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="p-3 font-semibold text-[#1A1A1A]">
                      <div>{bank.name}</div>
                      <div className="text-[11px] text-[#5C5C5C] font-normal">{bank.address}</div>
                    </td>
                    <td className="p-3 text-[#5C5C5C] whitespace-nowrap">
                      {bank.distance}
                    </td>
                    {BLOOD_GROUPS.map(bg => {
                      const count = bank.inventory[bg] || 0;
                      return (
                        <td
                          key={bg}
                          className={`p-3 text-center font-mono ${
                            count === 0
                              ? 'text-[#C4302B] font-bold bg-[#FDE8E8]/40'
                              : count < 5
                              ? 'text-amber-700 font-semibold'
                              : 'text-[#1A1A1A]'
                          }`}
                        >
                          {count}
                        </td>
                      );
                    })}
                    <td className="p-3 text-[#5C5C5C] whitespace-nowrap">
                      {bank.lastUpdated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mandatory Disclaimer Line */}
          <div className="p-3 bg-[#F7F7F7] border-t border-[#E5E5E5] flex items-center gap-2 text-xs text-[#5C5C5C]">
            <Info className="w-4 h-4 text-[#5C5C5C] shrink-0" />
            <span className="italic">
              Availability is reported information and may change. Cross-matching and emergency reservations must be confirmed through clinical staff.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
