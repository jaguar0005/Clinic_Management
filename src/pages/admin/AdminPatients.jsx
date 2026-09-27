import React, { useState } from 'react';
import { Search, UserPlus, X, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientProfileModal } from '../../components/PatientProfileModal';

export const AdminPatients = () => {
  const { patients, appointments, documents, enrollPatient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    age: 35,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: 'Metro City, NY',
    emergencyContact: '',
    allergies: 'None reported',
    chronicConditions: 'General health monitoring'
  });

  const filteredPatients = patients.filter(pt => {
    return (
      pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pt.bloodGroup && pt.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pt.chronicConditions && pt.chronicConditions.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pt.email && pt.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newPt = enrollPatient(formData);
    setIsEnrollModalOpen(false);
    setSuccessBanner(`Patient "${newPt.name}" registered successfully with MRN: ${newPt.id}. Visible immediately to doctors and admin.`);
    setTimeout(() => setSuccessBanner(null), 6000);

    // Reset form
    setFormData({
      name: '',
      age: 35,
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '',
      email: '',
      address: 'Metro City, NY',
      emergencyContact: '',
      allergies: 'None reported',
      chronicConditions: 'General health monitoring'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Master Patient Registry &amp; EHR Directory
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#E6F4EC] text-[#0F7A4C] rounded border border-[#C8E6D5] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full Clinical Access</span>
            </span>
          </div>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Complete administrative overview of all enrolled patients, medical profiles, and persistent diagnostic repositories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-[#5C5C5C] bg-[#F7F7F7] px-3 py-2 rounded-lg border border-[#E5E5E5] font-semibold">
            Total Enrolled: {patients.length} Subjects
          </div>
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Enroll New Patient</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-[#E6F4EC] border border-[#C8E6D5] text-[#0F7A4C] p-3.5 rounded-lg text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-[#0F7A4C] hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-[#5C5C5C] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search patient by name, MRN ID, email, blood type, or chronic condition..."
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

      {/* Enroll New Patient Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-[#E5E5E5] max-w-lg w-full p-6 shadow-xl my-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    Enroll New Clinical Patient
                  </h3>
                  <p className="text-xs text-[#5C5C5C]">
                    Creates persistent EHR record visible to attending doctors and admin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1.5 rounded-lg hover:bg-[#F7F7F7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#1A1A1A] block mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 012-3456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="patient@metrohealth.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1A1A1A] block mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 104 Riverside Drive, Metro City, NY"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    Known Drug Allergies
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Sulfa"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    Chronic Medical Conditions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hypertension, Asthma"
                    value={formData.chronicConditions}
                    onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#5C5C5C] hover:bg-[#F7F7F7] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Register Patient Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Patient Profile Modal with Full Google Drive Preview & Interactive Records */}
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
