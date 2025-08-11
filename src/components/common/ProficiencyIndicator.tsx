import React from 'react';

interface ProficiencyIndicatorProps {
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

const ProficiencyIndicator: React.FC<ProficiencyIndicatorProps> = ({ level }) => {
  const levels = {
    'Beginner': { percentage: 25, color: '#ef4444' },
    'Intermediate': { percentage: 50, color: '#f59e0b' },
    'Advanced': { percentage: 75, color: '#10b981' },
    'Expert': { percentage: 90, color: '#3b82f6' }
  };

  const { percentage, color } = levels[level];

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
            fill="none"
            stroke="rgba(187, 187, 187, 0.2)"
            strokeWidth="2"
          />
          <path
            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray={`${percentage}, 100`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-white">
            {percentage}%
          </span>
        </div>
      </div>
      <span className="text-sm text-[#BBBBBB] font-inter">{level}</span>
    </div>
  );
};

export default ProficiencyIndicator;