import { motion, AnimatePresence } from 'motion/react';
import { Selector } from './Selector';
import { OptionsStyle } from '../../services/settings';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface OptionsControlProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  style: OptionsStyle;
  label?: string;
  className?: string;
  dropdownClassName?: string;
  tabsClassName?: string;
}

export function OptionsControl({
  value,
  options,
  onChange,
  style,
  label,
  className = '',
  dropdownClassName = '',
  tabsClassName = '',
}: OptionsControlProps) {
  if (style === 'dropdown') {
    return (
      <Selector
        value={value}
        options={options}
        onChange={onChange}
        label={label}
        className={`${className} ${dropdownClassName}`}
      />
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className} ${tabsClassName}`}>

      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
          {label}
        </label>
      )}
      <div className="bg-white dark:bg-neutral-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 flex flex-wrap gap-1 transition-colors duration-300">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
              value === opt.value
                ? 'text-white dark:text-black'
                : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800'
            }`}
            title={opt.description}
          >
            {value === opt.value && (
              <motion.div
                layoutId="active-option"
                className="absolute inset-0 bg-black dark:bg-white rounded-xl shadow-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        ))}

      </div>
    </div>
  );
}
