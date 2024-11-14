import debounce from 'lodash/debounce';
import type { Settings } from '../types';

const DEBOUNCE_DELAY = 16; // Approximately 1 frame at 60fps

const applyTheme = (theme: 'light' | 'dark') => {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
};

const applyFilters = debounce((settings: Settings) => {
  requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--brightness', `${settings.brightness}%`);
    document.documentElement.style.setProperty('--contrast', `${settings.contrast}%`);
    document.documentElement.style.setProperty('--sepia', `${settings.sepia}%`);
    document.documentElement.style.setProperty('--grayscale', `${settings.greyscale}%`);
  });
}, DEBOUNCE_DELAY);

export const updateDisplaySettings = (settings: Settings) => {
  applyTheme(settings.theme);
  applyFilters(settings);
};