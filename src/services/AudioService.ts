import { BellSound } from '../types';

const BELL_SOUNDS: Record<BellSound, { local: string; remote: string }> = {
  'tibetan-bowl': {
    local: '/sounds/tibetan-bowl.mp3',
    remote: 'https://raw.githubusercontent.com/betmig/mindmint/main/public/sounds/tibetan-bowl.mp3'
  },
  'zen-bell': {
    local: '/sounds/zen-bell.mp3',
    remote: 'https://raw.githubusercontent.com/betmig/mindmint/main/public/sounds/zen-bell.mp3'
  },
  'meditation-bell': {
    local: '/sounds/meditation-bell.mp3',
    remote: 'https://raw.githubusercontent.com/betmig/mindmint/main/public/sounds/meditation-bell.mp3'
  },
  'temple-bell': {
    local: '/sounds/temple-bell.mp3',
    remote: 'https://raw.githubusercontent.com/betmig/mindmint/main/public/sounds/temple-bell.mp3'
  }
};

class AudioService {
  private audioElements: Map<BellSound, HTMLAudioElement> = new Map();
  private volume = 1;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private userInteracted = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        // Test audio support
        const audio = new Audio();
        if (!audio.canPlayType('audio/mpeg')) {
          throw new Error('MP3 audio format not supported');
        }

        // Setup user interaction handlers if needed
        if (!this.userInteracted) {
          const handleUserInteraction = () => {
            this.userInteracted = true;
            // Resume any paused audio elements
            this.audioElements.forEach(audio => {
              if (audio.paused && audio.readyState >= 2) {
                audio.play().catch(() => {});
              }
            });
          };

          document.addEventListener('click', handleUserInteraction, { once: true });
          document.addEventListener('touchstart', handleUserInteraction, { once: true });
          document.addEventListener('keydown', handleUserInteraction, { once: true });
        }

        // Pre-load all sounds
        await Promise.all(
          Object.keys(BELL_SOUNDS).map(sound => this.loadSound(sound as BellSound))
        );

        this.initialized = true;
      } catch (error) {
        console.error('Audio initialization failed:', error);
        this.initPromise = null;
        throw error;
      }
    })();

    return this.initPromise;
  }

  private async tryLoadAudio(sources: string[]): Promise<HTMLAudioElement> {
    let lastError;

    for (const source of sources) {
      try {
        const audio = new Audio();
        audio.preload = 'auto';

        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          audio.src = source;
          audio.load();
        });

        return audio;
      } catch (error) {
        console.warn(`Failed to load audio from ${source}:`, error);
        lastError = error;
      }
    }

    throw lastError || new Error('Failed to load audio from all sources');
  }

  async loadSound(sound: BellSound): Promise<void> {
    // Return if already loaded and ready
    const existingAudio = this.audioElements.get(sound);
    if (existingAudio?.readyState === 4) {
      return;
    }

    try {
      const sources = [
        BELL_SOUNDS[sound].local,
        BELL_SOUNDS[sound].remote
      ];

      const audio = await this.tryLoadAudio(sources);
      audio.volume = this.volume;
      this.audioElements.set(sound, audio);
    } catch (error) {
      console.error(`Failed to load sound ${sound}:`, error);
      throw error;
    }
  }

  async play(sound: BellSound): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      await this.loadSound(sound);
      const audio = this.audioElements.get(sound);
      
      if (!audio) {
        throw new Error('Sound not loaded');
      }

      // Create a new instance for overlapping sounds
      const playInstance = new Audio(audio.src);
      playInstance.volume = this.volume;

      await playInstance.play();

      return new Promise((resolve) => {
        playInstance.addEventListener('ended', () => {
          playInstance.remove(); // Cleanup
          resolve();
        }, { once: true });
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      throw error;
    }
  }

  stop(sound: BellSound): void {
    const audio = this.audioElements.get(sound);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audioElements.forEach(audio => {
      audio.volume = this.volume;
    });
  }

  cleanup(): void {
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.audioElements.clear();
    this.initialized = false;
    this.initPromise = null;
    this.userInteracted = false;
  }
}

export const audioService = new AudioService();