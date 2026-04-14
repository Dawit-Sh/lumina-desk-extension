export type PaneLayout = 'side-by-side' | 'stacked';
export type AppTab = 'grammar' | 'paraphrase' | 'summarize' | 'tone' | 'prompt' | 'humanizer' | 'settings';
export type Theme = 'light' | 'dark' | 'system';

export interface AppSettings {
  preserveInformality: boolean;
  defaultTab: AppTab;
  theme: Theme;
  layout: PaneLayout;
  sidebarCollapsed: boolean;
}

const STORAGE_KEY = 'lumina_settings';

const DEFAULT_SETTINGS: AppSettings = {
  preserveInformality: false,
  defaultTab: 'grammar',
  theme: 'system',
  layout: 'side-by-side',
  sidebarCollapsed: false,
};

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>) {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
