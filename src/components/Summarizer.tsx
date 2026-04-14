import { useState, KeyboardEvent } from 'react';
import { summarizeText } from '../services/ai';
import { Loader2, AlignLeft, List, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CopyButton } from './CopyButton';
import { PaneLayout } from '../services/settings';

const LENGTHS = [
  { id: 'short (1-2 sentences)', label: 'Short' },
  { id: 'medium (1 paragraph)', label: 'Medium' },
  { id: 'long (detailed)', label: 'Detailed' },
];

interface SummarizerProps {
  layout: PaneLayout;
}

export function Summarizer({ layout }: SummarizerProps) {
  const [text, setText] = useState('');
  const [length, setLength] = useState(LENGTHS[1].id);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    summary: string;
    keyPoints: string[];
  } | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setIsChecking(true);
    setError(null);
    try {
      const res = await summarizeText(text, length);
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSummarize();
    }
  };

  const gridClass = layout === 'side-by-side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1';

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-light tracking-tight mb-2 dark:text-white">Summarizer</h1>
        <p className="text-gray-500 dark:text-neutral-400">Condense long articles, emails, or documents into clear summaries.</p>
      </header>

      {/* Length Selector */}
      <div className="bg-white dark:bg-neutral-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 inline-flex flex-wrap gap-1 transition-colors duration-300">
        {LENGTHS.map(l => (
          <button
            key={l.id}
            onClick={() => setLength(l.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              length === l.id 
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' 
                : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className={`grid gap-6 ${gridClass}`}>
        {/* Input Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden flex flex-col transition-colors duration-300">
          <div className="p-4 border-b border-gray-50 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-800/30 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Original Text</span>
            <span className="text-xs text-gray-400 dark:text-neutral-500">{text.split(/\s+/).filter(w => w.length > 0).length} words</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste text to summarize..."
            className="flex-1 p-6 min-h-[300px] resize-none focus:outline-none font-serif text-lg leading-relaxed text-gray-800 dark:text-neutral-200 placeholder:text-gray-300 dark:placeholder-neutral-600 bg-transparent"
          />
          <div className="p-4 border-t border-gray-50 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-800/30 flex justify-end">
            <button
              onClick={handleSummarize}
              disabled={isChecking || !text.trim()}
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? <Loader2 className="animate-spin" size={16} /> : <AlignLeft size={16} />}
              {isChecking ? 'Summarizing...' : 'Summarize'}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden flex flex-col min-h-[400px] transition-colors duration-300">
          <div className="p-4 border-b border-gray-50 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-800/30 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Summary</span>
            {result && <CopyButton text={`${result.summary}\n\nKey Points:\n${result.keyPoints.map(p => `- ${p}`).join('\n')}`} />}
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {isChecking ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-neutral-500 gap-4"
                >
                  <Loader2 className="animate-spin" size={32} />
                  <p className="text-sm">Extracting key points...</p>
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-6 gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 mb-1">Summarization Failed</h3>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 max-w-[200px] leading-relaxed">
                      {error}
                    </p>
                  </div>
                  <button 
                    onClick={handleSummarize}
                    className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                  >
                    Try again
                  </button>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-8"
                >
                  <div className="font-serif text-lg leading-relaxed text-gray-800 dark:text-neutral-200">
                    {result.summary}
                  </div>
                  
                  {result.keyPoints && result.keyPoints.length > 0 && (
                    <div className="pt-6 border-t border-gray-100 dark:border-neutral-800">
                      <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-neutral-100 font-semibold uppercase tracking-wider text-sm">
                        <List size={16} />
                        Key Points
                      </div>
                      <ul className="space-y-3">
                        {result.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-neutral-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white mt-2 shrink-0" />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-neutral-500 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-neutral-800/50 flex items-center justify-center">
                    <AlignLeft size={24} className="text-gray-300 dark:text-neutral-600" />
                  </div>
                  <p className="text-sm">Your summary will appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
