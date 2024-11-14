import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Timer as TimerIcon, Settings2, Info, Sprout } from 'lucide-react';
import { SuttaReader } from './components/SuttaReader';
import { Timer } from './components/Timer';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { useStore } from './store/useStore';

function App() {
  const { initializeSpeech, settings } = useStore();

  useEffect(() => {
    // Initialize speech
    initializeSpeech();
    
    // Apply initial theme
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(settings.theme);
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
          <nav className="bg-white dark:bg-gray-800 shadow-lg" role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 text-primary hover:text-primary-hover transition-colors mr-8"
                    aria-label="Mind Mint Home"
                  >
                    <Sprout size={24} aria-hidden="true" />
                    <span className="text-lg font-semibold">Mind Mint</span>
                  </Link>
                  <div className="flex space-x-8">
                    <Link
                      to="/timer"
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                      aria-label="Meditation Timer"
                    >
                      <TimerIcon size={20} aria-hidden="true" />
                      <span>Timer</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                      aria-label="Settings"
                    >
                      <Settings2 size={20} aria-hidden="true" />
                      <span>Settings</span>
                    </Link>
                    <Link
                      to="/about"
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                      aria-label="About"
                    >
                      <Info size={20} aria-hidden="true" />
                      <span>About</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" role="main">
            <Routes>
              <Route path="/" element={<SuttaReader />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;