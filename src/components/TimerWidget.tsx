import React, { useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { audioService } from '../services/AudioService';

interface TimerWidgetProps {
  readingComplete: boolean;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ readingComplete }) => {
  const { settings, timer, isReading, updateTimer, tickTimer, resetTimer } = useStore();
  const hasStartBellPlayed = useRef(false);
  const previousTimeRef = useRef<number | null>(null);
  const autoStartTriggered = useRef(false);

  useEffect(() => {
    let interval: number;
    
    if (timer.isRunning) {
      // Play start bell when timer starts
      if (settings.playBellAtStart && !hasStartBellPlayed.current) {
        audioService.play(settings.bellSound).catch(error => {
          console.error('Failed to play start bell:', error);
        });
        hasStartBellPlayed.current = true;
      }
      
      interval = window.setInterval(tickTimer, 1000);
    } else {
      // Reset the start bell flag when timer is stopped or paused
      hasStartBellPlayed.current = false;
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer.isRunning, tickTimer, settings.playBellAtStart, settings.bellSound]);

  // Handle end bell
  useEffect(() => {
    // Initialize previousTimeRef on first render
    if (previousTimeRef.current === null) {
      previousTimeRef.current = timer.remainingSeconds;
      return;
    }

    // Play end bell when timer reaches zero from a non-zero state
    if (previousTimeRef.current > 0 && timer.remainingSeconds === 0 && settings.playBellAtEnd) {
      audioService.play(settings.bellSound).catch(error => {
        console.error('Failed to play end bell:', error);
      });
    }
    previousTimeRef.current = timer.remainingSeconds;
  }, [timer.remainingSeconds, settings.playBellAtEnd, settings.bellSound]);

  // Handle auto-start after sutta reading
  useEffect(() => {
    if (settings.autoStartTimerAfterSutta && readingComplete && !isReading && !autoStartTriggered.current) {
      // Add a delay before starting the timer
      const startTimer = async () => {
        autoStartTriggered.current = true;
        hasStartBellPlayed.current = false;
        
        // Wait a moment for any TTS to fully complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Start the timer
        updateTimer({ isRunning: true });
      };
      
      startTimer();
    }
  }, [readingComplete, isReading, settings.autoStartTimerAfterSutta, updateTimer]);

  // Reset auto-start trigger when reading starts again
  useEffect(() => {
    if (isReading) {
      autoStartTriggered.current = false;
    }
  }, [isReading]);

  const handleStartPause = () => {
    if (!timer.isRunning) {
      // Reset the bell flag when manually starting the timer
      hasStartBellPlayed.current = false;
    }
    updateTimer({ isRunning: !timer.isRunning });
  };

  const handleReset = () => {
    resetTimer();
    hasStartBellPlayed.current = false;
    previousTimeRef.current = 0;
    autoStartTriggered.current = false;
    audioService.stop(settings.bellSound);
  };

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
          onClick={handleStartPause}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canStartTimer}
          aria-label={timer.isRunning ? 'Pause meditation timer' : 'Start meditation timer'}
        >
          {timer.isRunning ? <Pause size={16} /> : <Play size={16} />}
          <span>{timer.isRunning ? 'Pause' : 'Start'}</span>
        </button>
        <button
          onClick={handleReset}
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