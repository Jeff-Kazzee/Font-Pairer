
import React, { useState } from 'react';
import { PairingResult } from '../types';

interface PreviewProps {
  result: PairingResult;
}

const Preview: React.FC<PreviewProps> = ({ result }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const headlineStyle = {
    fontFamily: `"${result.headline.name}", sans-serif`,
    fontWeight: result.headline.weight,
  };
  const bodyStyle = {
    fontFamily: `"${result.body.name}", sans-serif`,
    fontWeight: result.body.weight,
  };
  const accentStyle = {
    fontFamily: `"${result.accent.name}", serif`,
    fontWeight: result.accent.weight,
  };

  return (
    <div className="mt-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Visual Preview</h2>
        <div className={`rounded-2xl shadow-2xl overflow-hidden border-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`p-4 flex justify-end ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)} 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                >
                    {isDarkMode ? 'Dark' : 'Light'} Mode
                </button>
            </div>
            <div className={`p-8 md:p-12 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'}`}>
                <h1 style={headlineStyle} className={`text-4xl md:text-6xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    The Quick Brown Fox Jumps Over
                </h1>
                <p style={accentStyle} className={`text-lg md:text-xl mb-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    A story of typography and design
                </p>
                <p style={bodyStyle} className="text-base md:text-lg leading-relaxed mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper.
                </p>
                 <p style={bodyStyle} className="text-base md:text-lg leading-relaxed">
                    Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.
                </p>
            </div>
        </div>
    </div>
  );
};

export default Preview;
