import React from 'react';
import { Check } from 'lucide-react';

export const Stepper = ({ steps, currentStep, isEmergency = false }) => {
  const currentIndex = steps.findIndex(
    s => s.toLowerCase() === (currentStep || '').toLowerCase()
  );

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between relative">
        {/* Background connecting line */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-[#E5E5E5] z-0" />
        {/* Active progress line */}
        {currentIndex > 0 && (
          <div
            className={`absolute left-4 top-1/2 -translate-y-1/2 h-[2px] transition-all duration-300 z-0 ${
              isEmergency && currentStep === 'Arriving' ? 'bg-[#C4302B]' : 'bg-[#0F7A4C]'
            }`}
            style={{
              width: `${(currentIndex / (steps.length - 1)) * 92}%`
            }}
          />
        )}

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex || (idx === currentIndex && currentStep === 'Completed');
          const isCurrent = idx === currentIndex && currentStep !== 'Completed';

          let circleBg = 'bg-white border-[#E5E5E5] text-[#5C5C5C]';
          if (isCompleted) {
            circleBg = 'bg-[#0F7A4C] border-[#0F7A4C] text-white';
          } else if (isCurrent) {
            circleBg = isEmergency && step === 'Arriving'
              ? 'bg-[#C4302B] border-[#C4302B] text-white ring-4 ring-[#FDE8E8]'
              : 'bg-[#0F7A4C] border-[#0F7A4C] text-white ring-4 ring-[#E6F4EC]';
          }

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-200 ${circleBg}`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-xs mt-1.5 text-center font-medium max-w-[80px] leading-tight ${
                  isCurrent
                    ? 'text-[#1A1A1A] font-semibold'
                    : isCompleted
                    ? 'text-[#0F7A4C]'
                    : 'text-[#5C5C5C]'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
