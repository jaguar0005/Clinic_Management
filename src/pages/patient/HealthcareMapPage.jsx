import React from 'react';
import { Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HealthcareMap } from '../../components/HealthcareMap';

export const HealthcareMapPage = () => {
  const { facilities } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Regional Healthcare &amp; Emergency Map
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#E6F4EC] text-[#0F7A4C] rounded border border-[#C8E6D5]">
              Leaflet • OpenStreetMap
            </span>
          </div>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Real-time geospatial overview of hospitals, outpatient clinics, blood depots, and active emergency transit units.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#5C5C5C] bg-[#F7F7F7] px-3 py-1.5 rounded-lg border border-[#E5E5E5]">
          <Compass className="w-3.5 h-3.5 text-[#0F7A4C]" />
          <span>Metro Regional Grid • Fixed Datum</span>
        </div>
      </div>

      {/* Map Component */}
      <HealthcareMap facilities={facilities} height="600px" />

      {/* Legend & Instructions Footer */}
      <div className="health-card p-4 bg-white border border-[#E5E5E5] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-[#1A1A1A]">Marker Types:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#0F7A4C] border border-white shadow-xs" />
            <span className="text-[#5C5C5C]">Hospital / Level 1 Trauma</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#2563EB] border border-white shadow-xs" />
            <span className="text-[#5C5C5C]">Outpatient Clinic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#C4302B] border border-white shadow-xs" />
            <span className="text-[#5C5C5C]">Blood Depot / Repository</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#D97706] border border-white shadow-xs" />
            <span className="text-[#5C5C5C]">EMS Ambulance Unit</span>
          </div>
        </div>

        <div className="text-[#5C5C5C] text-[11px] italic">
          Click any marker to inspect clinical capabilities and launch turn-by-turn routing.
        </div>
      </div>
    </div>
  );
};
