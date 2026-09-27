import React from 'react';
import { Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HealthcareMap } from '../../components/HealthcareMap';

export const StaffMapPage = () => {
  const { facilities } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Regional Facility Directory &amp; EMS Map
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#E6F4EC] text-[#0F7A4C] rounded border border-[#C8E6D5]">
              Staff Dispatch View
            </span>
          </div>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Geographic status of trauma centers, urgent clinics, blood reserves, and active ambulances.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#5C5C5C] bg-[#F7F7F7] px-3 py-1.5 rounded-lg border border-[#E5E5E5]">
          <Compass className="w-3.5 h-3.5 text-[#0F7A4C]" />
          <span>Datum: WGS 84 • Metro Grid</span>
        </div>
      </div>

      {/* Map Component */}
      <HealthcareMap facilities={facilities} height="600px" />
    </div>
  );
};
