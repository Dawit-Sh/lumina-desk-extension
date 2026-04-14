import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 text-gray-400 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} className="text-green-600 dark:text-green-500" /> : <Copy size={16} />}
      {copied ? <span className="text-green-600 dark:text-green-500">Copied!</span> : <span>Copy</span>}
    </button>
  );
}
