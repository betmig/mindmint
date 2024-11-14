export interface TTSProvider {
  name: 'browser' | 'openai' | 'wellsaid' | 'microsoft' | 'amazon' | 'elevenlabs';
  enabled: boolean;
  apiKey?: string;
  region?: string;
  selectedVoiceId?: string;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  preview_url: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  brightness: number;
  contrast: number;
  sepia: number;
  greyscale: number;
  volume: number;
  selectedVoice: string;
  highlightColor: string;
  highlightOpacity: number;
  readSuttaBeforeMeditation: boolean;
  autoStartTimerAfterSutta: boolean;
  ttsProvider: TTSProvider;
  bellSound: string;
  playBellAtStart: boolean;
  playBellAtEnd: boolean;
  elevenLabsVoices: ElevenLabsVoice[];
}

export interface Timer {
  hours: number;
  minutes: number;
  seconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  bellSound?: string;
}