import { MAX_INPUT_CHARACTERS } from '../services/ai';

export function CharCount({ count }: { count: number }) {
  const isOver = count > MAX_INPUT_CHARACTERS;
  const percentage = Math.min((count / MAX_INPUT_CHARACTERS) * 100, 100);

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-medium tracking-tight ${isOver ? 'text-red-500' : 'text-gray-400 dark:text-neutral-500'}`}>
            {count.toLocaleString()} / {MAX_INPUT_CHARACTERS.toLocaleString()} chars
          </span>
          <div className="w-16 h-1 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isOver ? 'bg-red-500' : 'bg-black dark:bg-white'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
