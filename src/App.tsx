import React, { useState, useEffect, useRef } from "react";
import TypingArea from "./components/TypingArea";
import RaceTrack from "./components/RaceTrack";
import StatsDisplay from "./components/StatsDisplay";
import sampleTexts from "./data/sampleTexts";

const App: React.FC = () => {
  const [text, setText] = useState("");
  const [isRacing, setIsRacing] = useState(false);
  const [hasRaceEnded, setHasRaceEnded] = useState(false);
  const [userProgress, setUserProgress] = useState(0);
  const [aiProgress, setAiProgress] = useState([0, 0, 0]);
  const [userPosition, setUserPosition] = useState(0);
  const [typingStats, setTypingStats] = useState({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    time: 0,
  });

  // Refs to store the AI interval IDs
  const aiIntervalsRef = useRef<number[]>([]);
  const checkRaceStatusRef = useRef<number | null>(null);

  // Select a random text when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setText(sampleTexts[randomIndex]);

    // Cleanup intervals on unmount
    return () => {
      cleanupIntervals();
    };
  }, []);

  // Helper to clean up intervals
  const cleanupIntervals = () => {
    aiIntervalsRef.current.forEach((id) => window.clearInterval(id));
    aiIntervalsRef.current = [];

    if (checkRaceStatusRef.current) {
      window.clearInterval(checkRaceStatusRef.current);
      checkRaceStatusRef.current = null;
    }
  };

  // Reset the game state
  const resetGame = () => {
    cleanupIntervals();

    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setText(sampleTexts[randomIndex]);
    setIsRacing(false);
    setHasRaceEnded(false);
    setUserProgress(0);
    setAiProgress([0, 0, 0]);
    setUserPosition(0);
    setTypingStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      time: 0,
    });
  };

  // Start the race with AI racers
  const startRace = () => {
    setIsRacing(true);
    setHasRaceEnded(false);
    simulateAiRacers();
  };

  // End the race
  const endRace = (stats: typeof typingStats) => {
    setIsRacing(false);
    setHasRaceEnded(true);
    setTypingStats(stats);
    cleanupIntervals();
  };

  // Update user progress
  const updateProgress = (progress: number) => {
    setUserProgress(progress);
    updateUserPosition(progress);

    // End race if user reaches 100%
    if (progress >= 100) {
      setUserProgress(100);
    }
  };

  // Simulate AI racers with different speeds
  const simulateAiRacers = () => {
    // Clear previous intervals if they exist
    cleanupIntervals();

    // Create new intervals
    const intervals = [
      window.setInterval(() => updateAiProgress(0, 0.6 + Math.random() * 0.4), 100),
      window.setInterval(() => updateAiProgress(1, 0.4 + Math.random() * 0.4), 100),
      window.setInterval(() => updateAiProgress(2, 0.2 + Math.random() * 0.4), 100),
    ];

    aiIntervalsRef.current = intervals;

    // Check race status
    checkRaceStatusRef.current = window.setInterval(() => {
      if (!isRacing || hasRaceEnded) {
        cleanupIntervals();
      }
    }, 500);
  };

  // Update AI racer progress
  const updateAiProgress = (index: number, increment: number) => {
    setAiProgress((prevProgress) => {
      const newProgress = [...prevProgress];
      if (newProgress[index] < 100) {
        newProgress[index] = Math.min(100, newProgress[index] + increment);
        updateUserPosition(userProgress, newProgress);
      }
      return newProgress;
    });
  };

  // Update user position in the race
  const updateUserPosition = (userProgress: number, currentAiProgress = aiProgress) => {
    const allProgress = [userProgress, ...currentAiProgress];
    const sortedProgress = [...allProgress].sort((a, b) => b - a);
    const position = sortedProgress.indexOf(userProgress);
    setUserPosition(position);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 py-10">
      <div className="container mx-auto space-y-8 px-4 py-6">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-wide text-slate-100">Corrida Digitada</h1>
          <p className="text-sm text-slate-400">
            Teste sua velocidade de digitação contra pilotos de IA
          </p>
        </header>

        <RaceTrack
          userProgress={userProgress}
          aiProgress={aiProgress}
          userPosition={userPosition}
          hasRaceEnded={hasRaceEnded}
        />

        <TypingArea
          text={text}
          isRacing={isRacing}
          hasRaceEnded={hasRaceEnded}
          onStart={startRace}
          onEnd={endRace}
          onProgressUpdate={updateProgress}
          onReset={resetGame}
        />

        {hasRaceEnded && <StatsDisplay stats={typingStats} position={userPosition + 1} />}
      </div>
    </div>
  );
};

export default App;
