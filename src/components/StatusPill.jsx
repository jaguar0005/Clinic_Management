import React from 'react';

const STATUS_CONFIG = {
  // Appointments
  'Requested': { dot: 'bg-amber-500', text: 'text-[#1A1A1A]', bg: 'bg-[#F7F7F7]', border: 'border-[#E5E5E5]' },
  'Confirmed': { dot: 'bg-[#0F7A4C]', text: 'text-[#0F7A4C]', bg: 'bg-[#E6F4EC]', border: 'border-[#C8E6D5]' },
  'Checked-In': { dot: 'bg-blue-600', text: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' },
  'Completed': { dot: 'bg-[#5C5C5C]', text: 'text-[#5C5C5C]', bg: 'bg-[#F7F7F7]', border: 'border-[#E5E5E5]' },
  'Cancelled': { dot: 'bg-[#C4302B]', text: 'text-[#C4302B]', bg: 'bg-[#FDE8E8]', border: 'border-[#F8B4B4]' },

  // Blood Requests
  'Submitted': { dot: 'bg-amber-500', text: 'text-[#1A1A1A]', bg: 'bg-[#F7F7F7]', border: 'border-[#E5E5E5]' },
  'Doctor Verified': { dot: 'bg-blue-600', text: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' },
  'Searching': { dot: 'bg-amber-600', text: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' },
  'Availability Found': { dot: 'bg-[#0F7A4C]', text: 'text-[#0F7A4C]', bg: 'bg-[#E6F4EC]', border: 'border-[#C8E6D5]' },
  'Correction Requested': { dot: 'bg-[#C4302B]', text: 'text-[#C4302B]', bg: 'bg-[#FDE8E8]', border: 'border-[#F8B4B4]' },

  // Ambulance Requests
  'Assigned': { dot: 'bg-blue-600', text: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' },
  'Dispatched': { dot: 'bg-[#0F7A4C]', text: 'text-[#0F7A4C]', bg: 'bg-[#E6F4EC]', border: 'border-[#C8E6D5]' },
  'Arriving': { dot: 'bg-[#C4302B]', text: 'text-[#C4302B]', bg: 'bg-[#FDE8E8]', border: 'border-[#F8B4B4]' }
};

export const StatusPill = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || {
    dot: 'bg-neutral-400',
    text: 'text-[#1A1A1A]',
    bg: 'bg-[#F7F7F7]',
    border: 'border-[#E5E5E5]'
  };

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-0.5 text-xs'
    : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.border} ${config.text} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{status}</span>
    </span>
  );
};
