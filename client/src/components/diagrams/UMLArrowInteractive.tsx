import React, { useState } from 'react';
import { umlArrowRelations } from '../../data/theoryData';
import { Code, Eye, ArrowRight, BookOpen } from 'lucide-react';

export const UMLArrowInteractive: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'diagram' | 'code'>('diagram');

  const selected = umlArrowRelations[selectedIndex];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              UML & C#
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Jak číst UML šipky u návrhových vzorů (Klíč ke zkoušce)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            U zkoušky nepotřebuješ znát texty z Refactoring.Guru, ale <strong>poznat vzor z UML diagramu</strong> a přepsat jeho šipky do C#.
          </p>
        </div>

        {/* Toggle between Diagram and C# Code */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('diagram')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'diagram'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vizuální diagram</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'code'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>C# Syntax</span>
          </button>
        </div>
      </div>

      {/* Tabs for Arrow Types */}
      <div className="flex flex-wrap gap-2 mb-6">
        {umlArrowRelations.map((rel, idx) => (
          <button
            key={rel.name}
            onClick={() => setSelectedIndex(idx)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              selectedIndex === idx
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="font-mono mr-1.5 text-indigo-500 font-bold">{rel.umlSymbol}</span>
            <span>{rel.name.split(' (')[0]}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual / Code display */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center min-h-[240px]">
          {viewMode === 'diagram' ? (
            <div className="w-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 500 140" className="w-full max-w-md h-auto">
                <defs>
                  {/* Hollow arrow for realization/inheritance */}
                  <marker id="hollow-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto">
                    <polygon points="0 0, 10 5, 0 10" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
                  </marker>
                  {/* Filled diamond for composition */}
                  <marker id="filled-diamond" viewBox="0 0 16 10" refX="0" refY="5" markerWidth="16" markerHeight="10" orient="auto">
                    <polygon points="0 5, 8 0, 16 5, 8 10" fill="#6366f1" stroke="#6366f1" strokeWidth="1" />
                  </marker>
                  {/* Hollow diamond for aggregation */}
                  <marker id="hollow-diamond" viewBox="0 0 16 10" refX="0" refY="5" markerWidth="16" markerHeight="10" orient="auto">
                    <polygon points="0 5, 8 0, 16 5, 8 10" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
                  </marker>
                  {/* Simple line arrow for dependency */}
                  <marker id="simple-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                    <polyline points="0 1, 10 5, 0 9" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                  </marker>
                </defs>

                {/* Box 1 (Left / Subclass / Dependent) */}
                <rect x="20" y="30" width="140" height="70" rx="8" className="fill-white dark:fill-slate-900 stroke-indigo-500" strokeWidth="2" />
                <text x="90" y="55" textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-200">
                  {selectedIndex === 0 ? 'Pes' : selectedIndex === 1 ? 'Programator' : selectedIndex === 2 ? 'Dum' : selectedIndex === 3 ? 'NakupniKosik' : 'ReportGenerator'}
                </text>
                <text x="90" y="75" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">
                  {selectedIndex === 0 ? '+ VydejZvuk()' : selectedIndex === 1 ? '+ SpocitejMzdu()' : selectedIndex === 2 ? '- _pokoj' : selectedIndex === 3 ? '- _brana' : '+ Exportuj()'}
                </text>

                {/* Arrow connecting */}
                {selectedIndex === 0 && (
                  // Dashed with hollow triangle
                  <line x1="160" y1="65" x2="330" y2="65" stroke="#6366f1" strokeWidth="2" strokeDasharray="6,4" markerEnd="url(#hollow-arrow)" />
                )}
                {selectedIndex === 1 && (
                  // Solid with hollow triangle
                  <line x1="160" y1="65" x2="330" y2="65" stroke="#6366f1" strokeWidth="2" markerEnd="url(#hollow-arrow)" />
                )}
                {selectedIndex === 2 && (
                  // Solid with filled diamond
                  <line x1="160" y1="65" x2="330" y2="65" stroke="#6366f1" strokeWidth="2" markerStart="url(#filled-diamond)" markerEnd="url(#simple-arrow)" />
                )}
                {selectedIndex === 3 && (
                  // Solid with hollow diamond
                  <line x1="160" y1="65" x2="330" y2="65" stroke="#6366f1" strokeWidth="2" markerStart="url(#hollow-diamond)" markerEnd="url(#simple-arrow)" />
                )}
                {selectedIndex === 4 && (
                  // Dashed with open arrow
                  <line x1="160" y1="65" x2="330" y2="65" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,4" markerEnd="url(#simple-arrow)" />
                )}

                {/* Box 2 (Right / Interface / Base) */}
                <rect x="340" y="30" width="140" height="70" rx="8" className="fill-white dark:fill-slate-900 stroke-purple-500" strokeWidth="2" />
                <text x="410" y="52" textAnchor="middle" className="text-[10px] font-mono fill-purple-600 dark:fill-purple-400">
                  {selectedIndex === 0 ? '«interface»' : selectedIndex === 1 ? '«abstract»' : '«class»'}
                </text>
                <text x="410" y="68" textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-200">
                  {selectedIndex === 0 ? 'IZvire' : selectedIndex === 1 ? 'Zamestnanec' : selectedIndex === 2 ? 'Pokoj' : selectedIndex === 3 ? 'IPlatebniBrana' : 'IDokument'}
                </text>
                <text x="410" y="85" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">
                  {selectedIndex === 0 ? '+ VydejZvuk()' : selectedIndex === 1 ? '+ SpocitejBonus()' : selectedIndex === 2 ? '+ Plocha' : selectedIndex === 3 ? '+ Zaplat()' : '+ Tisk()'}
                </text>
              </svg>

              <div className="mt-4 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                UML Symbol: {selected.umlSymbol}
              </div>
            </div>
          ) : (
            <div className="font-mono text-xs">
              <div className="text-slate-400 text-[11px] mb-2">// Překlad do C# syntaxe:</div>
              <pre className="p-4 rounded-xl bg-slate-900 text-indigo-300 overflow-x-auto leading-5">
                {selected.csharpSyntax}
              </pre>
            </div>
          )}
        </div>

        {/* Explanation & Guru Tip */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              {selected.name}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {selected.meaning}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center space-x-1.5 font-bold mb-1">
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Jak to poznat v diagramu u zkoušky:</span>
            </div>
            <p className="leading-relaxed">{selected.guruTip}</p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
            <span>Příklad v praxi: <strong className="text-slate-800 dark:text-slate-200">{selected.example}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
