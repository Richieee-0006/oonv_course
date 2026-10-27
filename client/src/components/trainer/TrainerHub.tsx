import React, { useState } from 'react';
import { Mode1FillInBlanks } from './Mode1FillInBlanks';
import { Mode2FourPartsMemory } from './Mode2FourPartsMemory';
import { Mode3ExamQuiz } from './Mode3ExamQuiz';
import { Mode4Sandbox } from './Mode4Sandbox';
import { Dumbbell, FileText, Brain, HelpCircle, Code2 } from 'lucide-react';

export type TrainerMode = 'mode1' | 'mode2' | 'mode3' | 'mode4';

export const TrainerHub: React.FC = () => {
  const [activeMode, setActiveMode] = useState<TrainerMode>('mode1');

  const modes = [
    {
      id: 'mode1' as TrainerMode,
      title: 'Režim 1: Doplňovačka',
      desc: 'Klíčová slova (virtual, override, new, is, as...)',
      icon: FileText
    },
    {
      id: 'mode2' as TrainerMode,
      title: 'Režim 2: 4 části vzoru zpaměti',
      desc: 'Podle str. 16 z PDF (Rozhraní, Produkt, Vzor, Main)',
      icon: Brain
    },
    {
      id: 'mode3' as TrainerMode,
      title: 'Režim 3: Zkouškový kvíz',
      desc: '"Co vypíše tento kód?" a chytáky v RAM',
      icon: HelpCircle
    },
    {
      id: 'mode4' as TrainerMode,
      title: 'Režim 4: Pískoviště zápočtu',
      desc: 'Kombinace vzorů: Platební systém & RPG Engine',
      icon: Code2
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900/30 via-slate-900/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <Dumbbell className="w-4 h-4" />
          <span>Praktický trenažér ke zkoušce</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Všechny 4 tréninkové režimy
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
          Od tréninku klíčových slov přes psaní 4 částí vzoru zpaměti (str. 16 z PDF) až po zkouškový kvíz a 
          hotové šablony zápočtového projektu kombinující 3-4 návrhové vzory dohromady.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className={`p-2 rounded-xl flex-shrink-0 ${
                isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm">{m.title}</div>
                <div className={`text-[11px] mt-1 ${isActive ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {m.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode Content */}
      <div className="pt-2">
        {activeMode === 'mode1' && <Mode1FillInBlanks />}
        {activeMode === 'mode2' && <Mode2FourPartsMemory />}
        {activeMode === 'mode3' && <Mode3ExamQuiz />}
        {activeMode === 'mode4' && <Mode4Sandbox />}
      </div>
    </div>
  );
};
