import React, { useState, useRef, useEffect } from "react";

interface TypingAreaProps {
  text: string;
  isRacing: boolean;
  hasRaceEnded: boolean;
  onStart: () => void;
  onEnd: (stats: { wpm: number; accuracy: number; errors: number; time: number }) => void;
  onProgressUpdate: (progress: number) => void;
  onReset: () => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({
  text,
  isRacing,
  hasRaceEnded,
  onStart,
  onEnd,
  onProgressUpdate,
  onReset,
}) => {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [errors, setErrors] = useState(0);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "warning";
  } | null>(null);
  const [currentWpm, setCurrentWpm] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when race starts
  useEffect(() => {
    if (isRacing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRacing]);

  // Start timer when race begins
  useEffect(() => {
    if (isRacing && !startTime) {
      setStartTime(Date.now());
    }
  }, [isRacing, startTime]);

  // Update timer during race
  useEffect(() => {
    let timerId: number;

    if (isRacing && startTime) {
      timerId = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setCurrentTime(elapsed);
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRacing, startTime]);

  // Update WPM during race - separate from the timer to avoid dependency loops
  useEffect(() => {
    if (isRacing && startTime && input.length > 0) {
      const timeInMinutes = (Date.now() - startTime) / 60000;
      if (timeInMinutes > 0) {
        const wordsTyped = input.trim().split(/\s+/).length;
        setCurrentWpm(Math.round(wordsTyped / timeInMinutes));
      }
    }
  }, [isRacing, startTime, input, currentTime]); // Only recalculate when currentTime changes (every second)

  // Calculate and update typing statistics when race ends
  useEffect(() => {
    if (hasRaceEnded && startTime) {
      const timeInMinutes = (Date.now() - startTime) / 60000;
      const wordsTyped = input.trim().split(/\s+/).length;
      const wpm = Math.round(wordsTyped / timeInMinutes);
      const accuracy = Math.max(0, Math.round(100 - (errors / text.length) * 100));

      onEnd({
        wpm,
        accuracy,
        errors,
        time: currentTime,
      });
    }
  }, [hasRaceEnded, startTime, input, errors, text.length, onEnd, currentTime]);

  // Handle input changes during typing
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isRacing) return;

    const newInput = e.target.value;
    setInput(newInput);

    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < newInput.length; i++) {
      if (i >= text.length || newInput[i] !== text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    // Update progress
    const progress = Math.min(100, Math.round((newInput.length / text.length) * 100));
    onProgressUpdate(progress);

    // Check if user has completed the text
    if (newInput.length >= text.length) {
      const finalWpm = calculateWPM();
      const finalAccuracy = calculateAccuracy();

      onEnd({
        wpm: finalWpm,
        accuracy: finalAccuracy,
        errors,
        time: currentTime,
      });

      setNotification({
        message: "Corrida finalizada! Bom trabalho!",
        type: "success",
      });

      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Calculate WPM (Words Per Minute)
  const calculateWPM = () => {
    if (!startTime) return 0;
    const timeInMinutes = (Date.now() - startTime) / 60000;
    if (timeInMinutes <= 0) return 0;

    const wordsTyped = input.trim().split(/\s+/).length;
    return Math.round(wordsTyped / timeInMinutes);
  };

  // Calculate typing accuracy
  const calculateAccuracy = () => {
    if (input.length === 0) return 100;
    return Math.max(0, Math.round(100 - (errors / Math.max(1, input.length)) * 100));
  };

  // Handle start button click
  const handleStart = () => {
    setInput("");
    setStartTime(null);
    setCurrentTime(0);
    setErrors(0);
    setCurrentWpm(0);
    setNotification(null);
    onStart();
  };

  // Handle reset button click
  const handleReset = () => {
    setInput("");
    setStartTime(null);
    setCurrentTime(0);
    setErrors(0);
    setCurrentWpm(0);
    setNotification(null);
    onReset();
  };

  // Render character spans with appropriate styles
  const renderText = () => {
    return text.split("").map((char, index) => {
      let className = "char char-ahead";

      if (index < input.length) {
        className = input[index] === char ? "char char-correct" : "char char-incorrect";
      } else if (index === input.length) {
        className = "char char-current";
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="typing-container space-y-4">
      <div className="mb-4 rounded bg-slate-800/60 p-4 font-mono text-sm leading-relaxed text-slate-300">
        {renderText()}
      </div>

      <div className="space-y-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm text-slate-300">
            <span className="font-semibold text-blue-400">PPM:</span>{" "}
            {isRacing || hasRaceEnded ? currentWpm : 0}
          </div>
          <div className="text-sm text-slate-300">
            <span className="font-semibold text-emerald-400">Precisão:</span>{" "}
            {isRacing || hasRaceEnded ? calculateAccuracy() : 100}%
          </div>
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          disabled={!isRacing || hasRaceEnded}
          placeholder={isRacing ? "Comece a digitar..." : "Clique 'Começar corrida' para iniciar"}
          className="input-field min-h-24 resize-none"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          rows={3}
        />

        <div className="flex justify-center gap-1.5">
          {!isRacing && !hasRaceEnded && (
            <button onClick={handleStart} className="btn btn-primary">
              Começar corrida
            </button>
          )}

          {(isRacing || hasRaceEnded) && (
            <button onClick={handleReset} className="btn btn-danger">
              Reiniciar
            </button>
          )}
        </div>

        {notification && (
          <div className={`notification notification-${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingArea;
