import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, Navigation, Phone, Clock } from 'lucide-react';

const TYPE_COLORS = {
  'hospital': '#0F7A4C',
  'clinic': '#2563EB',
  'blood-bank': '#C4302B',
  'ambulance': '#D97706'
};

const TYPE_LABELS = {
  'hospital': 'Hospital & ER',
  'clinic': 'Outpatient Clinic',
  'blood-bank': 'Blood Depot',
  'ambulance': 'EMS Unit'
};

export const HealthcareMap = ({ facilities, height = '560px' }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedFacility, setSelectedFacility] = useState(facilities[0] || null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredFacilities = activeFilter === 'all'
    ? facilities
    : facilities.filter(f => f.type === activeFilter);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [40.7145, -74.0040],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filtered facilities change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredFacilities.forEach(facility => {
      const color = TYPE_COLORS[facility.type] || '#0F7A4C';

      // Custom colored dot marker
      const customIcon = L.divIcon({
        className: 'custom-dot-marker',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: ${color};
            border: 3px solid #FFFFFF;
            box-shadow: 0 2px 5px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            <div style="width: 6px; height: 6px; border-radius: 50%; background-color: #FFFFFF;"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -12]
      });

      const marker = L.marker([facility.lat, facility.lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: inherit; padding: 4px 2px; min-width: 180px;">
          <div style="font-size: 11px; text-transform: uppercase; color: #5C5C5C; font-weight: 600; margin-bottom: 2px;">
            ${TYPE_LABELS[facility.type]}
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #1A1A1A; margin-bottom: 4px;">
            ${facility.name}
          </div>
          <div style="font-size: 12px; color: #5C5C5C; margin-bottom: 6px;">
            ${facility.distance} away
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedFacility(facility);
      });

      markersRef.current.push(marker);
    });
  }, [filteredFacilities]);

  const handleSelectFacility = (fac) => {
    setSelectedFacility(fac);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([fac.lat, fac.lng], 15, { animate: true });
    }
  };

  const getDirectionsUrl = (fac) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`;
  };

  return (
    <div className="space-y-4">
      {/* Category filter bar */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            activeFilter === 'all'
              ? 'bg-[#0F7A4C] text-white border-[#0F7A4C]'
              : 'bg-white text-[#5C5C5C] border-[#E5E5E5] hover:bg-[#F7F7F7]'
          }`}
        >
          All Units ({facilities.length})
        </button>
        <button
          onClick={() => setActiveFilter('hospital')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            activeFilter === 'hospital'
              ? 'bg-[#0F7A4C] text-white border-[#0F7A4C]'
              : 'bg-white text-[#5C5C5C] border-[#E5E5E5] hover:bg-[#F7F7F7]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#0F7A4C]" />
          Hospitals
        </button>
        <button
          onClick={() => setActiveFilter('clinic')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            activeFilter === 'clinic'
              ? 'bg-[#2563EB] text-white border-[#2563EB]'
              : 'bg-white text-[#5C5C5C] border-[#E5E5E5] hover:bg-[#F7F7F7]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
          Clinics
        </button>
        <button
          onClick={() => setActiveFilter('blood-bank')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            activeFilter === 'blood-bank'
              ? 'bg-[#C4302B] text-white border-[#C4302B]'
              : 'bg-white text-[#5C5C5C] border-[#E5E5E5] hover:bg-[#F7F7F7]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#C4302B]" />
          Blood Banks
        </button>
        <button
          onClick={() => setActiveFilter('ambulance')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            activeFilter === 'ambulance'
              ? 'bg-[#D97706] text-white border-[#D97706]'
              : 'bg-white text-[#5C5C5C] border-[#E5E5E5] hover:bg-[#F7F7F7]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#D97706]" />
          Ambulances
        </button>
      </div>

      {/* Main Map + Selected Facility Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leaflet map area */}
        <div className="lg:col-span-2 relative health-card overflow-hidden" style={{ height }}>
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Selected Facility Details Card */}
        <div className="health-card p-5 flex flex-col justify-between" style={{ minHeight: height }}>
          {selectedFacility ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${TYPE_COLORS[selectedFacility.type]}15`,
                      color: TYPE_COLORS[selectedFacility.type]
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: TYPE_COLORS[selectedFacility.type] }}
                    />
                    {TYPE_LABELS[selectedFacility.type]}
                  </span>
                  <span className="text-xs font-medium text-[#5C5C5C]">
                    {selectedFacility.distance}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#1A1A1A] leading-snug">
                  {selectedFacility.name}
                </h3>
                <p className="text-xs text-[#5C5C5C] mt-1">
                  {selectedFacility.address}
                </p>
              </div>

              <div className="border-t border-[#E5E5E5] pt-3 space-y-2.5">
                <div>
                  <span className="text-xs font-medium text-[#5C5C5C] block mb-0.5">
                    Clinical Specialties / Capabilities:
                  </span>
                  <p className="text-xs text-[#1A1A1A] bg-[#F7F7F7] p-2.5 rounded border border-[#E5E5E5] leading-relaxed">
                    {selectedFacility.specialties}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-[#5C5C5C]">
                    <Clock className="w-3.5 h-3.5 text-[#5C5C5C]" />
                    <span>{selectedFacility.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#5C5C5C]">
                    <Phone className="w-3.5 h-3.5 text-[#5C5C5C]" />
                    <span>{selectedFacility.phone}</span>
                  </div>
                </div>
              </div>

              {/* Quick facility selector list */}
              <div className="border-t border-[#E5E5E5] pt-3">
                <span className="text-xs font-medium text-[#5C5C5C] block mb-2">
                  Nearby Registered Units:
                </span>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {filteredFacilities.map(f => (
                    <button
                      key={f.id}
                      onClick={() => handleSelectFacility(f)}
                      className={`w-full text-left p-2 rounded text-xs flex items-center justify-between transition-colors border ${
                        selectedFacility.id === f.id
                          ? 'bg-[#E6F4EC] border-[#0F7A4C] text-[#0F7A4C] font-semibold'
                          : 'bg-white border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F7F7F7]'
                      }`}
                    >
                      <span className="truncate pr-2">{f.name}</span>
                      <span className="text-[11px] text-[#5C5C5C] whitespace-nowrap">{f.distance}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-[#5C5C5C]">
              Select a facility on the map
            </div>
          )}

          {selectedFacility && (
            <div className="pt-4 border-t border-[#E5E5E5] mt-4">
              <a
                href={getDirectionsUrl(selectedFacility)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0F7A4C] hover:bg-[#0c633d] text-white text-xs font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions (Open Maps)</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
