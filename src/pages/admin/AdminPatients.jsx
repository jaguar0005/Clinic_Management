import React, { useState } from 'react';
import { Search, Eye, Phone, Mail, MapPin, FileText, Calendar, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusPill } from '../../components/StatusPill';

export const AdminPatients = () => {
  const { patients, appointments, documents } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [inspectingDoc, setInspectingDoc] = useState(null);

  const filteredPatients = patients.filter(pt => {
    return (
      pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pt.bloodGroup && pt.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pt.chronicConditions && pt.chronicConditions.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getPatientAppointments = (patient) => {
    return appointments.filter(
      apt => apt.patientId === patient.id || apt.patientName.toLowerCase() === patient.name.toLowerCase()
    );
  };

  const getPatientDocuments = (patient) => {
    if (patient.id === 'PT-89412') return documents;
    return documents.slice(0, 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
            Master Patient Registry &amp; EHR Directory
          </h1>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Complete administrative overview of all enrolled patients, medical profiles, and diagnostic repositories.
          </p>
        </div>

        <div className="text-xs text-[#5C5C5C] bg-[#F7F7F7] px-3 py-1.5 rounded-lg border border-[#E5E5E5]">
          Total Registered: {patients.length} Subjects
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-[#5C5C5C] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search patient by name, MRN ID, blood type, or chronic condition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
        />
      </div>

      {/* Patients Table */}
      <div className="health-card bg-white border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#5C5C5C] font-semibold">
              <tr>
                <th className="p-3">Patient Name / MRN</th>
                <th className="p-3">Demographics</th>
                <th className="p-3 text-center">Blood Group</th>
                <th className="p-3">Chronic Conditions &amp; Allergies</th>
                <th className="p-3">Contact Information</th>
                <th className="p-3 text-right">EHR Profile</th>
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

      {/* Patient Profile Modal */}
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

            {/* Appointment History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0F7A4C]" />
                <span>Appointment History ({getPatientAppointments(selectedPatient).length})</span>
              </h4>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {getPatientAppointments(selectedPatient).map(apt => (
                  <div
                    key={apt.id}
                    className="p-3 bg-white rounded border border-[#E5E5E5] text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1A1A1A]">{apt.type}</span>
                        <StatusPill status={apt.status} size="sm" />
                      </div>
                      <div className="text-[#5C5C5C] text-[11px] mt-0.5">
                        {apt.doctorName} ({apt.specialization}) • {apt.date} at {apt.time}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#5C5C5C]">{apt.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded Documents List */}
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
                          Uploaded {doc.uploadedAt} • {doc.fileSize}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectingDoc(doc);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#E6F4EC] text-[#0F7A4C] hover:bg-[#0F7A4C] hover:text-white rounded border border-[#C8E6D5] transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E5E5E5]">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#0F7A4C] text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Inspector Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E5E5E5] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A] truncate max-w-xs">{inspectingDoc.fileName}</h3>
                <p className="text-xs text-[#5C5C5C]">{inspectingDoc.category} • {inspectingDoc.fileSize}</p>
              </div>
              <button onClick={() => setInspectingDoc(null)} className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] flex items-center justify-center min-h-[200px]">
              {inspectingDoc.previewUrl ? (
                <img src={inspectingDoc.previewUrl} alt={inspectingDoc.fileName} className="max-h-[300px] w-auto rounded object-contain" />
              ) : (
                <div className="text-center space-y-2 py-4">
                  <FileText className="w-10 h-10 text-[#0F7A4C] mx-auto" />
                  <p className="text-xs font-semibold text-[#1A1A1A]">{inspectingDoc.fileName}</p>
                  <p className="text-[11px] text-[#5C5C5C]">Authorized Clinical Document (PDF)</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setInspectingDoc(null)} className="px-5 py-2 text-xs font-semibold bg-[#0F7A4C] text-white rounded-lg">
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
