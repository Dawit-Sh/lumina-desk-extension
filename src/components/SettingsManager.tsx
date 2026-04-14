import { AppSettings, saveSettings, AppTab, Theme, PaneLayout, GeminiModel } from '../services/settings';
import { Settings as SettingsIcon, Columns2, Rows2, Moon, Sun, Monitor, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (settings: Partial<AppSettings>) => void;
}

export function SettingsManager({ settings, onUpdate }: SettingsProps) {
  const handleUpdate = (update: Partial<AppSettings>) => {
    onUpdate(update);
    saveSettings(update);
  };

  return (
    <div className="flex flex-col gap-12 max-w-2xl">
      <header>
        <h1 className="text-4xl font-light tracking-tight mb-2 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-neutral-400">Personalize your Lumina experience.</p>
      </header>

      <section className="flex flex-col gap-8">
        {/* Appearance Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Appearance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 flex flex-col gap-4 transition-colors">
              <div className="flex items-center gap-3 font-medium dark:text-white">
                <Sun size={18} className="text-gray-400" />
                Theme
              </div>
              <div className="flex p-1 bg-gray-50 dark:bg-neutral-800 rounded-xl gap-1">
                {(['light', 'dark', 'system'] as Theme[]).map(t => (
                  <button
                    key={t}
                    onClick={() => handleUpdate({ theme: t })}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg capitalize transition-all ${
                      settings.theme === t 
                        ? 'bg-white dark:bg-neutral-700 text-black dark:text-white shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 flex flex-col gap-4 transition-colors">
              <div className="flex items-center gap-3 font-medium dark:text-white">
                <Columns2 size={18} className="text-gray-400" />
                Pane Layout
              </div>
              <div className="flex p-1 bg-gray-50 dark:bg-neutral-800 rounded-xl gap-1">
                {(['side-by-side', 'stacked'] as PaneLayout[]).map(l => (
                  <button
                    key={l}
                    onClick={() => handleUpdate({ layout: l })}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                      settings.layout === l 
                        ? 'bg-white dark:bg-neutral-700 text-black dark:text-white shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                    }`}
                  >
                    {l === 'side-by-side' ? 'Standard' : 'Stacked'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Defaults Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Defaults & Tools</h2>
          
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 flex flex-col gap-6 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium dark:text-white text-sm">Default Startup Tab</span>
                <span className="text-xs text-gray-500 dark:text-neutral-400">Which tool opens by default when you load Lumina.</span>
              </div>
              <select 
                value={settings.defaultTab}
                onChange={(e) => handleUpdate({ defaultTab: e.target.value as AppTab })}
                className="bg-gray-50 dark:bg-neutral-800 border-none rounded-xl text-xs px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white dark:text-white outline-none"
              >
                <option value="grammar">Grammar Check</option>
                <option value="paraphrase">Paraphraser</option>
                <option value="summarize">Summarizer</option>
                <option value="tone">Tone Analyzer</option>
                <option value="prompt">Prompt Suite</option>
                <option value="settings">Settings</option>
              </select>
            </div>

            <div className="h-px bg-gray-50 dark:bg-neutral-800" />

            <div className="flex items-center justify-between group cursor-pointer" onClick={() => handleUpdate({ preserveInformality: !settings.preserveInformality })}>
              <div className="flex flex-col">
                <span className="font-medium dark:text-white text-sm">Always Keep Informal</span>
                <span className="text-xs text-gray-500 dark:text-neutral-400">Grammar checker will default to preserving your casual voice.</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.preserveInformality ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-neutral-800'}`}>
                <motion.div 
                  animate={{ x: settings.preserveInformality ? 26 : 4 }}
                  className={`absolute top-1 w-4 h-4 rounded-full ${settings.preserveInformality ? 'bg-white dark:bg-black' : 'bg-white dark:bg-neutral-400'}`}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Gemini Models Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Gemini Intelligence</h2>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 flex flex-col gap-6 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium dark:text-white text-sm">Standard Model (Flash)</span>
                <span className="text-xs text-gray-500 dark:text-neutral-400">Used for quick tasks like grammar and tone checks.</span>
              </div>
              <select 
                value={settings.model}
                onChange={(e) => handleUpdate({ model: e.target.value as GeminiModel })}
                className="bg-gray-50 dark:bg-neutral-800 border-none rounded-xl text-xs px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white dark:text-white outline-none"
              >
                <option value="gemini-3-flash-preview">Gemini 3 Flash (2026 Preview)</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (2026 Preview)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              </select>
            </div>

            <div className="h-px bg-gray-50 dark:bg-neutral-800" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium dark:text-white text-sm">Reasoning Model (Pro)</span>
                <span className="text-xs text-gray-500 dark:text-neutral-400">Used for heavy tasks like AI Humanization and Forensics.</span>
              </div>
              <select 
                value={settings.proModel}
                onChange={(e) => handleUpdate({ proModel: e.target.value as GeminiModel })}
                className="bg-gray-50 dark:bg-neutral-800 border-none rounded-xl text-xs px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white dark:text-white outline-none"
              >
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Flagship)</option>
                <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              </select>
            </div>
          </div>
        </div>
        {/* Shortcuts Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Keyboard Shortcuts</h2>
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-neutral-800 divide-y divide-gray-50 dark:divide-neutral-800 transition-colors overflow-hidden">
            {[
              { label: 'Toggle Sidebar', key: 'Mod + B' },
              { label: 'Toggle Layout', key: 'Mod + L' },
              { label: 'Toggle Theme', key: 'Mod + Shift + L' },
              { label: 'Settings', key: 'Mod + ,' },
            ].map(s => (
              <div key={s.label} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                <span className="text-sm text-gray-600 dark:text-neutral-300">{s.label}</span>
                <div className="flex gap-1">
                  {s.key.split(' + ').map(k => (
                    <kbd key={k} className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 text-[10px] font-mono font-bold rounded-md border border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-neutral-400 shadow-sm min-w-[24px] text-center">
                      {k === 'Mod' ? (navigator.platform.includes('Mac') ? '⌘' : 'Ctrl') : k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-8 p-6 bg-gray-50 dark:bg-neutral-800/30 rounded-3xl flex items-center gap-4 border border-gray-100 dark:border-neutral-800">
        <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-400">
          <CheckCircle2 size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold dark:text-white">Settings Auto-Saved</span>
          <span className="text-xs text-gray-400">Your preferences are stored locally in your browser.</span>
        </div>
      </footer>
    </div>
  );
}
