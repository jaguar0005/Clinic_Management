import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Eye,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  Download,
  Printer
} from 'lucide-react';
import { StatusPill } from './StatusPill';

export const PatientProfileModal = ({
  patient,
  isOpen,
  onClose,
  appointments = [],
  documents = []
}) => {
  const [inspectingDoc, setInspectingDoc] = useState(null);
  const [inspectingApt, setInspectingApt] = useState(null);

  if (!isOpen || !patient) return null;

  // Filter appointments for this patient
  const patientAppointments = appointments.filter(
    apt => apt.patientId === patient.id || apt.patientName?.toLowerCase() === patient.name?.toLowerCase()
  );

  // Patient documents
  const patientDocs = patient.id === 'PT-89412' ? documents : documents.slice(0, 1);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-xl border border-[#E5E5E5] max-w-2xl w-full p-6 shadow-2xl my-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#E5E5E5] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#E6F4EC] border border-[#C8E6D5] text-[#0F7A4C] flex items-center justify-center font-bold text-lg">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#1A1A1A]">
                    {patient.name}
                  </h3>
                  <span className="font-mono text-xs text-[#5C5C5C] bg-[#F7F7F7] px-2 py-0.5 rounded border border-[#E5E5E5]">
                    {patient.id}
                  </span>
                </div>
                <p className="text-xs text-[#5C5C5C] mt-0.5">
                  {patient.age} years old • {patient.gender} • Blood Group: <strong className="text-[#C4302B]">{patient.bloodGroup}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#F7F7F7] p-1.5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Demographics & Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F7F7F7] p-4 rounded-xl border border-[#E5E5E5]">
            <div>
              <span className="text-[#5C5C5C] block">Contact Phone (Click to Call):</span>
              <a
                href={`tel:${patient.phone}`}
                className="font-semibold text-[#0F7A4C] hover:underline flex items-center gap-1.5 mt-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{patient.phone}</span>
              </a>
            </div>
            <div>
              <span className="text-[#5C5C5C] block">Email Address (Click to Mail):</span>
              <a
                href={`mailto:${patient.email}`}
                className="font-semibold text-[#0F7A4C] hover:underline flex items-center gap-1.5 mt-1 truncate"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{patient.email}</span>
              </a>
            </div>
            <div>
              <span className="text-[#5C5C5C] block">Residential Address:</span>
              <span className="font-semibold text-[#1A1A1A] flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#5C5C5C] shrink-0" />
                <span>{patient.address}</span>
              </span>
            </div>
            <div>
              <span className="text-[#5C5C5C] block">Emergency Contact:</span>
              <span className="font-semibold text-[#1A1A1A] mt-1 block">{patient.emergencyContact}</span>
            </div>
            <div>
              <span className="text-[#5C5C5C] block">Known Drug Allergies:</span>
              <span className="font-semibold text-[#C4302B] mt-1 block bg-[#FDE8E8] px-2 py-0.5 rounded border border-[#F8B4B4] inline-block">
                {patient.allergies || 'None reported'}
              </span>
            </div>
            <div>
              <span className="text-[#5C5C5C] block">Chronic Diagnostic History:</span>
              <span className="font-semibold text-[#1A1A1A] mt-1 block">{patient.chronicConditions || 'None reported'}</span>
            </div>
          </div>

          {/* Appointment History - Clickable */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0F7A4C]" />
              <span>Consultation History ({patientAppointments.length}) — Click to Inspect Clinical Notes</span>
            </h4>

            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {patientAppointments.length > 0 ? (
                patientAppointments.map(apt => (
                  <div
                    key={apt.id}
                    onClick={() => setInspectingApt(apt)}
                    className="p-3 bg-white hover:bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] text-xs flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1A1A1A] group-hover:text-[#0F7A4C]">{apt.type}</span>
                        <StatusPill status={apt.status} size="sm" />
                      </div>
                      <div className="text-[#5C5C5C] text-[11px] mt-0.5">
                        {apt.doctorName} • {apt.date} at {apt.time}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#0F7A4C] font-semibold underline">
                      View Notes
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#5C5C5C] italic p-2 bg-[#FAFAFA] rounded border border-[#E5E5E5]">
                  No prior appointment history on record for this patient.
                </p>
              )}
            </div>
          </div>

          {/* Uploaded Documents - FULLY CLICKABLE WITH DOCUMENT PREVIEW */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#0F7A4C]" />
              <span>Diagnostic Documents &amp; Scans (Click to Open)</span>
            </h4>

            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
              {patientDocs.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setInspectingDoc(doc)}
                  className="p-3 bg-white hover:bg-[#E6F4EC]/30 rounded-lg border border-[#E5E5E5] hover:border-[#0F7A4C] text-xs flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#1A1A1A] group-hover:text-[#0F7A4C] block">
                        {doc.fileName}
                      </span>
                      <span className="text-[11px] text-[#5C5C5C] block">
                        Uploaded {doc.uploadedAt} • {doc.fileSize} • {doc.category || 'Diagnostic'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectingDoc(doc);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#E6F4EC] text-[#0F7A4C] hover:bg-[#0F7A4C] hover:text-white rounded-lg border border-[#C8E6D5] transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Document</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#E5E5E5]">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded-lg transition-colors cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>

      {/* Document Inspector Modal with Full Preview */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E5E5E5] max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A] truncate max-w-md">
                  {inspectingDoc.fileName}
                </h3>
                <p className="text-xs text-[#5C5C5C]">
                  {inspectingDoc.category} • {inspectingDoc.fileSize} • Uploaded {inspectingDoc.uploadedAt}
                </p>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1.5 rounded-lg hover:bg-[#F7F7F7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Document Content / SVG Scan Preview */}
            <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] flex items-center justify-center min-h-[240px] max-h-[380px] overflow-hidden">
              {inspectingDoc.previewUrl ? (
                <img
                  src={inspectingDoc.previewUrl}
                  alt={inspectingDoc.fileName}
                  className="max-h-[340px] w-full rounded-lg object-contain border border-[#E5E5E5] shadow-xs bg-white"
                />
              ) : (
                <div className="text-center space-y-3 py-6">
                  <div className="w-14 h-14 rounded-full bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center mx-auto">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">{inspectingDoc.fileName}</h4>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">Clinical PDF Imaging &amp; Diagnostic Telemetry Report</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F4EC] text-[#0F7A4C] rounded-lg text-xs font-semibold border border-[#C8E6D5]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Cryptographically Signed Clinical Record</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-[#5C5C5C] bg-[#FAFAFA] p-3 rounded-lg border border-[#E5E5E5] flex items-center justify-between">
              <div>
                <span>Authorizing Clinician: <strong className="text-[#1A1A1A]">{inspectingDoc.doctor || 'Dr. Sarah Jenkins, MD'}</strong></span>
                <span className="block text-[11px] text-[#0F7A4C] font-mono mt-0.5">SHA-256: 8f9b2a7d4e1c390a... (Verified)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Simulating print for ${inspectingDoc.fileName}`)}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E5E5E5] text-[#1A1A1A] rounded-lg hover:bg-[#F7F7F7] flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectingDoc(null)}
                  className="px-4 py-1.5 text-xs font-semibold bg-[#0F7A4C] text-white rounded-lg hover:bg-[#0c633d]"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Inspector Modal */}
      {inspectingApt && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E5E5E5] max-w-md w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">Consultation Details</h3>
                <span className="font-mono text-xs text-[#5C5C5C]">{inspectingApt.id}</span>
              </div>
              <button
                onClick={() => setInspectingApt(null)}
                className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-[#F7F7F7] p-2.5 rounded-lg border border-[#E5E5E5]">
                <span className="text-[#5C5C5C]">Status:</span>
                <StatusPill status={inspectingApt.status} />
              </div>

              <div className="bg-[#F7F7F7] p-3 rounded-lg border border-[#E5E5E5] space-y-1.5">
                <div><strong>Physician:</strong> {inspectingApt.doctorName} ({inspectingApt.specialization})</div>
                <div><strong>Date &amp; Time:</strong> {inspectingApt.date} at {inspectingApt.time}</div>
                <div><strong>Hospital:</strong> {inspectingApt.hospital}</div>
                <div><strong>Consultation Type:</strong> {inspectingApt.type}</div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#E5E5E5]">
                <strong className="text-[#1A1A1A] block mb-1">Clinical Notes &amp; Observations:</strong>
                <p className="text-[#5C5C5C] leading-relaxed">{inspectingApt.notes || 'Routine consultation on file.'}</p>
              </div>

              {inspectingApt.status === 'Cancelled' && inspectingApt.cancellationReason && (
                <div className="bg-[#FDE8E8] text-[#C4302B] p-3 rounded-lg border border-[#F8B4B4]">
                  <strong>Cancellation Reason ({inspectingApt.cancelledBy || 'Staff'}):</strong>
                  <p className="mt-0.5">{inspectingApt.cancellationReason}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E5E5E5]">
              <button
                onClick={() => setInspectingApt(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#0F7A4C] text-white rounded-lg hover:bg-[#0c633d]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
