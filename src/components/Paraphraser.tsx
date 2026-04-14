import { useState, KeyboardEvent } from 'react';
import { paraphraseText } from '../services/ai';
import { Loader2, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CopyButton } from './CopyButton';
import { PaneLayout } from '../services/settings';

const STYLES = [
  { id: 'fluent', label: 'Fluent', desc: 'Improves flow and readability' },
  { id: 'formal', label: 'Formal', desc: 'Professional and sophisticated' },
  { id: 'informal', label: 'Informal', desc: 'Casual and conversational' },
  { id: 'playful', label: 'Playful', desc: 'Fun, engaging, and creative' },
  { id: 'academic', label: 'Academic', desc: 'Scholarly and objective' },
  { id: 'shorten', label: 'Shorten', desc: 'Makes text concise and brief' },
  { id: 'slang', label: 'Slang', desc: 'Modern internet/street slang' },
];

interface ParaphraserProps {
  layout: PaneLayout;
}

export function Paraphraser({ layout }: ParaphraserProps) {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('fluent');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    paraphrasedText: string;
    explanation: string;
  } | null>(null);

  const handleParaphrase = async () => {
    if (!text.trim()) return;
    setIsChecking(true);
    try {
      const res = await paraphraseText(text, style);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleParaphrase();
    }
  };

  const gridClass = layout === 'side-by-side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1';

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-light tracking-tight mb-2 dark:text-white">Paraphraser</h1>
        <p className="text-gray-500 dark:text-neutral-400">Rewrite your text in different styles while preserving the original meaning.</p>
      </header>

      {/* Style Selector */}
      <div className="bg-white dark:bg-neutral-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 inline-flex flex-wrap gap-1 transition-colors duration-300">
        {STYLES.map(s => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              style === s.id 
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' 
                : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
            title={s.desc}
          >
            {s.label}
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
            placeholder="Paste text to paraphrase..."
            className="flex-1 p-6 min-h-[300px] resize-none focus:outline-none font-serif text-lg leading-relaxed text-gray-800 dark:text-neutral-200 placeholder:text-gray-300 dark:placeholder-neutral-600 bg-transparent"
          />
          <div className="p-4 border-t border-gray-50 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-800/30 flex justify-end">
            <button
              onClick={handleParaphrase}
              disabled={isChecking || !text.trim()}
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
              {isChecking ? 'Rewriting...' : 'Paraphrase'}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden flex flex-col min-h-[400px] transition-colors duration-300">
          <div className="p-4 border-b border-gray-50 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-800/30 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Paraphrased Text</span>
              {result && (
                <span className="text-xs text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded-md">{STYLES.find(s => s.id === style)?.label} Style</span>
              )}
            </div>
            {result && <CopyButton text={result.paraphrasedText} />}
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
                  <p className="text-sm">Applying {style} style...</p>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-8"
                >
                  <div className="font-serif text-lg leading-relaxed text-gray-800 dark:text-neutral-200">
                    {result.paraphrasedText}
                  </div>
                  
                  {result.explanation && (
                    <div className="pt-6 border-t border-gray-100 dark:border-neutral-800">
                      <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl p-4 text-sm">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400 font-medium">
                          <SlidersHorizontal size={16} />
                          Style Notes
                        </div>
                        <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">{result.explanation}</p>
                      </div>
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
                    <RefreshCw size={24} className="text-gray-300 dark:text-neutral-600" />
                  </div>
                  <p className="text-sm">Your paraphrased text will appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
