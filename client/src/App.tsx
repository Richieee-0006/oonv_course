import React, { useEffect, useState } from 'react';
import { Header } from './components/layout/Header';
import { Navbar, TabKey } from './components/layout/Navbar';
import { Step1UnderTheHood } from './components/curriculum/Step1UnderTheHood';
import { Step2OOPHolyTrinity } from './components/curriculum/Step2OOPHolyTrinity';
import { PatternCatalog } from './components/patterns/PatternCatalog';
import { TrainerHub } from './components/trainer/TrainerHub';
import { Playground } from './components/playground/Playground';
import { storageService } from './services/storageService';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => storageService.getTheme());
  const [activeTab, setActiveTab] = useState<TabKey>(() => storageService.getActiveTab('step1') as TabKey);

  useEffect(() => {
    storageService.setTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const handleSelectTab = (tab: TabKey) => {
    setActiveTab(tab);
    storageService.setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    if (window.confirm('Opravdu si přejete smazat uložený postup a kód z prohlížeče?')) {
      storageService.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col">
      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onResetProgress={handleResetProgress}
      />

      {/* Main Tab Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'step1' && <Step1UnderTheHood />}
        {activeTab === 'step2' && <Step2OOPHolyTrinity />}
        {activeTab === 'patterns' && <PatternCatalog />}
        {activeTab === 'trainer' && <TrainerHub />}
        {activeTab === 'playground' && <Playground />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            C# & OONV Interaktivní platforma • Podle sylabu OONV (2026)
          </div>
          <div className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
            Roslyn .NET 10 SDK • Vite + React + TypeScript + Tailwind
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
