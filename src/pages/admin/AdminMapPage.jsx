import React, { useState } from 'react';
import {
  Compass,
  Plus,
  X,
  Check,
  Building2,
  MapPin,
  Phone,
  Bed,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HealthcareMap } from '../../components/HealthcareMap';

const COORDINATE_PRESETS = [
  { label: 'Downtown Medical District', lat: 40.7128, lng: -74.0060 },
  { label: 'North Metro Health Corridor', lat: 40.7280, lng: -73.9950 },
  { label: 'East River Clinical Outpost', lat: 40.7180, lng: -73.9850 },
  { label: 'West Hudson Emergency Zone', lat: 40.7050, lng: -74.0150 },
  { label: 'Central Midtown Pavilion', lat: 40.7215, lng: -74.0010 },
  { label: 'Custom Coordinates', lat: '', lng: '' }
];

export const AdminMapPage = () => {
  const { facilities, addFacility } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'hospital', // 'hospital' | 'clinic'
    address: '',
    lat: 40.7280,
    lng: -73.9950,
    specialties: 'General Medicine, Urgent Diagnostics, Outpatient Care',
    phone: '+1 (555) 019-8822',
    emergencyBeds: 10,
    operatingHours: '24 Hours / 7 Days',
    distance: '2.5 km'
  });

  const [presetIndex, setPresetIndex] = useState(1);

  const handlePresetChange = (idx) => {
    setPresetIndex(idx);
    const preset = COORDINATE_PRESETS[idx];
    if (preset && preset.lat !== '') {
      setFormData(prev => ({
        ...prev,
        lat: preset.lat,
        lng: preset.lng
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newFac = addFacility(formData);
    setIsModalOpen(false);
    setSuccessBanner(`Successfully registered "${newFac.name}" (${newFac.type.toUpperCase()}) on network map. Location is live for all Doctors and Patients.`);
    setTimeout(() => setSuccessBanner(null), 6000);

    // Reset form
    setFormData({
      name: '',
      type: 'hospital',
      address: '',
      lat: 40.7280,
      lng: -73.9950,
      specialties: 'General Medicine, Urgent Diagnostics, Outpatient Care',
      phone: '+1 (555) 019-8822',
      emergencyBeds: 10,
      operatingHours: '24 Hours / 7 Days',
      distance: '2.5 km'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Regional Facilities &amp; Geospatial Health Map
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#E6F4EC] text-[#0F7A4C] rounded border border-[#C8E6D5] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </span>
          </div>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Real-time GIS map of hospital trauma centers, outpatient clinics, and mobile ambulances. Register new physical facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Hospital or Clinic</span>
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

      {/* Live Map Component */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#5C5C5C]">
          <span className="font-semibold text-[#1A1A1A]">
            Active Map Pins: {facilities.length} Facilities (Updates Live for Patients &amp; Doctors)
          </span>
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#0F7A4C]" />
            <span>WGS 84 • Metro Regional Coordinate Grid</span>
          </span>
        </div>

        <HealthcareMap facilities={facilities} height="580px" />
      </div>

      {/* Facilities Directory Table */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-semibold text-[#1A1A1A]">
          Registered Physical Facilities ({facilities.length})
        </h2>

        <div className="health-card bg-white border border-[#E5E5E5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#5C5C5C] font-semibold">
                <tr>
                  <th className="p-3">Facility Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Coordinates (Lat, Lng)</th>
                  <th className="p-3">Address &amp; Hours</th>
                  <th className="p-3">Capacity &amp; Phone</th>
                  <th className="p-3 text-right">Specialties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {facilities.map(fac => (
                  <tr key={fac.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="p-3 font-semibold text-[#1A1A1A]">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          fac.type === 'hospital' ? 'bg-[#E6F4EC] text-[#0F7A4C]' :
                          fac.type === 'clinic' ? 'bg-blue-50 text-blue-700' :
                          fac.type === 'blood-bank' ? 'bg-[#FDE8E8] text-[#C4302B]' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div>{fac.name}</div>
                          <span className="font-mono text-[10px] text-[#5C5C5C]">{fac.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 uppercase font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-bold border ${
                        fac.type === 'hospital' ? 'bg-[#E6F4EC] text-[#0F7A4C] border-[#C8E6D5]' :
                        fac.type === 'clinic' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        fac.type === 'blood-bank' ? 'bg-[#FDE8E8] text-[#C4302B] border-[#F8B4B4]' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {fac.type}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[#5C5C5C]">
                      {fac.lat.toFixed(4)}, {fac.lng.toFixed(4)}
                    </td>
                    <td className="p-3 text-[#5C5C5C]">
                      <div className="text-[#1A1A1A] font-medium">{fac.address}</div>
                      <div className="text-[11px] text-[#5C5C5C]">{fac.operatingHours}</div>
                    </td>
                    <td className="p-3 text-[#5C5C5C]">
                      <div>{fac.emergencyBeds} Emergency Beds</div>
                      <div className="text-[11px] text-[#0F7A4C]">{fac.phone}</div>
                    </td>
                    <td className="p-3 text-right text-[#5C5C5C] max-w-xs truncate">
                      {fac.specialties}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Facility Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-[#E5E5E5] max-w-lg w-full p-6 shadow-xl my-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    Register New Medical Facility
                  </h3>
                  <p className="text-xs text-[#5C5C5C]">
                    Pins new hospital or clinic to live map for all users
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1.5 rounded-lg hover:bg-[#F7F7F7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#1A1A1A] block mb-1">
                  Facility Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Luke Memorial Hospital"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    Facility Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  >
                    <option value="hospital">Hospital &amp; Trauma ER</option>
                    <option value="clinic">Outpatient Urgent Clinic</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    Emergency Beds Capacity
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.emergencyBeds}
                    onChange={(e) => setFormData({ ...formData, emergencyBeds: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1A1A1A] block mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 520 Hudson Blvd, Metro City, NY"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1A1A1A] block mb-1">
                  Geographic Location (Map Pin) *
                </label>
                <select
                  value={presetIndex}
                  onChange={(e) => handlePresetChange(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] mb-2 focus:outline-none focus:border-[#0F7A4C]"
                >
                  {COORDINATE_PRESETS.map((p, idx) => (
                    <option key={p.label} value={idx}>
                      {p.label} {p.lat ? `(${p.lat}, ${p.lng})` : ''}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-[#5C5C5C] block">Latitude:</span>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#E5E5E5] bg-white font-mono text-xs focus:outline-none focus:border-[#0F7A4C]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#5C5C5C] block">Longitude:</span>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#E5E5E5] bg-white font-mono text-xs focus:outline-none focus:border-[#0F7A4C]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={formData.operatingHours}
                    onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1A1A1A] block mb-1">
                  Specialties / Clinical Services
                </label>
                <input
                  type="text"
                  placeholder="e.g. Level 1 Trauma, Intensive Care, Ambulatory Surgery"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#5C5C5C] hover:bg-[#F7F7F7] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#0F7A4C] hover:bg-[#0c633d] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Pin Facility to Map</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
