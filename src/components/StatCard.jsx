import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, alert = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`health-card p-5 ${onClick ? 'cursor-pointer' : ''} ${
        alert ? 'border-l-4 border-l-[#C4302B]' : 'border-l-4 border-l-[#0F7A4C]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#5C5C5C] mb-1">
            {title}
          </p>
          <div className="text-2xl font-bold text-[#1A1A1A]">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-[#5C5C5C] mt-1.5 flex items-center gap-1.5">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`p-2.5 rounded-lg border ${
            alert
              ? 'bg-[#FDE8E8] border-[#F8B4B4] text-[#C4302B]'
              : 'bg-[#E6F4EC] border-[#C8E6D5] text-[#0F7A4C]'
          }`}
        >
          {Icon && <Icon className="w-5 h-5 stroke-[1.75]" />}
        </div>
      </div>
    </div>
  );
};
