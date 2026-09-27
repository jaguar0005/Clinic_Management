import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientProfileModal } from '../../components/PatientProfileModal';

export const AdminPatients = () => {
  const { patients, appointments, documents } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients.filter(pt => {
    return (
      pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pt.bloodGroup && pt.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pt.chronicConditions && pt.chronicConditions.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

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

      {/* Reusable Patient Profile Modal with Full Preview & Interactive Documents */}
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
