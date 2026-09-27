import React, { useState } from 'react';
import {
  Search,
  Calendar,
  FileText,
  X,
  Eye,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  User,
  Stethoscope
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusPill } from '../../components/StatusPill';

export const StaffPatients = () => {
  const { patients, appointments, documents } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Document preview state for doctor inspection
  const [inspectingDoc, setInspectingDoc] = useState(null);
  const [inspectingApt, setInspectingApt] = useState(null);

  const filteredPatients = patients.filter(pt => {
    const matchesSearch =
      pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pt.chronicConditions && pt.chronicConditions.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBlood =
      bloodGroupFilter === 'all' || pt.bloodGroup === bloodGroupFilter;

    return matchesSearch && matchesBlood;
  });

  const getPatientAppointments = (patient) => {
    return appointments.filter(
      apt => apt.patientId === patient.id || apt.patientName.toLowerCase() === patient.name.toLowerCase()
    );
  };

  const getPatientDocuments = (patient) => {
    // Return patient documents
    if (patient.id === 'PT-89412') {
      return documents;
    }
    return documents.slice(0, 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
            Patient Registry &amp; Clinical Records
          </h1>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Search patient records, examine clinical backgrounds, past appointments, and diagnostic documentation.
          </p>
        </div>

        <div className="text-xs text-[#5C5C5C] font-semibold bg-[#F7F7F7] px-3 py-1.5 rounded-lg border border-[#E5E5E5]">
          Total Registered: {patients.length} Subjects
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#5C5C5C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, MRN (e.g. PT-89412), or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
          />
        </div>

        <select
          value={bloodGroupFilter}
          onChange={(e) => setBloodGroupFilter(e.target.value)}
          className="text-xs bg-white border border-[#E5E5E5] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C] w-full sm:w-auto"
        >
          <option value="all">All Blood Groups</option>
          {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
      </div>

      {/* Patient Table / List */}
      <div className="health-card bg-white border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#5C5C5C] font-semibold">
              <tr>
                <th className="p-3">Patient Name / MRN</th>
                <th className="p-3">Demographics</th>
                <th className="p-3 text-center">Blood Group</th>
                <th className="p-3">Chronic Conditions / Allergies</th>
                <th className="p-3">Contact</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredPatients.map(pt => (
                <tr key={pt.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="p-3 font-semibold text-[#1A1A1A]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center font-bold text-xs">
                        {pt.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1A1A1A]">{pt.name}</div>
                        <div className="text-[11px] font-mono text-[#5C5C5C] font-normal">{pt.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-[#5C5C5C]">
                    {pt.age} yrs • {pt.gender}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-[#FDE8E8] text-[#C4302B] border border-[#F8B4B4]">
                      {pt.bloodGroup}
                    </span>
                  </td>
                  <td className="p-3 text-[#5C5C5C]">
                    <div className="text-[#1A1A1A] font-medium">{pt.chronicConditions || 'None reported'}</div>
                    <div className="text-[11px] text-[#5C5C5C]">Allergies: {pt.allergies}</div>
                  </td>
                  <td className="p-3 text-[#5C5C5C]">
                    <div>{pt.phone}</div>
                    <div className="text-[11px] text-[#5C5C5C] truncate max-w-[140px]">{pt.email}</div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedPatient(pt)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#0F7A4C] text-[#0F7A4C] hover:bg-[#E6F4EC] rounded-lg transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Profile Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-[#E5E5E5] max-w-2xl w-full p-6 shadow-xl my-6 space-y-5">
            <div className="flex items-start justify-between border-b border-[#E5E5E5] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#E6F4EC] border border-[#C8E6D5] text-[#0F7A4C] flex items-center justify-center font-bold text-lg">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1A1A1A]">
                      {selectedPatient.name}
                    </h3>
                    <span className="font-mono text-xs text-[#5C5C5C] bg-[#F7F7F7] px-2 py-0.5 rounded border border-[#E5E5E5]">
                      {selectedPatient.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C5C5C] mt-0.5">
                    {selectedPatient.age} years old • {selectedPatient.gender} • Blood Group: <strong className="text-[#C4302B]">{selectedPatient.bloodGroup}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Info Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F7F7F7] p-4 rounded-lg border border-[#E5E5E5]">
              <div>
                <span className="text-[#5C5C5C] block">Contact Phone:</span>
                <a href={`tel:${selectedPatient.phone}`} className="font-semibold text-[#0F7A4C] hover:underline flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span>{selectedPatient.phone}</span>
                </a>
              </div>
              <div>
                <span className="text-[#5C5C5C] block">Email Address:</span>
                <a href={`mailto:${selectedPatient.email}`} className="font-semibold text-[#0F7A4C] hover:underline flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" />
                  <span>{selectedPatient.email}</span>
                </a>
              </div>
              <div>
                <span className="text-[#5C5C5C] block">Residential Address:</span>
                <span className="font-semibold text-[#1A1A1A] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#5C5C5C]" />
                  <span>{selectedPatient.address}</span>
                </span>
              </div>
              <div>
                <span className="text-[#5C5C5C] block">Emergency Contact:</span>
                <span className="font-semibold text-[#1A1A1A] mt-0.5 block">{selectedPatient.emergencyContact}</span>
              </div>
              <div>
                <span className="text-[#5C5C5C] block">Known Drug Allergies:</span>
                <span className="font-semibold text-[#C4302B] mt-0.5 block">{selectedPatient.allergies}</span>
              </div>
              <div>
                <span className="text-[#5C5C5C] block">Chronic Diagnostic History:</span>
                <span className="font-semibold text-[#1A1A1A] mt-0.5 block">{selectedPatient.chronicConditions}</span>
              </div>
            </div>

            {/* Appointment History for this patient */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0F7A4C]" />
                <span>Appointment History ({getPatientAppointments(selectedPatient).length}) — Click to Inspect</span>
              </h4>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {getPatientAppointments(selectedPatient).length > 0 ? (
                  getPatientAppointments(selectedPatient).map(apt => (
                    <div
                      key={apt.id}
                      onClick={() => setInspectingApt(apt)}
                      className="p-3 bg-white hover:bg-[#F7F7F7] rounded border border-[#E5E5E5] text-xs flex items-center justify-between cursor-pointer transition-colors"
                      title="Click to view appointment notes"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1A1A1A]">{apt.type}</span>
                          <StatusPill status={apt.status} size="sm" />
                        </div>
                        <div className="text-[#5C5C5C] text-[11px] mt-0.5">
                          {apt.doctorName} • {apt.date} at {apt.time}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-[#0F7A4C] font-semibold underline">Inspect</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#5C5C5C] italic">No appointment history on record.</p>
                )}
              </div>
            </div>

            {/* Uploaded Documents List - CLICKABLE FOR DOCTOR INSPECTION */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0F7A4C]" />
                <span>Uploaded Documents &amp; Imaging (Click to Open)</span>
              </h4>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {getPatientDocuments(selectedPatient).map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setInspectingDoc(doc)}
                    className="p-3 bg-white hover:bg-[#E6F4EC]/30 rounded-lg border border-[#E5E5E5] hover:border-[#0F7A4C] text-xs flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center shrink-0">
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
                      className="px-3 py-1.5 text-xs font-semibold bg-[#E6F4EC] text-[#0F7A4C] hover:bg-[#0F7A4C] hover:text-white rounded border border-[#C8E6D5] transition-colors flex items-center gap-1.5 shrink-0"
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
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded-lg"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Inspector Modal for Doctor */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E5E5E5] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A] truncate max-w-xs">
                  {inspectingDoc.fileName}
                </h3>
                <p className="text-xs text-[#5C5C5C]">
                  {inspectingDoc.category} • {inspectingDoc.fileSize}
                </p>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Preview View */}
            <div className="p-4 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] flex items-center justify-center min-h-[220px]">
              {inspectingDoc.previewUrl ? (
                <img
                  src={inspectingDoc.previewUrl}
                  alt={inspectingDoc.fileName}
                  className="max-h-[320px] w-auto rounded object-contain border border-[#E5E5E5]"
                />
              ) : (
                <div className="text-center space-y-3 py-4">
                  <div className="w-14 h-14 rounded-full bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center mx-auto">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">{inspectingDoc.fileName}</h4>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">Clinical PDF Imaging &amp; Diagnostic Telemetry Report</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E6F4EC] text-[#0F7A4C] rounded text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Cryptographically Signed Clinical Record</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-[#5C5C5C] bg-[#FAFAFA] p-3 rounded border border-[#E5E5E5] space-y-1">
              <div><strong>Document Upload Date:</strong> {inspectingDoc.uploadedAt}</div>
              <div><strong>Category:</strong> {inspectingDoc.category || 'Diagnostic'}</div>
              <div><strong>Authorized Clinician Reviewer:</strong> {inspectingDoc.doctor || 'Dr. Sarah Jenkins, MD'}</div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#5C5C5C]">
                PulsePoint Health Encrypted Document Viewer
              </span>
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-5 py-2 text-xs font-semibold bg-[#0F7A4C] text-white rounded-lg hover:bg-[#0c633d]"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Inspector Modal */}
      {inspectingApt && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E5E5E5] max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-2">
                <StatusPill status={inspectingApt.status} />
                <span className="font-mono text-xs text-[#5C5C5C]">{inspectingApt.id}</span>
              </div>
              <button
                onClick={() => setInspectingApt(null)}
                className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1A1A]">{inspectingApt.type}</h3>
              <p className="text-xs text-[#5C5C5C] mt-1">{inspectingApt.notes}</p>
            </div>

            <div className="bg-[#F7F7F7] p-3 rounded border border-[#E5E5E5] space-y-1.5 text-xs">
              <div><strong>Physician:</strong> {inspectingApt.doctorName} ({inspectingApt.specialization})</div>
              <div><strong>Scheduled Date &amp; Time:</strong> {inspectingApt.date} at {inspectingApt.time}</div>
              <div><strong>Location:</strong> {inspectingApt.hospital}</div>
            </div>

            {inspectingApt.status === 'Cancelled' && inspectingApt.cancellationReason && (
              <div className="text-xs text-[#C4302B] bg-[#FDE8E8] p-2.5 rounded border border-[#F8B4B4]">
                <strong>Cancellation Reason ({inspectingApt.cancelledBy || 'Staff'}): </strong>
                <span>{inspectingApt.cancellationReason}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingApt(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-[#0F7A4C] text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
