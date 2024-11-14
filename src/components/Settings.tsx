import React, { useEffect } from 'react';
import { Settings as SettingsIcon, Volume2, Sun, Moon, RotateCcw, Mic, Play } from 'lucide-react';
import { useStore } from '../store/useStore';

const AccessibilityControl: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}> = ({ label, value, onChange, min = 0, max = 100, step = 1 }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {value}%
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
  </div>
);

const ttsProviders = [
  { 
    name: 'browser' as const,
    label: 'Browser TTS',
    description: 'Use built-in browser text-to-speech',
    requiresAuth: false,
  },
  {
    name: 'elevenlabs' as const,
    label: 'Eleven Labs',
    description: 'High-quality AI voices with natural prosody',
    requiresAuth: true,
    fields: ['apiKey'],
  },
  {
    name: 'openai' as const,
    label: 'OpenAI TTS',
    description: 'High-quality voices powered by OpenAI',
    requiresAuth: true,
    fields: ['apiKey'],
  },
  {
    name: 'wellsaid' as const,
    label: 'WellSaid Labs',
    description: 'Natural-sounding AI voices',
    requiresAuth: true,
    fields: ['apiKey'],
  },
  {
    name: 'microsoft' as const,
    label: 'Microsoft Azure',
    description: 'Azure Cognitive Services TTS',
    requiresAuth: true,
    fields: ['apiKey', 'region'],
  },
  {
    name: 'amazon' as const,
    label: 'Amazon Polly',
    description: 'AWS Polly text-to-speech service',
    requiresAuth: true,
    fields: ['apiKey', 'region'],
  },
];

export const Settings: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetAccessibilitySettings, 
    updateTTSProvider, 
    availableVoices,
    fetchElevenLabsVoices 
  } = useStore();

  const englishVoices = availableVoices.filter(voice => 
    voice.lang.startsWith('en-')
  );

  // Fetch Eleven Labs voices when API key is added
  useEffect(() => {
    if (
      settings.ttsProvider.name === 'elevenlabs' && 
      settings.ttsProvider.apiKey && 
      (!settings.elevenLabsVoices || settings.elevenLabsVoices.length === 0)
    ) {
      fetchElevenLabsVoices();
    }
  }, [settings.ttsProvider.name, settings.ttsProvider.apiKey, settings.elevenLabsVoices, fetchElevenLabsVoices]);

  const handlePreviewVoice = async (previewUrl: string) => {
    try {
      const audio = new Audio(previewUrl);
      await audio.play();
    } catch (error) {
      console.error('Failed to play voice preview:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Theme and Accessibility Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Display Settings
            </h2>
          </div>
          <button
            onClick={resetAccessibilitySettings}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="flex space-x-4">
            {['light', 'dark'].map((theme) => (
              <button
                key={theme}
                onClick={() => updateSettings({ theme: theme as 'light' | 'dark' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  settings.theme === theme
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                <span className="capitalize">{theme}</span>
              </button>
            ))}
          </div>

          {/* Accessibility Controls */}
          <div className="space-y-4">
            <AccessibilityControl
              label="Brightness"
              value={settings.brightness}
              onChange={(value) => updateSettings({ brightness: value })}
            />
            <AccessibilityControl
              label="Contrast"
              value={settings.contrast}
              onChange={(value) => updateSettings({ contrast: value })}
            />
            <AccessibilityControl
              label="Sepia"
              value={settings.sepia}
              onChange={(value) => updateSettings({ sepia: value })}
            />
            <AccessibilityControl
              label="Greyscale"
              value={settings.greyscale}
              onChange={(value) => updateSettings({ greyscale: value })}
            />
          </div>
        </div>
      </section>

      {/* Text-to-Speech Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Mic className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Text-to-Speech Settings
          </h2>
        </div>

        <div className="space-y-6">
          {/* TTS Provider Selection */}
          <div className="space-y-4">
            {ttsProviders.map((provider) => (
              <div
                key={provider.name}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  settings.ttsProvider?.name === provider.name
                    ? 'border-primary bg-primary bg-opacity-5'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <label className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="ttsProvider"
                    checked={settings.ttsProvider?.name === provider.name}
                    onChange={() => updateTTSProvider({ name: provider.name, enabled: true })}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {provider.label}
                      </span>
                      {provider.requiresAuth && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                          Requires API Key
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {provider.description}
                    </p>
                    
                    {settings.ttsProvider?.name === provider.name && (
                      <div className="mt-3 space-y-3">
                        {provider.name === 'browser' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Voice
                            </label>
                            <select
                              value={settings.selectedVoice}
                              onChange={(e) => updateSettings({ selectedVoice: e.target.value })}
                              className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                            >
                              <option value="">Default Voice</option>
                              {englishVoices.map((voice) => (
                                <option key={voice.voiceURI} value={voice.name}>
                                  {voice.name} ({voice.lang})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {provider.name === 'elevenlabs' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                API Key
                              </label>
                              <input
                                type="password"
                                value={settings.ttsProvider?.apiKey || ''}
                                onChange={(e) => updateTTSProvider({ apiKey: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                                placeholder="Enter your Eleven Labs API key"
                              />
                            </div>

                            {settings.ttsProvider?.apiKey && settings.elevenLabsVoices && settings.elevenLabsVoices.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Voice
                                </label>
                                <div className="space-y-2">
                                  {settings.elevenLabsVoices.map((voice) => (
                                    <div 
                                      key={voice.voice_id}
                                      className={`flex items-center justify-between p-3 rounded-lg border ${
                                        settings.ttsProvider?.selectedVoiceId === voice.voice_id
                                          ? 'border-primary bg-primary/5'
                                          : 'border-gray-200 dark:border-gray-700'
                                      }`}
                                    >
                                      <label className="flex items-center space-x-3">
                                        <input
                                          type="radio"
                                          name="elevenLabsVoice"
                                          checked={settings.ttsProvider?.selectedVoiceId === voice.voice_id}
                                          onChange={() => updateTTSProvider({ selectedVoiceId: voice.voice_id })}
                                          className="text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                          {voice.name}
                                        </span>
                                      </label>
                                      <button
                                        onClick={() => handlePreviewVoice(voice.preview_url)}
                                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                      >
                                        <Play size={12} />
                                        <span>Preview</span>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        
                        {provider.requiresAuth && provider.name !== 'elevenlabs' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                API Key
                              </label>
                              <input
                                type="password"
                                value={settings.ttsProvider?.apiKey || ''}
                                onChange={(e) => updateTTSProvider({ apiKey: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                placeholder="Enter API key"
                              />
                            </div>
                            
                            {provider.fields.includes('region') && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Region
                                </label>
                                <input
                                  type="text"
                                  value={settings.ttsProvider?.region || ''}
                                  onChange={(e) => updateTTSProvider({ region: e.target.value })}
                                  className="w-full px-3 py-2 border rounded-md text-sm"
                                  placeholder="e.g., us-east-1"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>

          {/* Volume Control */}
          <div>
            <label htmlFor="volume-control" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Volume
            </label>
            <div className="flex items-center space-x-2">
              <Volume2 size={20} className="text-gray-700 dark:text-gray-300" />
              <input
                id="volume-control"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {Math.round(settings.volume * 100)}%
              </span>
            </div>
          </div>

          {/* Highlight Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Text Highlight Color
              </label>
              <input
                type="color"
                value={settings.highlightColor}
                onChange={(e) => updateSettings({ highlightColor: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Highlight Opacity
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.highlightOpacity}
                onChange={(e) => updateSettings({ highlightOpacity: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(settings.highlightOpacity * 100)}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Meditation Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Meditation Settings
        </h2>
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.readSuttaBeforeMeditation}
              onChange={(e) => updateSettings({ readSuttaBeforeMeditation: e.target.checked })}
              className="rounded text-primary focus:ring-primary"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Read Sutta Before Meditation
            </span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.autoStartTimerAfterSutta}
              onChange={(e) => updateSettings({ autoStartTimerAfterSutta: e.target.checked })}
              disabled={!settings.readSuttaBeforeMeditation}
              className="rounded text-primary focus:ring-primary disabled:opacity-50"
            />
            <span className={`text-gray-700 dark:text-gray-300 ${!settings.readSuttaBeforeMeditation ? 'opacity-50' : ''}`}>
              Auto-start Timer After Sutta
            </span>
          </label>
        </div>
      </section>
    </div>
  );
};