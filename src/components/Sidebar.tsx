import { AppTab } from '../services/settings';
import {
  PenTool,
  RefreshCw,
  AlignLeft,
  Activity,
  Terminal,
  Feather,
  Settings as SettingsIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onToggleMobile,
}: SidebarProps) {
  const getTabClass = (tab: AppTab) =>
    `flex items-center gap-3 py-4 rounded-xl transition-all relative group ${
      activeTab === tab
        ? 'bg-gray-100 dark:bg-neutral-800 text-black dark:text-white font-medium'
        : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-neutral-100'
    } ${isCollapsed ? 'justify-center px-6' : 'px-3'}`;

  const navItems = [
    {
      id: 'grammar' as AppTab,
      label: 'Grammar Check',
      icon: PenTool,
      category: 'Writing Tools',
    },
    {
      id: 'paraphrase' as AppTab,
      label: 'Paraphraser',
      icon: RefreshCw,
      category: 'Writing Tools',
    },
    {
      id: 'summarize' as AppTab,
      label: 'Summarizer',
      icon: AlignLeft,
      category: 'Writing Tools',
    },
    {
      id: 'tone' as AppTab,
      label: 'Tone Analyzer',
      icon: Activity,
      category: 'Writing Tools',
    },
    {
      id: 'humanizer' as AppTab,
      label: 'Humanizer',
      icon: User,
      category: 'Writing Tools',
    },
    {
      id: 'prompt' as AppTab,
      label: 'Prompt Suite',
      icon: Terminal,
      category: 'AI Tools',
    },
  ];

  const categories = ['Writing Tools', 'AI Tools'];

  const SidebarContent = (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div
        className={`flex items-center mb-8 ${isCollapsed ? 'flex-col gap-4' : 'justify-between'}`}
      >
        <div
          className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className='w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 transition-colors duration-300'>
            <Feather size={18} />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className='text-xl font-semibold tracking-tight dark:text-white'
            >
              Lumina
            </motion.span>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className='hidden md:flex p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-all'
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className='flex flex-col gap-1 flex-1'>
        {categories.map((cat) => (
          <div
            key={cat}
            className='mb-4'
          >
            {!isCollapsed && (
              <div className='text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest px-4 mb-2'>
                {cat}
              </div>
            )}
            <div className='flex flex-col gap-1'>
              {navItems
                .filter((item) => item.category === cat)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (isMobileOpen) onToggleMobile();
                    }}
                    className={getTabClass(item.id)}
                    title={isCollapsed ? item.label : ''}
                  >
                    <item.icon
                      size={18}
                      className='shrink-0'
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                    {isCollapsed && (
                      <div className='absolute left-full ml-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50'>
                        {item.label}
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
        ))}

        <div className='mt-auto pt-4 border-t border-gray-100 dark:border-neutral-800'>
          <button
            onClick={() => {
              setActiveTab('settings');
              if (isMobileOpen) onToggleMobile();
            }}
            className={getTabClass('settings')}
            title={isCollapsed ? 'Settings' : ''}
          >
            <SettingsIcon
              size={18}
              className='shrink-0'
            />
            {!isCollapsed && <span>Settings</span>}
            {isCollapsed && (
              <div className='absolute left-full ml-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50'>
                Settings
              </div>
            )}
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 h-full shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-20 p-3' : 'w-64 p-6'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Mobile Header */}
      <div className='md:hidden flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 z-40'>
        <div className='flex items-center gap-2 font-semibold dark:text-white'>
          <Feather size={18} />
          Lumina
        </div>
        <button
          onClick={onToggleMobile}
          className='p-2 text-gray-600 dark:text-neutral-400'
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggleMobile}
              className='fixed inset-0 bg-black/20 backdrop-blur-sm z-45 md:hidden'
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white dark:bg-neutral-900 z-50 p-6 shadow-2xl md:hidden'
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
