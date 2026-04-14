import { useState, KeyboardEvent } from 'react';
import { processPrompt } from '../services/ai';
import { Loader2, Terminal, Wand2, Settings2, Edit3, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CopyButton } from './CopyButton';
import { PaneLayout } from '../services/settings';

type Mode = 'make' | 'optimize' | 'rewrite';

const MODES: { id: Mode; label: string; icon: any; desc: string; placeholder: string }[] = [
  { id: 'make', label: 'Prompt Maker', icon: Wand2, desc: 'Turn a rough idea into a detailed prompt', placeholder: 'E.g., I want a prompt that helps me write a sci-fi story about a time-traveling detective...' },
  { id: 'optimize', label: 'Optimizer', icon: Settings2, desc: 'Improve an existing prompt', placeholder: 'Paste your existing prompt here to make it more robust and clear...' },
  { id: 'rewrite', label: 'Rewrite', icon: Edit3, desc: 'Adapt a prompt for a new goal', placeholder: 'Paste the prompt you want to adapt...' },
];

interface PromptSuiteProps {
  layout: PaneLayout;
}

export function PromptSuite({ layout }: PromptSuiteProps) {
  const [mode, setMode] = useState<Mode>('make');
  const [text, setText] = useState('');
  const [extra, setExtra] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    resultPrompt: string;
    explanation?: string;
    improvements?: string[];
  } | null>(null);

  const activeModeData = MODES.find(m => m.id === mode)!;

  const handleProcess = async () => {
    if (!text.trim() || (mode === 'rewrite' && !extra.trim())) return;
    setIsChecking(true);
    try {
      const res = await processPrompt(mode, text, extra);
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
      handleProcess();
    }
  };

  const gridClass = layout === 'side-by-side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1';

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-light tracking-tight mb-2 dark:text-white">Prompt Suite</h1>
        <p className="text-gray-500 dark:text-neutral-400">Craft, optimize, and rewrite prompts for Large Language Models.</p>
      </header>

      {/* Mode Selector */}
      <div className="bg-white dark:bg-neutral-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 inline-flex flex-wrap gap-1 transition-colors duration-300">
        {MODES.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id);
                setResult(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                mode === m.id 
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' 
                  : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
              title={m.desc}
            >
              <Icon size={16} />
              {m.label}
            </button>
          );
        })}
      </div>

      <div className={`grid gap-6 ${gridClass}`}>
        {/* Input Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden flex flex-col transition-colors duration-300">
          <div className="p-4 border-b border-gray-50 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-800/30 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Input</span>
          </div>
          
          <div className="flex-1 flex flex-col">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeModeData.placeholder}
              className="flex-1 p-6 min-h-[250px] resize-none focus:outline-none font-sans text-base leading-relaxed text-gray-800 dark:text-neutral-200 placeholder:text-gray-300 dark:placeholder-neutral-600 bg-transparent"
            />
            
            {mode === 'rewrite' && (
              <div className="p-4 border-t border-gray-50 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-800/30">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">New Goal or Style</label>
                <input
                  type="text"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="E.g., Make it suitable for a coding assistant, or change the tone to professional..."
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm transition-colors"
                />
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-50 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-800/30 flex justify-end">
            <button
              onClick={handleProcess}
              disabled={isChecking || !text.trim() || (mode === 'rewrite' && !extra.trim())}
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? <Loader2 className="animate-spin" size={16} /> : <Terminal size={16} />}
              {isChecking ? 'Processing...' : 'Generate Prompt'}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden flex flex-col min-h-[400px] transition-colors duration-300">
          <div className="p-4 border-b border-gray-50 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-800/30 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Result</span>
            {result && <CopyButton text={result.resultPrompt} />}
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
                  <p className="text-sm">Engineering prompt...</p>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-8"
                >
                  <div className="bg-gray-900 dark:bg-black text-gray-100 dark:text-neutral-300 p-5 rounded-2xl font-mono text-sm leading-relaxed whitespace-pre-wrap border border-transparent dark:border-neutral-800">
                    {result.resultPrompt}
                  </div>
                  
                  {result.explanation && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-2 text-gray-900 dark:text-neutral-100 font-semibold uppercase tracking-wider text-sm">
                        <Wand2 size={16} />
                        Explanation
                      </div>
                      <p className="text-gray-600 dark:text-neutral-400 leading-relaxed text-sm">{result.explanation}</p>
                    </div>
                  )}

                  {result.improvements && result.improvements.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-neutral-100 font-semibold uppercase tracking-wider text-sm">
                        <ListChecks size={16} />
                        Improvements Made
                      </div>
                      <ul className="space-y-2">
                        {result.improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-neutral-400 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 mt-2 shrink-0" />
                            <span className="leading-relaxed">{imp}</span>
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
                    <Terminal size={24} className="text-gray-300 dark:text-neutral-600" />
                  </div>
                  <p className="text-sm text-center max-w-[250px]">
                    {activeModeData.desc}. Your engineered prompt will appear here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
