import React, { useState } from 'react';
import { Mode1FillInBlanks } from './Mode1FillInBlanks';
import { Mode2FourPartsMemory } from './Mode2FourPartsMemory';
import { Mode3ExamQuiz } from './Mode3ExamQuiz';
import { Mode4Sandbox } from './Mode4Sandbox';
import { Mode5DragDrop } from './Mode5DragDrop';
import { FlashcardDeck } from './FlashcardDeck';
import { Dumbbell, FileText, Brain, HelpCircle, Code2, Move, Layers } from 'lucide-react';

export type TrainerMode = 'mode1' | 'mode2' | 'mode3' | 'mode4' | 'mode5' | 'flashcards';

export const TrainerHub: React.FC = () => {
  const [activeMode, setActiveMode] = useState<TrainerMode>('mode1');

  const modes = [
    {
      id: 'mode1' as TrainerMode,
      title: '1. Doplňovačka v C# kódu',
      desc: 'Doplň chybějící klíčová slova přímo do C# kódu a spusť v .NET',
      icon: FileText
    },
    {
      id: 'mode5' as TrainerMode,
      title: '2. Drag & Drop a Spojovačky',
      desc: 'Roztřídění vzorů do rodin GoF, Stack vs Heap, spojování C# kódu',
      icon: Move
    },
    {
      id: 'mode3' as TrainerMode,
      title: '3. Zkouškový kvíz & Simulace',
      desc: 'Trénink, Zkouška nanečisto (10 min), Náhlá smrt a Opravna chyb',
      icon: HelpCircle
    },
    {
      id: 'flashcards' as TrainerMode,
      title: '4. Kartičky (Leitnerův systém)',
      desc: 'Active Recall kartičky se 3 koši (Zopakovat / Váhal jsem / Umím)',
      icon: Layers
    },
    {
      id: 'mode2' as TrainerMode,
      title: '5. Napiš 4 části vzoru zpaměti',
      desc: 'Podle str. 16 z PDF (1. Rozhraní, 2. Produkt, 3. Vzor, 4. Main)',
      icon: Brain
    },
    {
      id: 'mode4' as TrainerMode,
      title: '6. Pískoviště zápočtu (3 vzory)',
      desc: 'Hotové kombinace vzorů: Platební brána & Tahové RPG',
      icon: Code2
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* HTML5 <aside> — Left Navigation for 4 Training Modes */}
        <aside
          aria-label="Výběr tréninkového režimu"
          className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
        >
          <div className="mb-3">
            <div className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Praktický trenažér</span>
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
              6 tréninkových režimů
            </h2>
          </div>

          <nav aria-label="Režimy trenažéru">
            <ul className="space-y-2">
              {modes.map((m) => {
                const Icon = m.icon;
                const isActive = activeMode === m.id;
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => setActiveMode(m.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-start space-x-3 transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">{m.title}</div>
                        <div className={`text-[11px] mt-0.5 leading-snug ${isActive ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                          {m.desc}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* HTML5 <article> — Active Mode Content */}
        <article className="flex-1 min-w-0 w-full">
          {activeMode === 'mode1' && <Mode1FillInBlanks />}
          {activeMode === 'mode5' && <Mode5DragDrop />}
          {activeMode === 'mode3' && <Mode3ExamQuiz />}
          {activeMode === 'flashcards' && <FlashcardDeck />}
          {activeMode === 'mode2' && <Mode2FourPartsMemory />}
          {activeMode === 'mode4' && <Mode4Sandbox />}
        </article>
      </div>
    </div>
  );
};
