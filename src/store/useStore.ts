import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Speech from 'speak-tts';
import { fetchElevenLabsVoices, synthesizeElevenLabsSpeech } from '../utils/elevenLabs';
import { updateDisplaySettings } from '../utils/displaySettings';
import type { Settings, Timer, TTSProvider, ElevenLabsVoice, BellSound } from '../types';

interface State {
  settings: Settings;
  timer: Timer;
  speech: Speech | null;
  isReading: boolean;
  availableVoices: SpeechSynthesisVoice[];
  currentSuttaId: number | null;
  setCurrentSuttaId: (id: number | null) => void;
  setIsReading: (isReading: boolean) => void;
  initializeSpeech: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => void;
  updateTimer: (timer: Partial<Timer>) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  resetAccessibilitySettings: () => void;
  updateTTSProvider: (provider: Partial<TTSProvider>) => void;
  fetchElevenLabsVoices: () => Promise<void>;
  speak: (text: string) => Promise<void>;
}

const defaultSettings: Settings = {
  theme: 'light',
  brightness: 100,
  contrast: 100,
  sepia: 0,
  greyscale: 0,
  volume: 1,
  selectedVoice: '',
  highlightColor: '#34D399',
  highlightOpacity: 0.3,
  readSuttaBeforeMeditation: false,
  autoStartTimerAfterSutta: false,
  ttsProvider: {
    name: 'browser',
    enabled: true
  },
  bellSound: 'tibetan-bowl',
  playBellAtStart: true,
  playBellAtEnd: true,
  elevenLabsVoices: []
};

const defaultTimer: Timer = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  remainingSeconds: 0,
  isRunning: false
};

let speechInstance: Speech | null = null;
let initializationPromise: Promise<void> | null = null;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      timer: defaultTimer,
      speech: null,
      isReading: false,
      availableVoices: [],
      currentSuttaId: null,

      setCurrentSuttaId: (id) => set({ currentSuttaId: id }),

      setIsReading: (isReading) => set({ isReading }),

      initializeSpeech: async () => {
        // Return existing initialization promise if it exists
        if (initializationPromise) {
          return initializationPromise;
        }

        initializationPromise = (async () => {
          try {
            if (!speechInstance) {
              speechInstance = new Speech();
              
              if (!speechInstance.hasBrowserSupport()) {
                console.warn('Browser does not support speech synthesis');
                return;
              }

              await speechInstance.init({
                volume: get().settings.volume,
                lang: 'en-US',
                splitSentences: false,
                listeners: {
                  onvoiceschanged: (voices) => {
                    if (voices && Array.isArray(voices)) {
                      set({ availableVoices: voices });
                    }
                  }
                }
              });

              // Wait for voices to be loaded
              const voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
                const checkVoices = () => {
                  const availableVoices = window.speechSynthesis.getVoices();
                  if (availableVoices.length > 0) {
                    resolve(availableVoices);
                  } else {
                    setTimeout(checkVoices, 100);
                  }
                };
                checkVoices();
              });

              // Set the selected voice if available
              const selectedVoice = get().settings.selectedVoice;
              if (selectedVoice) {
                const voice = voices.find(v => v.name === selectedVoice);
                if (voice) {
                  await speechInstance.setVoice(voice.name);
                }
              }
            }

            set({ speech: speechInstance });
          } catch (error) {
            console.error('Speech initialization error:', error);
            // Don't throw the error, just log it
            // This prevents the app from breaking if speech synthesis isn't available
          }
        })();

        return initializationPromise;
      },

      updateSettings: (newSettings) => {
        set((state) => {
          const updatedSettings = { ...state.settings, ...newSettings };
          updateDisplaySettings(updatedSettings);
          
          // Update speech settings if needed
          if (state.speech && (
            newSettings.volume !== undefined ||
            newSettings.selectedVoice !== undefined
          )) {
            if (newSettings.volume !== undefined) {
              state.speech.setVolume(newSettings.volume);
            }
            if (newSettings.selectedVoice !== undefined) {
              state.speech.setVoice(newSettings.selectedVoice);
            }
          }
          
          return { settings: updatedSettings };
        });
      },

      updateTimer: (newTimer) => {
        set((state) => {
          const updatedTimer = { ...state.timer, ...newTimer };
          
          // Recalculate remaining seconds if time units are updated
          if (newTimer.hours !== undefined || newTimer.minutes !== undefined || newTimer.seconds !== undefined) {
            updatedTimer.remainingSeconds = 
              (updatedTimer.hours * 3600) + 
              (updatedTimer.minutes * 60) + 
              updatedTimer.seconds;
          }
          
          return { timer: updatedTimer };
        });
      },

      startTimer: () => set((state) => ({ 
        timer: { ...state.timer, isRunning: true } 
      })),

      pauseTimer: () => set((state) => ({ 
        timer: { ...state.timer, isRunning: false } 
      })),

      resetTimer: () => set({ timer: defaultTimer }),

      tickTimer: () => set((state) => {
        if (state.timer.remainingSeconds <= 0) {
          return { 
            timer: { ...state.timer, isRunning: false } 
          };
        }

        const remainingSeconds = state.timer.remainingSeconds - 1;
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        return {
          timer: {
            ...state.timer,
            hours,
            minutes,
            seconds,
            remainingSeconds
          }
        };
      }),

      resetAccessibilitySettings: () => {
        const { theme, ...rest } = defaultSettings;
        set((state) => ({
          settings: {
            ...state.settings,
            brightness: rest.brightness,
            contrast: rest.contrast,
            sepia: rest.sepia,
            greyscale: rest.greyscale
          }
        }));
      },

      updateTTSProvider: (provider) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ttsProvider: {
              ...state.settings.ttsProvider,
              ...provider
            }
          }
        }));
      },

      fetchElevenLabsVoices: async () => {
        const { settings } = get();
        if (settings.ttsProvider.apiKey) {
          try {
            const voices = await fetchElevenLabsVoices(settings.ttsProvider.apiKey);
            set((state) => ({
              settings: {
                ...state.settings,
                elevenLabsVoices: voices
              }
            }));
          } catch (error) {
            console.error('Failed to fetch Eleven Labs voices:', error);
            throw error;
          }
        }
      },

      speak: async (text: string) => {
        const { settings, speech } = get();
        
        if (settings.ttsProvider.name === 'elevenlabs' && 
            settings.ttsProvider.apiKey && 
            settings.ttsProvider.selectedVoiceId) {
          try {
            const audioData = await synthesizeElevenLabsSpeech(
              text,
              settings.ttsProvider.selectedVoiceId,
              settings.ttsProvider.apiKey
            );
            
            return new Promise((resolve, reject) => {
              const blob = new Blob([audioData], { type: 'audio/mpeg' });
              const url = URL.createObjectURL(blob);
              const audio = new Audio(url);
              audio.volume = settings.volume;
              
              audio.onended = () => {
                URL.revokeObjectURL(url);
                resolve();
              };
              
              audio.onerror = (error) => {
                URL.revokeObjectURL(url);
                reject(error);
              };
              
              audio.play().catch(reject);
            });
          } catch (error) {
            console.error('Eleven Labs speech synthesis error:', error);
            throw error;
          }
        } else if (speech) {
          return new Promise((resolve, reject) => {
            try {
              speech.speak({
                text,
                queue: false,
                listeners: {
                  onend: () => resolve(),
                  onerror: (error) => {
                    // Only reject if it's not an "interrupted" error
                    if (error?.error !== 'interrupted') {
                      reject(error);
                    } else {
                      resolve(); // Resolve for interrupted speech
                    }
                  }
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } else {
          console.warn('No speech service available');
          return Promise.resolve(); // Continue without speech if not available
        }
      }
    }),
    {
      name: 'mind-mint-storage',
      partialize: (state) => ({
        settings: state.settings,
        timer: {
          hours: state.timer.hours,
          minutes: state.timer.minutes,
          seconds: state.timer.seconds,
          remainingSeconds: state.timer.remainingSeconds,
          isRunning: state.timer.isRunning
        },
        currentSuttaId: state.currentSuttaId
      })
    }
  )
);