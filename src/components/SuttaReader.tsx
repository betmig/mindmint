import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RefreshCcw, Loader2, BookOpen } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TimerWidget } from './TimerWidget';
import { initDatabase, getRandomSutta, type Sutta } from '../db';

// Split text into semantic chunks while preserving natural reading flow
const formatText = (text: string): string[] => {
  // First, split into sentences
  const sentences = text.split(/([.!?]+\s+)/).filter(Boolean);
  
  // Then, process each sentence to create natural reading chunks
  return sentences.reduce((chunks: string[], sentence) => {
    // Skip empty or whitespace-only sentences
    if (!sentence.trim()) return chunks;

    // If it's just punctuation with whitespace, append to the previous chunk
    if (/^[.!?,;:\s]+$/.test(sentence)) {
      if (chunks.length > 0) {
        chunks[chunks.length - 1] += sentence;
      }
      return chunks;
    }

    // Split long sentences at natural breaks
    const phrases = sentence
      .split(/([,;:](?:\s+|$))/)
      .reduce((acc: string[], part, i, arr) => {
        // If this is punctuation, combine it with the previous phrase
        if (/^[,;:]/.test(part)) {
          if (acc.length > 0) {
            acc[acc.length - 1] += part;
          }
          return acc;
        }

        // If the part is too long, split it further at natural breaks
        if (part.length > 100) {
          const subPhrases = part
            .split(/(\s+(?:and|but|or|nor|for|so|yet)\s+)/)
            .filter(Boolean);
          return [...acc, ...subPhrases];
        }

        // Add the part as a new phrase
        if (part.trim()) {
          acc.push(part.trim());
        }
        return acc;
      }, []);

    return [...chunks, ...phrases];
  }, []);
};

export const SuttaReader: React.FC = () => {
  const { settings, speech, isReading, setIsReading, speak } = useStore();
  const [currentSutta, setCurrentSutta] = useState<Sutta | null>(null);
  const [phrases, setPhrases] = useState<string[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [readingComplete, setReadingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const readingRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        await fetchRandomSutta();
      } catch (error) {
        console.error('Failed to initialize:', error);
        setError('Failed to load sutta. Please try again.');
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (currentSutta) {
      setPhrases(formatText(currentSutta.content));
    }
  }, [currentSutta]);

  const scrollToPhrase = (index: number) => {
    if (textContainerRef.current && index >= 0) {
      const phraseElements = textContainerRef.current.getElementsByClassName('phrase');
      if (phraseElements[index]) {
        phraseElements[index].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  };

  const readText = async () => {
    try {
      setIsReading(true);
      readingRef.current = true;
      setCurrentPhraseIndex(0);
      setReadingComplete(false);
      setError(null);

      for (let i = 0; i < phrases.length; i++) {
        if (!readingRef.current) break;

        setCurrentPhraseIndex(i);
        scrollToPhrase(i);

        try {
          await speak(phrases[i]);
          
          // Natural pause between phrases based on punctuation
          if (readingRef.current) {
            const pauseDuration = phrases[i].match(/[.!?]$/) ? 800 : 
                                phrases[i].match(/[,;:]$/) ? 400 : 
                                200;
            await new Promise(resolve => setTimeout(resolve, pauseDuration));
          }
        } catch (error) {
          console.error('Error speaking phrase:', error);
          if (!readingRef.current) break; // Stop if reading was cancelled
        }
      }

      if (readingRef.current) {
        setReadingComplete(true);
      }
    } catch (error) {
      console.error('Failed to read text:', error);
      setError('Failed to read text. Please try again.');
    } finally {
      readingRef.current = false;
      setIsReading(false);
      setCurrentPhraseIndex(-1);
    }
  };

  const stopReading = () => {
    if (speech) {
      readingRef.current = false;
      speech.cancel();
      setIsReading(false);
      setCurrentPhraseIndex(-1);
    }
  };

  const fetchRandomSutta = async () => {
    setLoading(true);
    setError(null);
    try {
      const sutta = getRandomSutta();
      if (sutta) {
        setCurrentSutta(sutta);
        setReadingComplete(false);
      } else {
        throw new Error('No sutta found');
      }
    } catch (error) {
      console.error('Error fetching sutta:', error);
      setError('Failed to load sutta. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {currentSutta?.title || 'Daily Sutta'}
                </h2>
                {currentSutta?.source && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Source: {currentSutta.source}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={isReading ? stopReading : readText}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                  aria-label={isReading ? 'Stop reading' : 'Start reading'}
                  disabled={!currentSutta || loading}
                >
                  <Volume2 size={20} />
                  <span>{isReading ? 'Stop' : 'Read'}</span>
                </button>
                <button
                  onClick={fetchRandomSutta}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  disabled={loading}
                  aria-label="Load random sutta"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <RefreshCcw size={20} />
                  )}
                  <span>Random</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}
            
            <div 
              ref={textContainerRef}
              className="prose dark:prose-invert max-w-none max-h-[60vh] overflow-y-auto scroll-smooth"
            >
              {currentSutta ? (
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {phrases.map((phrase, index) => (
                    <span
                      key={index}
                      className={`phrase inline transition-colors duration-300`}
                      style={{
                        backgroundColor: index === currentPhraseIndex
                          ? `${settings.highlightColor}${Math.round(settings.highlightOpacity * 255).toString(16).padStart(2, '0')}`
                          : 'transparent',
                        padding: '0.125rem 0.25rem',
                        margin: '-0.125rem 0',
                        borderRadius: '0.25rem',
                        lineHeight: '2',
                        fontSize: '1.125rem',
                      }}
                    >
                      {phrase}
                      {phrase.match(/[.!?]$/) ? <br /> : ' '}
                    </span>
                  ))}
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-primary" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <BookOpen size={48} className="mb-4" />
                  <p>No sutta loaded. Click Random to load one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:col-span-1">
          <TimerWidget readingComplete={readingComplete} />
        </div>
      </div>
    </div>
  );
};