import React from 'react';
import { Cpu, Layers, Sparkles, Dumbbell, Code2 } from 'lucide-react';

export type TabKey = 'step1' | 'step2' | 'patterns' | 'trainer' | 'playground';

interface NavbarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'step1' as TabKey,
      label: '1. C# Základy & Paměť',
      icon: Cpu,
    },
    {
      id: 'step2' as TabKey,
      label: '2. OOP & Zkouška',
      icon: Layers,
    },
    {
      id: 'patterns' as TabKey,
      label: '3. Katalog vzorů (16)',
      icon: Sparkles,
    },
    {
      id: 'trainer' as TabKey,
      label: '4. Trénink & Kvíz',
      icon: Dumbbell,
    },
    {
      id: 'playground' as TabKey,
      label: '5. C# Pískoviště',
      icon: Code2,
    },
  ];

  return (
    <nav aria-label="Hlavní navigace kurzu" className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2 scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => onSelectTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-600 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
