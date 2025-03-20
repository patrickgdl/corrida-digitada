import React from "react";

interface StatsDisplayProps {
  stats: {
    wpm: number;
    accuracy: number;
    errors: number;
    time: number;
  };
  position: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, position }) => {
  // Get position text
  const getPositionText = (pos: number) => {
    switch (pos) {
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd";
      default:
        return `${pos}th`;
    }
  };

  // Get position class for coloring
  const getPositionClass = (pos: number) => {
    switch (pos) {
      case 1:
        return "text-amber-400";
      case 2:
        return "text-slate-300";
      case 3:
        return "text-amber-700";
      default:
        return "text-slate-400";
    }
  };

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="stats-container">
      <h2 className="mb-6 text-center text-lg font-bold">Race Results</h2>
      <div className="grid grid-cols-2 gap-6 text-center">
        <div className="rounded-lg bg-slate-800/40 p-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Posição</p>
          <p className={`text-2xl font-bold ${getPositionClass(position)}`}>
            {getPositionText(position)}
          </p>
        </div>
        <div className="rounded-lg bg-slate-800/40 p-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Tempo</p>
          <p className="text-2xl font-bold text-slate-100">{formatTime(stats.time)}</p>
        </div>
        <div className="rounded-lg bg-slate-800/40 p-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">PPM</p>
          <p className="text-2xl font-bold text-blue-400">{stats.wpm}</p>
        </div>
        <div className="rounded-lg bg-slate-800/40 p-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Precisão</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.accuracy}%</p>
        </div>
      </div>
      {position === 1 && (
        <div className="notification notification-success mt-6">
          Parabéns! Você ganhou a corrida!
        </div>
      )}
    </div>
  );
};

export default StatsDisplay;
