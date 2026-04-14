import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface SelectorProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function Selector({ value, options, onChange, label, className = '' }: SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 rounded-xl text-sm transition-all hover:bg-gray-100 dark:hover:bg-neutral-700/50 border border-transparent focus:border-black/10 dark:focus:border-white/10 outline-none dark:text-white"
        >
          <span className="truncate">{selectedOption?.label}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="py-1 max-h-60 overflow-y-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left
                      ${option.value === value 
                        ? 'bg-black/5 dark:bg-white/5 text-black dark:text-white' 
                        : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-black dark:hover:text-white'
                      }
                    `}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      {option.description && (
                        <span className="text-[10px] opacity-60 leading-tight">{option.description}</span>
                      )}
                    </div>
                    {option.value === value && (
                      <Check size={14} className="text-black dark:text-white" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
