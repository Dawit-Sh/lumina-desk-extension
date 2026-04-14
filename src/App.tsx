import { useState, useEffect } from 'react';
import { GrammarChecker } from './components/GrammarChecker';
import { Paraphraser } from './components/Paraphraser';
import { Summarizer } from './components/Summarizer';
import { ToneAnalyzer } from './components/ToneAnalyzer';
import { PromptSuite } from './components/PromptSuite';
import { Humanizer } from './components/Humanizer';
import { SettingsManager } from './components/SettingsManager';
import { Sidebar } from './components/Sidebar';
import {
  getSettings,
  saveSettings,
  AppTab,
  AppSettings,
} from './services/settings';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [activeTab, setActiveTab] = useState<AppTab>(settings.defaultTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    saveSettings(newSettings);
  };

  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) root.classList.add('dark');
        else root.classList.remove('dark');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  return (
    <div className='h-screen flex flex-col md:flex-row bg-[#fdfdfd] dark:bg-neutral-950 transition-colors duration-300 overflow-hidden'>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={settings.sidebarCollapsed}
        onToggleCollapse={() =>
          updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed })
        }
        isMobileOpen={isMobileMenuOpen}
        onToggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Content */}
      <main className='flex-1 flex flex-col min-w-0 h-full overflow-y-auto'>
        <div className='flex-1 p-6 md:p-12'>
          <div className='max-w-5xl mx-auto'>
            {activeTab === 'grammar' && (
              <GrammarChecker
                preserveInformalityDefault={settings.preserveInformality}
                layout={settings.layout}
              />
            )}
            {activeTab === 'paraphrase' && (
              <Paraphraser layout={settings.layout} />
            )}
            {activeTab === 'summarize' && (
              <Summarizer layout={settings.layout} />
            )}
            {activeTab === 'tone' && <ToneAnalyzer layout={settings.layout} />}
            {activeTab === 'humanizer' && <Humanizer layout={settings.layout} />}
            {activeTab === 'prompt' && <PromptSuite layout={settings.layout} />}
            {activeTab === 'settings' && (
              <SettingsManager
                settings={settings}
                onUpdate={updateSettings}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
