import React from 'react';

interface RaceCarProps {
  color: string;
  progress: number;
}

const RaceCar: React.FC<RaceCarProps> = ({ color, progress }) => {
  // Position the car based on progress (0-100%)
  const positionX = `${progress}%`;

  return (
    <div
      className="absolute transition-all duration-300 ease-out"
      style={{ left: positionX, transform: 'translateX(-50%)', top: '-4px' }}
    >
      <svg
        width="36"
        height="20"
        viewBox="0 0 36 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Car body */}
        <rect x="6" y="10" width="24" height="7" rx="2" fill={color} />
        <rect x="4" y="12" width="28" height="5" rx="2" fill={color} />

        {/* Car roof */}
        <rect x="12" y="6" width="12" height="4" rx="1" fill={color} />

        {/* Car wheels */}
        <circle cx="9" cy="17" r="3" fill="#1e293b" />
        <circle cx="9" cy="17" r="1.5" fill="#475569" />
        <circle cx="27" cy="17" r="3" fill="#1e293b" />
        <circle cx="27" cy="17" r="1.5" fill="#475569" />

        {/* Car windows */}
        <rect x="13" y="10" width="4" height="2" rx="1" fill="#1e293b" />
        <rect x="19" y="10" width="4" height="2" rx="1" fill="#1e293b" />

        {/* Car lights */}
        <rect x="30" y="13" width="2" height="2" rx="1" fill="#fbbf24" />
        <rect x="4" y="13" width="2" height="2" rx="1" fill="#f43f5e" />
      </svg>
    </div>
  );
};

export default RaceCar;
