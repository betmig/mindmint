import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, RefreshCw, Volume2, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { audioService } from '../services/AudioService';
import type { BellSound } from '../types';

const BELL_OPTIONS: { value: BellSound; label: string }[] = [
  { value: 'tibetan-bowl', label: 'Tibetan Bowl' },
  { value: 'zen-bell', label: 'Zen Bell' },
  { value: 'meditation-bell', label: 'Meditation Bell' },
  { value: 'temple-bell', label: 'Temple Bell' }
];

export const Timer: React.FC = () => {
  const { settings, timer, updateTimer, updateSettings, startTimer, pauseTimer, resetTimer, tickTimer } = useStore();
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasStartBellPlayed = useRef(false);
  const previousTimeRef = useRef<number | null>(null);
  const isInitialized = useRef(false);

  // Initialize audio when component mounts or bell sound changes
  useEffect(() => {
    let mounted = true;
    
    const initAudio = async () => {
      if (!mounted || isInitialized.current) return;
      
      setError(null);
      setIsLoadingSound(true);
      try {
        await audioService.initialize();
        await audioService.loadSound(settings.bellSound);
        audioService.setVolume(settings.volume);
        isInitialized.current = true;
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        if (mounted) {
          setError('Unable to load audio. Timer will work without sound.');
        }
      } finally {
        if (mounted) {
          setIsLoadingSound(false);
        }
      }
    };

    initAudio();
    
    return () => {
      mounted = false;
      if (isInitialized.current) {
        audioService.stop(settings.bellSound);
      }
    };
  }, [settings.bellSound]);

  // Update volume when it changes
  useEffect(() => {
    if (isInitialized.current) {
      audioService.setVolume(settings.volume);
    }
  }, [settings.volume]);

  // Handle timer ticks and bells
  useEffect(() => {
    let interval: number;
    
    if (timer.isRunning) {
      // Play start bell only once when timer starts
      if (settings.playBellAtStart && !hasStartBellPlayed.current && isInitialized.current) {
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
    if (previousTimeRef.current > 0 && timer.remainingSeconds === 0 && settings.playBellAtEnd && isInitialized.current) {
      audioService.play(settings.bellSound).catch(error => {
        console.error('Failed to play end bell:', error);
      });
    }
    previousTimeRef.current = timer.remainingSeconds;
  }, [timer.remainingSeconds, settings.playBellAtEnd, settings.bellSound]);

  const adjustTime = (field: 'hours' | 'minutes' | 'seconds', increment: boolean) => {
    if (!timer.isRunning) {
      const newValues = {
        hours: timer.hours,
        minutes: timer.minutes,
        seconds: timer.seconds,
      };

      if (field === 'hours') {
        newValues.hours = increment 
          ? (timer.hours >= 23 ? 0 : timer.hours + 1)
          : (timer.hours <= 0 ? 23 : timer.hours - 1);
      } else if (field === 'minutes') {
        newValues.minutes = increment
          ? (timer.minutes >= 59 ? 0 : timer.minutes + 1)
          : (timer.minutes <= 0 ? 59 : timer.minutes - 1);
      } else {
        newValues.seconds = increment
          ? (timer.seconds >= 59 ? 0 : timer.seconds + 1)
          : (timer.seconds <= 0 ? 59 : timer.seconds - 1);
      }

      updateTimer(newValues);
    }
  };

  const formatTimeUnit = (value: number): string => String(value).padStart(2, '0');

  const handleReset = () => {
    resetTimer();
    if (isInitialized.current) {
      audioService.stop(settings.bellSound);
    }
    hasStartBellPlayed.current = false;
    previousTimeRef.current = 0;
    setError(null);
  };

  const handleBellChange = async (sound: BellSound) => {
    if (isPlayingPreview || timer.isRunning) return;

    setError(null);
    setIsLoadingSound(true);
    setIsPlayingPreview(true);

    try {
      // Stop current sound
      if (isInitialized.current) {
        audioService.stop(settings.bellSound);
      }
      
      // Update the store with new sound
      updateSettings({ bellSound: sound });

      // Load and play the new sound
      await audioService.loadSound(sound);
      await audioService.play(sound);
    } catch (error) {
      console.error('Failed to load bell sound:', error);
      setError('Failed to load bell sound. Please try another sound.');
    } finally {
      setIsLoadingSound(false);
      setIsPlayingPreview(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Meditation Timer
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex items-center justify-center space-x-4 text-4xl font-mono text-gray-800 dark:text-gray-200 mb-6">
        <div className="flex flex-col items-center">
          <button
            onClick={() => adjustTime('hours', true)}
            className="p-2 text-xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50"
            disabled={timer.isRunning}
            aria-label="Increase hours"
          >
            ▲
          </button>
          <span>{formatTimeUnit(timer.hours)}</span>
          <button
            onClick={() => adjustTime('hours', false)}
            className="p-2 text-xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50"
            disabled={timer.isRunning}
            aria-label="Decrease hours"
          >
            ▼
          </button>
        </div>
        <span>:</span>
        <div className="flex flex-col items-center">
          <button
            onClick={() => adjustTime('minutes', true)}
            className="p-2 text-xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50"
            disabled={timer.isRunning}
            aria-label="Increase minutes"
          >
            ▲
          </button>
          <span>{formatTimeUnit(timer.minutes)}</span>
          <button
            onClick={() => adjustTime('minutes', false)}
            className="p-2 text-xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50"
            disabled={timer.isRunning}
            aria-label="Decrease minutes"
          >
            ▼
          </button>
        </div>
        <span>:</span>
        <div className="flex flex-col items-center">
          <button
            onClick={() => adjustTime('seconds', true)}
            className="p-2 text-xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50"
            disabled={timer.isRunning}
            aria-label="Increase seconds"
          >
            ▲
          </button>
          <span>{formatTimeUnit(timer.seconds)}</span>
          <button
            onClick={() => adjustTime('seconds', false)}
            className="p-2 text-xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50"
            disabled={timer.isRunning}
            aria-label="Decrease seconds"
          >
            ▼
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={timer.isRunning ? pauseTimer : startTimer}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
          disabled={isLoadingSound || isPlayingPreview}
        >
          {(isLoadingSound || isPlayingPreview) && !timer.isRunning ? (
            <Loader2 size={20} className="animate-spin" />
          ) : timer.isRunning ? (
            <Pause size={20} />
          ) : (
            <Play size={20} />
          )}
          <span>{timer.isRunning ? 'Pause' : 'Start'}</span>
        </button>
        <button
          onClick={handleReset}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          disabled={isLoadingSound || isPlayingPreview}
        >
          <RefreshCw size={20} />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Bell Sound
          </label>
          <select
            value={settings.bellSound}
            onChange={(e) => handleBellChange(e.target.value as BellSound)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
            disabled={isLoadingSound || isPlayingPreview || timer.isRunning}
          >
            {BELL_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.playBellAtStart}
              onChange={(e) => updateSettings({ playBellAtStart: e.target.checked })}
              className="rounded text-primary focus:ring-primary"
              disabled={isLoadingSound || isPlayingPreview}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Play at Start
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.playBellAtEnd}
              onChange={(e) => updateSettings({ playBellAtEnd: e.target.checked })}
              className="rounded text-primary focus:ring-primary"
              disabled={isLoadingSound || isPlayingPreview}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Play at End
            </span>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 size={16} className="text-gray-600 dark:text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.volume}
            onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
            className="flex-1"
            disabled={isLoadingSound || isPlayingPreview}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
            {Math.round(settings.volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};