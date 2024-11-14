import React, { useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';

interface TimerWidgetProps {
  readingComplete: boolean;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ readingComplete }) => {
  const { settings, timer, isReading, updateTimer, tickTimer, resetTimer } = useStore();

  useEffect(() => {
    let interval: number;
    
    if (timer.isRunning) {
      interval = window.setInterval(tickTimer, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer.isRunning, tickTimer]);

  useEffect(() => {
    if (settings.autoStartTimerAfterSutta && readingComplete && !isReading) {
      updateTimer({ isRunning: true });
    }
  }, [readingComplete, isReading, settings.autoStartTimerAfterSutta, updateTimer]);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const canStartTimer = !settings.readSuttaBeforeMeditation || readingComplete;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Meditation Timer
      </h3>
      <div className="text-2xl font-mono text-gray-800 dark:text-gray-200 mb-3">
        {formatTime(timer.remainingSeconds)}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateTimer({ isRunning: !timer.isRunning })}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canStartTimer}
          aria-label={timer.isRunning ? 'Pause meditation timer' : 'Start meditation timer'}
        >
          {timer.isRunning ? <Pause size={16} /> : <Play size={16} />}
          <span>{timer.isRunning ? 'Pause' : 'Start'}</span>
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Reset timer"
        >
          <RefreshCw size={16} />
          <span>Reset</span>
        </button>
      </div>
      {settings.readSuttaBeforeMeditation && !readingComplete && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Timer will start after reading completes
        </p>
      )}
    </div>
  );
};