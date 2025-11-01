import React, { useState, useEffect } from 'react';
import { PairingResult, CodeSnippets } from '../types';
import { CopyIcon, CheckIcon } from './icons';
import { getCodeSnippets } from '../services/geminiService';

interface ExportProps {
  inputFont: string;
  result: PairingResult;
}

const SnippetSkeletonLoader: React.FC = () => (
    <div className="animate-pulse p-4">
        <div className="space-y-3">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
            <div className="h-4 bg-gray-600 rounded w-5/6"></div>
            <div className="h-4 bg-gray-600 rounded w-2/3"></div>
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        </div>
    </div>
);

const Export: React.FC<ExportProps> = ({ inputFont, result }) => {
  const [activeTab, setActiveTab] = useState('css');
  const [copied, setCopied] = useState(false);
  const [snippets, setSnippets] = useState<CodeSnippets | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnippets = async () => {
      setIsLoading(true);
      setError(null);
      setSnippets(null);
      try {
        const generatedSnippets = await getCodeSnippets(inputFont, result);
        setSnippets(generatedSnippets);
      } catch (err: any) {
        setError(err.message || "Could not generate code snippets.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSnippets();
  }, [inputFont, result]);


  const copyToClipboard = () => {
    if (!snippets) return;
    navigator.clipboard.writeText(snippets[activeTab as keyof typeof snippets]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    if (isLoading) {
        return <SnippetSkeletonLoader />;
    }
    if (error) {
        return <div className="p-4 text-red-400">{error}</div>;
    }
    if (snippets) {
        return (
            <pre className="text-left text-sm text-gray-200 overflow-x-auto">
                <code className="language-css">{snippets[activeTab as keyof typeof snippets]}</code>
            </pre>
        );
    }
    return null;
  };
  
  const fontDownloads = [
    { role: 'Headline', font: result.headline },
    { role: 'Body', font: result.body },
    { role: 'Accent', font: result.accent },
  ];

  return (
    <div className="mt-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Export & Use</h2>
        <div className="w-full max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-2xl">
            <div className="flex p-2 bg-gray-900 rounded-t-lg space-x-2">
                {['html', 'css', 'tailwind'].map(key => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === key ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        disabled={isLoading || !!error}
                    >
                        {key.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="relative p-4 min-h-[12rem]">
                <button
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors disabled:opacity-50"
                    aria-label="Copy to clipboard"
                    disabled={isLoading || !!error || !snippets}
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
                {renderContent()}
            </div>
        </div>
        
        <div className="w-full max-w-3xl mx-auto mt-8">
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">Download Fonts</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
                {fontDownloads.map(({ role, font }) => (
                    <div key={role} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{font.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
                        </div>
                        <a
                            href={`https://fonts.google.com/specimen/${font.name.replace(/ /g, '+')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-300"
                            aria-label={`Download ${font.name} from Google Fonts`}
                        >
                            Download
                        </a>
                    </div>
                ))}
            </div>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                All fonts are from Google Fonts and are typically licensed under the SIL Open Font License. Always verify the license for your specific use case.
            </p>
        </div>
    </div>
  );
};

export default Export;
