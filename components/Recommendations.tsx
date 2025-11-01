
import React from 'react';
import { PairingResult } from '../types';

interface RecommendationsProps {
  inputFont: string;
  result: PairingResult;
}

interface FontCardProps {
  role: string;
  fontName: string;
  fontWeight: number;
  previewText: string;
  className?: string;
}

const FontCard: React.FC<FontCardProps> = ({ role, fontName, fontWeight, previewText, className }) => {
  const fontStyle = {
    fontFamily: `"${fontName}", sans-serif`,
    fontWeight: fontWeight,
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{role}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{fontName}</p>
      </div>
      <p className="text-4xl md:text-5xl truncate" style={fontStyle} title={previewText}>
        {previewText}
      </p>
    </div>
  );
};


const Recommendations: React.FC<RecommendationsProps> = ({ inputFont, result }) => {
  return (
    <div className="mt-12 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FontCard 
            role="Input Font" 
            fontName={inputFont} 
            fontWeight={400} 
            previewText="Ag" 
            className="bg-gray-100 dark:bg-gray-800"
          />
          <FontCard 
            role="Headline" 
            fontName={result.headline.name} 
            fontWeight={result.headline.weight} 
            previewText="Ag"
            className="bg-white dark:bg-gray-700"
          />
          <FontCard 
            role="Body" 
            fontName={result.body.name} 
            fontWeight={result.body.weight} 
            previewText="Ag"
            className="bg-white dark:bg-gray-700"
          />
          <FontCard 
            role="Accent" 
            fontName={result.accent.name} 
            fontWeight={result.accent.weight} 
            previewText="Ag"
            className="bg-white dark:bg-gray-700"
          />
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Pairing Rationale</h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{result.reasoning}</p>
      </div>
    </div>
  );
};

export default Recommendations;
