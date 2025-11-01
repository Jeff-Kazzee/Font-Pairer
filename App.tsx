
import React, { useState, useEffect, useCallback } from 'react';
import FontInput from './components/FontInput';
import Recommendations from './components/Recommendations';
import Preview from './components/Preview';
import Export from './components/Export';
import { getFontPairing } from './services/geminiService';
import { PairingResult } from './types';
import { SunIcon, MoonIcon } from './components/icons';

const App: React.FC = () => {
  const [inputFont, setInputFont] = useState('Montserrat');
  const [pairingResult, setPairingResult] = useState<PairingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const loadGoogleFont = useCallback((fontName: string, weight: number) => {
    const fontId = `font-${fontName.replace(/ /g, '-')}-${weight}`;
    if (document.getElementById(fontId)) return;

    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@${weight}&display=swap`;
    document.head.appendChild(link);
  }, []);

  const handleSearch = useCallback(async (fontName: string) => {
    setIsLoading(true);
    setError(null);
    setPairingResult(null);
    setInputFont(fontName);

    try {
      loadGoogleFont(fontName, 400); // Preload input font
      const result = await getFontPairing(fontName);
      
      // Load recommended fonts
      loadGoogleFont(result.headline.name, result.headline.weight);
      loadGoogleFont(result.body.name, result.body.weight);
      loadGoogleFont(result.accent.name, result.accent.weight);
      
      setPairingResult(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Perform an initial search on component mount
  useEffect(() => {
    handleSearch(inputFont);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const SkeletonLoader: React.FC = () => (
    <div className="mt-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
        <div className="mt-8 h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tighter">
                    FontPairer
                </h1>
                <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                    {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enter one font. Get three perfect pairs. Professional font pairings in seconds.
            </p>
        </header>

        <main>
          <FontInput onSearch={handleSearch} isLoading={isLoading} />
          {isLoading && <SkeletonLoader />}
          {error && <div className="mt-8 text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">{error}</div>}
          {pairingResult && (
            <div className="mt-8">
              <Recommendations inputFont={inputFont} result={pairingResult} />
              <Preview result={pairingResult} />
              <Export inputFont={inputFont} result={pairingResult} />
            </div>
          )}
        </main>
        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400">
            <p>Powered by Google Gemini. Designed for creators.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
