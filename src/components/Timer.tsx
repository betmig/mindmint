import React, { useEffect } from 'react';
import { Bell, Play, Pause, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Timer: React.FC = () => {
  const { settings, timer, updateTimer, startTimer, pauseTimer, resetTimer, tickTimer } = useStore();

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

  const formatTimeUnit = (value: number): string => String(value).padStart(2, '0');

  const adjustTime = (index: number, increment: boolean) => {
    if (!timer.isRunning) {
      const newUnits = {
        hours: timer.hours,
        minutes: timer.minutes,
        seconds: timer.seconds,
      };

      if (index === 0) {
        newUnits.hours = increment 
          ? (timer.hours >= 23 ? 0 : timer.hours + 1)
          : (timer.hours <= 0 ? 23 : timer.hours - 1);
      } else if (index === 1) {
        newUnits.minutes = increment
          ? (timer.minutes >= 59 ? 0 : timer.minutes + 1)
          : (timer.minutes <= 0 ? 59 : timer.minutes - 1);
      } else {
        newUnits.seconds = increment
          ? (timer.seconds >= 59 ? 0 : timer.seconds + 1)
          : (timer.seconds <= 0 ? 59 : timer.seconds - 1);
      }

      updateTimer(newUnits);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center text-6xl font-mono text-gray-800 dark:text-gray-200">
        <div className="flex flex-col items-center">
          <button
            onClick={() => adjustTime(0, true)}
            className="p-2 text-2xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50 transition-colors"
            disabled={timer.isRunning}
            aria-label="Increase hours"
          >
            ▲
          </button>
          <span>{formatTimeUnit(timer.hours)}</span>
          <button
            onClick={() => adjustTime(0, false)}
            className="p-2 text-2xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50 transition-colors"
            disabled={timer.isRunning}
            aria-label="Decrease hours"
          >
            ▼
          </button>
        </div>
        <span className="mx-2">:</span>
        <div className="flex flex-col items-center">
          <button
            onClick={() => adjustTime(1, true)}
            className="p-2 text-2xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50 transition-colors"
            disabled={timer.isRunning}
            aria-label="Increase minutes"
          >
            ▲
          </button>
          <span>{formatTimeUnit(timer.minutes)}</span>
          <button
            onClick={() => adjustTime(1, false)}
            className="p-2 text-2xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50 transition-colors"
            disabled={timer.isRunning}
            aria-label="Decrease minutes"
          >
            ▼
          </button>
        </div>
        <span className="mx-2">:</span>
        <div className="flex flex-col items-center">
          <button
            onClick={() => adjustTime(2, true)}
            className="p-2 text-2xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50 transition-colors"
            disabled={timer.isRunning}
            aria-label="Increase seconds"
          >
            ▲
          </button>
          <span>{formatTimeUnit(timer.seconds)}</span>
          <button
            onClick={() => adjustTime(2, false)}
            className="p-2 text-2xl text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50 transition-colors"
            disabled={timer.isRunning}
            aria-label="Decrease seconds"
          >
            ▼
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={timer.isRunning ? pauseTimer : startTimer}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          aria-label={timer.isRunning ? 'Pause meditation timer' : 'Start meditation timer'}
        >
          {timer.isRunning ? <Pause size={20} /> : <Play size={20} />}
          <span>{timer.isRunning ? 'Pause' : 'Start'}</span>
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Reset timer"
        >
          <RefreshCw size={20} />
          <span>Reset</span>
        </button>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between space-x-4">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Bell Sound
          </label>
          <select
            value={settings.bellSound}
            onChange={(e) => updateTimer({ bellSound: e.target.value })}
            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          >
            <option value="tibetan-bowl">Tibetan Bowl</option>
            <option value="zen-bell">Zen Bell</option>
            <option value="meditation-bell">Meditation Bell</option>
            <option value="temple-bell">Temple Bell</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.playBellAtStart}
              onChange={(e) => updateTimer({ playBellAtStart: e.target.checked })}
              className="rounded text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Play at Start
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.playBellAtEnd}
              onChange={(e) => updateTimer({ playBellAtEnd: e.target.checked })}
              className="rounded text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Play at End
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};