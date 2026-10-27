import React, { useEffect, useState } from 'react';
import { BackendHealth } from '../../types/runner';
import { runnerService } from '../../services/runnerService';
import { storageService } from '../../services/storageService';
import { Terminal, Moon, Sun, RefreshCw, CheckCircle2, Search } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onResetProgress: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onResetProgress, onOpenSearch }) => {
  const [health, setHealth] = useState<BackendHealth>({ status: 'checking' });
  const [completedCount, setCompletedCount] = useState<number>(0);

  const checkBackend = async () => {
    setHealth({ status: 'checking' });
    const res = await runnerService.checkHealth();
    setHealth(res);
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      const progress = storageService.getProgress();
      setCompletedCount(Object.keys(progress).length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    const interval = setInterval(updateCount, 3000);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-mono font-bold text-lg">
            C#
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                C# & OONV Interaktivní Kurz
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Zkouškový trenažér 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Od základů C# a paměťového modelu po 16 GoF návrhových vzorů a zápočtový projekt
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2.5">
          {/* Quick Search Ctrl+K button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Rychlé vyhledávání (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Hledat...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 text-slate-500">
                Ctrl+K
              </kbd>
            </button>
          )}

          {/* Progress Pill */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Dokončeno úloh:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{completedCount}</span>
          </div>

          {/* Backend Health Badge */}
          <button
            onClick={checkBackend}
            title="Kliknutím obnovit kontrolu spojení s backendem"
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              health.status === 'ok'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : health.status === 'checking'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              health.status === 'ok' ? 'bg-emerald-500 animate-pulse' :
              health.status === 'checking' ? 'bg-amber-500 animate-ping' : 'bg-rose-500'
            }`} />
            <Terminal className="w-3.5 h-3.5" />
            <span className="font-mono">
              {health.status === 'ok' ? `.NET SDK ${health.dotnetVersion || 'Online'}` :
               health.status === 'checking' ? 'Ověřuji SDK...' : 'Offline runner'}
            </span>
          </button>

          {/* Dark/Light mode toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title={theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
            aria-label="Přepnout motiv"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Reset progress */}
          <button
            onClick={onResetProgress}
            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Resetovat uložený postup v prohlížeči"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
