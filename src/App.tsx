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

  // Ref for race start time
  const raceStartTimeRef = useRef<number | null>(null);

  // AI typing speeds (characters per second)
  const aiSpeeds = useRef([
    6 + Math.random() * 2, // ~70-90 WPM
    5 + Math.random() * 2, // ~60-80 WPM
    4 + Math.random() * 2, // ~50-70 WPM
  ]);

  // Select a random text when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setText(sampleTexts[randomIndex]);
  }, []);

  // Handle AI movement
  useEffect(() => {
    let intervalId: number;

    if (isRacing && !hasRaceEnded) {
      // Set initial race time if not set
      if (!raceStartTimeRef.current) {
        raceStartTimeRef.current = Date.now();
      }

      intervalId = window.setInterval(() => {
        const elapsedSeconds = (Date.now() - raceStartTimeRef.current!) / 1000;

        setAiProgress((prevProgress) => {
          const newProgress = aiSpeeds.current.map((speed, index) => {
            // Calculate characters typed based on speed and time
            const charsTyped = speed * elapsedSeconds;
            const progress = Math.min(100, Math.round((charsTyped / text.length) * 100));

            // Add small random variation (-0.5 to +0.5)
            const variation = Math.random() - 0.5;

            // Ensure progress never decreases and stays within bounds
            return Math.min(100, Math.max(prevProgress[index], progress + variation));
          });

          // Check if any AI has finished
          if (newProgress.some((p) => p >= 100)) {
            setHasRaceEnded(true);
          }

          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isRacing, hasRaceEnded, text.length]);

  // Update positions whenever progress changes
  useEffect(() => {
    updateUserPosition(userProgress, aiProgress);
  }, [userProgress, aiProgress]);

  // Reset the game state
  const resetGame = () => {
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
    raceStartTimeRef.current = null;

    // Generate new random speeds for AI racers
    aiSpeeds.current = [
      6 + Math.random() * 2, // ~70-90 WPM
      5 + Math.random() * 2, // ~60-80 WPM
      4 + Math.random() * 2, // ~50-70 WPM
    ];
  };

  // Start the race
  const startRace = () => {
    setIsRacing(true);
    setHasRaceEnded(false);
    raceStartTimeRef.current = Date.now();
  };

  // End the race
  const endRace = (stats: typeof typingStats) => {
    setIsRacing(false);
    setHasRaceEnded(true);
    setTypingStats(stats);
  };

  // Update user progress
  const updateProgress = (progress: number) => {
    setUserProgress(progress);

    // End race if user reaches 100%
    if (progress >= 100) {
      setUserProgress(100);
      setHasRaceEnded(true);
    }
  };

  // Update user position in the race
  const updateUserPosition = (userProgress: number, currentAiProgress: number[]) => {
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
