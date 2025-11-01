
import React, { useState } from 'react';
import { SearchIcon } from './icons';

interface FontInputProps {
  onSearch: (fontName: string) => void;
  isLoading: boolean;
}

const FontInput: React.FC<FontInputProps> = ({ onSearch, isLoading }) => {
  const [fontName, setFontName] = useState('Montserrat');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fontName.trim() && !isLoading) {
      onSearch(fontName.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative shadow-lg rounded-full">
        <input
          type="text"
          value={fontName}
          onChange={(e) => setFontName(e.target.value)}
          placeholder="Enter a font name (e.g., Lato)"
          className="w-full pl-6 pr-32 py-4 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-transparent focus:border-indigo-500 focus:ring-0 rounded-full transition-colors duration-300"
          aria-label="Font Name Input"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute inset-y-0 right-0 flex items-center justify-center m-2 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <SearchIcon />
              <span className="ml-2 hidden sm:inline">Find Pairings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FontInput;
