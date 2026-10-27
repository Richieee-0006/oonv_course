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
      label: '1. C# Pod kapotou',
      subtitle: 'Roslyn, Stack vs Heap, Paměť',
      icon: Cpu,
    },
    {
      id: 'step2' as TabKey,
      label: '2. Svatá trojice OOP & Zkouška',
      subtitle: 'Vtable, new/override, 6 specifikátorů, UML',
      icon: Layers,
    },
    {
      id: 'patterns' as TabKey,
      label: '3. Katalog vzorů (16 GoF)',
      subtitle: 'Vytvářející, Strukturální, Chování',
      icon: Sparkles,
    },
    {
      id: 'trainer' as TabKey,
      label: '4. Praktický trenažér (4 režimy)',
      subtitle: 'Doplňovačka, 4 části, Kvíz, Pískoviště',
      icon: Dumbbell,
    },
    {
      id: 'playground' as TabKey,
      label: '5. Volné C# Pískoviště',
      subtitle: 'Rychlé zkoušení a .NET běh',
      icon: Code2,
    },
  ];

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 dark:bg-indigo-600 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <div className="text-left">
                  <div className="leading-tight">{tab.label}</div>
                  <div className={`text-[10px] hidden sm:block ${isActive ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
