import React from 'react';
import RaceCar from './RaceCar';

interface RaceTrackProps {
  userProgress: number;
  aiProgress: number[];
  userPosition: number;
  hasRaceEnded: boolean;
}

const RaceTrack: React.FC<RaceTrackProps> = ({
  userProgress,
  aiProgress,
  userPosition,
  hasRaceEnded,
}) => {
  // Participant name and color mapping
  const participants = [
    { name: 'You', color: '#3b82f6' }, // blue-500
    { name: 'AI Racer 1', color: '#10b981' }, // emerald-500
    { name: 'AI Racer 2', color: '#f59e0b' }, // amber-500
    { name: 'AI Racer 3', color: '#f43f5e' }, // rose-500
  ];

  // Get position text based on user's position
  const getPositionText = (position: number) => {
    switch (position) {
      case 0:
        return '1st';
      case 1:
        return '2nd';
      case 2:
        return '3rd';
      case 3:
        return '4th';
      default:
        return `${position + 1}th`;
    }
  };

  return (
    <div className="track-container p-4 space-y-6">
      {/* User Track */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="h-5 w-4 rounded-sm ml-[-2px]" style={{ backgroundColor: participants[0].color }}></div>
          <div className="text-slate-300 text-sm">
            You {hasRaceEnded ? `(${getPositionText(userPosition)})` : ''}
          </div>
          {!hasRaceEnded && (
            <div className="text-xs font-mono text-slate-400 ml-auto">
              {userProgress}%
            </div>
          )}
        </div>
        <div className="race-track">
          <RaceCar color={participants[0].color} progress={userProgress} />
        </div>
      </div>

      {/* AI Tracks */}
      {aiProgress.map((progress, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <div
              className="h-5 w-4 rounded-sm ml-[-2px]"
              style={{ backgroundColor: participants[index + 1].color }}
            ></div>
            <div className="text-slate-300 text-sm">
              {participants[index + 1].name}
            </div>
            {!hasRaceEnded && (
              <div className="text-xs font-mono text-slate-400 ml-auto">
                {progress}%
              </div>
            )}
          </div>
          <div className="race-track">
            <RaceCar color={participants[index + 1].color} progress={progress} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RaceTrack;
