import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export function Checkbox({ checked, onChange, label, description }: CheckboxProps) {
  return (
    <div 
      className="flex items-start gap-4 group cursor-pointer"
      onClick={() => onChange(!checked)}
    >
      <div 
        className={`
          shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
          ${checked 
            ? 'bg-black border-black dark:bg-white dark:border-white' 
            : 'bg-transparent border-gray-200 dark:border-neutral-800 group-hover:border-gray-300 dark:group-hover:border-neutral-700'
          }
        `}
      >
        <motion.div
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Check 
            size={14} 
            className={checked ? 'text-white dark:text-black' : 'text-transparent'} 
            strokeWidth={3}
          />
        </motion.div>
      </div>
      
      {(label || description) && (
        <div className="flex flex-col gap-1">
          {label && (
            <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-500 dark:text-neutral-400 transition-colors">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
