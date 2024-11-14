import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Speech from 'speak-tts';
import { fetchElevenLabsVoices, synthesizeElevenLabsSpeech } from '../utils/elevenLabs';
import { updateDisplaySettings } from '../utils/displaySettings';
import type { Settings, Timer, TTSProvider, ElevenLabsVoice } from '../types';

interface State {
  settings: Settings;
  timer: Timer;
  speech: Speech | null;
  isReading: boolean;
  availableVoices: SpeechSynthesisVoice[];
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
  minutes: 10,
  seconds: 0,
  remainingSeconds: 600,
  isRunning: false
};

let speechInstance: Speech | null = null;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      timer: defaultTimer,
      speech: null,
      isReading: false,
      availableVoices: [],

      setIsReading: (isReading) => set({ isReading }),

      initializeSpeech: async () => {
        try {
          if (!speechInstance) {
            const speech = new Speech();
            if (speech.hasBrowserSupport()) {
              await speech.init({
                volume: get().settings.volume,
                lang: 'en-US',
                splitSentences: false,
                listeners: {
                  onvoiceschanged: (voices) => {
                    if (voices) {
                      set({ availableVoices: voices });
                    }
                  }
                }
              });
              speechInstance = speech;
            }
          }
          set({ speech: speechInstance });
        } catch (error) {
          console.error('Speech initialization error:', error);
        }
      },

      updateSettings: (newSettings) => {
        set((state) => {
          const updatedSettings = { ...state.settings, ...newSettings };
          updateDisplaySettings(updatedSettings);
          return { settings: updatedSettings };
        });
      },

      updateTimer: (newTimer) => {
        set((state) => {
          const updatedTimer = { ...state.timer, ...newTimer };
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
          }
        }
      },

      speak: async (text: string) => {
        const { settings, speech } = get();
        
        if (settings.ttsProvider.name === 'elevenlabs' && 
            settings.ttsProvider.apiKey && 
            settings.ttsProvider.selectedVoiceId) {
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
        } else if (speech) {
          return new Promise((resolve, reject) => {
            speech.speak({
              text,
              queue: false,
              listeners: {
                onend: () => resolve(),
                onerror: (error) => reject(error)
              }
            });
          });
        } else {
          throw new Error('No speech service available');
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
          isRunning: false
        }
      })
    }
  )
);