import React, { useState } from 'react';
import { patternsData } from '../../data/patternsData';
import { patternCodeGuides } from '../../data/patternCodeGuides';
import { PatternCategory } from '../../types/patterns';
import { CodeEditor } from '../editor/CodeEditor';
import { RunnerOutput } from '../editor/RunnerOutput';
import { PatternUMLDiagram } from '../diagrams/PatternUMLDiagram';
import { runnerService } from '../../services/runnerService';
import { RunnerResult } from '../../types/runner';
import { storageService } from '../../services/storageService';
import {
  Search,
  CheckCircle2,
  BookOpen,
  Layers,
  Shield,
  Zap,
  Network,
  Code2,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export const PatternCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PatternCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPatternId, setSelectedPatternId] = useState<string>(patternsData[0].id);
  const [patternCodes, setPatternCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    patternsData.forEach(p => {
      initial[p.id] = storageService.getCode(`pattern_${p.id}`, p.csharpCode);
    });
    return initial;
  });
  const [runnerResult, setRunnerResult] = useState<RunnerResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);

  const selectedPattern = patternsData.find(p => p.id === selectedPatternId) || patternsData[0];
  const currentCode = patternCodes[selectedPattern.id] || selectedPattern.csharpCode;
  const codeGuide = patternCodeGuides[selectedPattern.id];

  const filteredPatterns = patternsData.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.czechName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.intent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCodeChange = (newCode: string) => {
    setPatternCodes(prev => ({ ...prev, [selectedPattern.id]: newCode }));
    storageService.saveCode(`pattern_${selectedPattern.id}`, newCode);
  };

  const handleRun = async () => {
    setIsRunning(true);
    const res = await runnerService.runCSharp(currentCode);
    setRunnerResult(res);
    setIsRunning(false);
    if (res.success) {
      storageService.markCompleted(`pattern_${selectedPattern.id}`);
    }
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    const res = await runnerService.buildCSharp(currentCode);
    setRunnerResult(res);
    setIsBuilding(false);
  };

  const handleResetCode = () => {
    handleCodeChange(selectedPattern.csharpCode);
    setRunnerResult(null);
  };

  const progress = storageService.getProgress();

  const categoryLabels: Record<PatternCategory, string> = {
    creational: 'Vytvářející (Týdny 6–7)',
    structural: 'Strukturální (Týdny 8–9)',
    behavioral: 'Chování (Týdny 10–11)'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ============================================================
            HTML5 <aside> — Left Navigation Sidebar for 16 GoF Patterns
           ============================================================ */}
        <aside
          aria-label="Seznam návrhových vzorů"
          className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
        >
          <div className="mb-3">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
              Katalog 16 návrhových vzorů
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Vyber vzor ze seznamu pro detail a kód
            </p>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hledat vzor (Proxy, Adapter...)"
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Filter Pills */}
          <nav aria-label="Filtr kategorií vzorů" className="grid grid-cols-4 gap-1 mb-4">
            {([
              { id: 'all', label: 'Vše' },
              { id: 'creational', label: 'Vytv.' },
              { id: 'structural', label: 'Strukt.' },
              { id: 'behavioral', label: 'Chov.' }
            ] as const).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-1 px-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          {/* Grouped Pattern List */}
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            {(['creational', 'structural', 'behavioral'] as PatternCategory[]).map((cat) => {
              const items = filteredPatterns.filter(p => p.category === cat);
              if (items.length === 0) return null;

              return (
                <div key={cat}>
                  <div className="px-2 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {categoryLabels[cat]}
                  </div>
                  <ul className="space-y-1">
                    {items.map((pat) => {
                      const isSelected = pat.id === selectedPatternId;
                      const isDone = !!progress[`pattern_${pat.id}`];
                      return (
                        <li key={pat.id}>
                          <button
                            onClick={() => {
                              setSelectedPatternId(pat.id);
                              setRunnerResult(null);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <div className="text-xs leading-tight">{pat.name}</div>
                              <div className={`text-[11px] truncate ${
                                isSelected ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                              }`}>
                                {pat.czechName}
                              </div>
                            </div>
                            {isDone && (
                              <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${
                                isSelected ? 'text-white' : 'text-emerald-500'
                              }`} />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ============================================================
            HTML5 <article> — Single-Column Linear Reading Flow
           ============================================================ */}
        <article className="flex-1 min-w-0 w-full space-y-6">
          {/* 1. <header>: Pattern Title, Intent & Exam Takeaway */}
          <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                selectedPattern.category === 'creational'
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : selectedPattern.category === 'structural'
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}>
                {categoryLabels[selectedPattern.category]}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {selectedPattern.name} <span className="text-slate-400 dark:text-slate-500 font-normal">({selectedPattern.czechName})</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Hlavní účel:</strong> {selectedPattern.intent}
            </p>

            <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start space-x-2.5">
              <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-700 dark:text-indigo-300">Zkoušková pointa v 1 větě: </strong>
                {selectedPattern.keyTakeaway}
              </div>
            </div>
          </header>

          {/* 2. <section>: Proč, Kdy a Jak vzor použít */}
          <section aria-labelledby="sec-when-why" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 id="sec-when-why" className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <span>1. Proč a kdy je vzor {selectedPattern.name} vhodný</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                <h3 className="font-bold text-rose-900 dark:text-rose-300 text-xs uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-rose-500" />
                  <span>Problém (Co by se stalo bez vzoru)</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedPattern.problem}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-xs uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Řešení (Jak to vzor vyřeší)</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedPattern.solution}
                </p>
              </div>
            </div>

            {codeGuide && (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
                    Kdy vzor nasadit v praxi a u zápočtu:
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc pl-5 leading-relaxed">
                    {codeGuide.whenToUse.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-800 dark:text-amber-300">Kdy ho naopak NEPOUŽÍVAT: </strong>
                    {codeGuide.whenNotToUse}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 3. <section>: Anatomie C# kódu krok za krokem */}
          {codeGuide && (
            <section aria-labelledby="sec-anatomy" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 id="sec-anatomy" className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Code2 className="w-5 h-5 text-indigo-500" />
                <span>2. Anatomie C# kódu (Jak a proč vzor uvnitř funguje)</span>
              </h2>

              <ol className="space-y-4">
                {codeGuide.codeAnatomy.map((part, idx) => (
                  <li key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {part.step}
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto">
                      {part.codeLine}
                    </pre>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Proč to funguje: </strong>
                      {part.whyItWorks}
                    </p>
                  </li>
                ))}
              </ol>

              {selectedPattern.pythonComparisonNote && (
                <div className="p-3.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                  <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Rozdíl oproti Pythonu:</strong> {selectedPattern.pythonComparisonNote}</span>
                </div>
              )}
            </section>
          )}

          {/* 4. <section>: Živý C# Kód a Výstupní konzole pod sebou */}
          <section aria-labelledby="sec-live-code" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 id="sec-live-code" className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-emerald-500" />
                <span>3. Kompletní spustitelný C# kód vzoru ({selectedPattern.name})</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Klikni na „Spustit v C#“ (Ctrl+Enter) pro reálný překlad přes .NET
              </span>
            </div>

            <div className="space-y-4">
              <CodeEditor
                code={currentCode}
                onChange={handleCodeChange}
                onRun={handleRun}
                onBuild={handleBuild}
                onReset={handleResetCode}
                isRunning={isRunning}
                isBuilding={isBuilding}
                diagnostics={runnerResult?.diagnostics}
                title={`${selectedPattern.name} (${selectedPattern.czechName})`}
                minHeight="380px"
              />

              <RunnerOutput
                result={runnerResult}
                isRunning={isRunning || isBuilding}
                onClear={() => setRunnerResult(null)}
              />
            </div>
          </section>

          {/* 5. <section>: UML Diagram, Role tříd a Srovnání */}
          <section aria-labelledby="sec-uml" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 id="sec-uml" className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Network className="w-5 h-5 text-indigo-500" />
              <span>4. UML diagram tříd a srovnání s podobnými vzory</span>
            </h2>

            <PatternUMLDiagram patternKey={selectedPattern.umlSvgKey} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-purple-500" />
                  <span>Role tříd v kódu:</span>
                </h3>
                <ul className="space-y-2">
                  {selectedPattern.participants.map((p, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 text-xs">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{p.name}: </span>
                      <span className="text-slate-600 dark:text-slate-300">{p.role}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>S čím si vzor neplést:</span>
                </h3>
                <ul className="space-y-2">
                  {selectedPattern.similarPatterns.map((sim, i) => (
                    <li key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 text-xs">
                      <strong className="text-indigo-600 dark:text-indigo-400">{sim.name}: </strong>
                      <span className="text-slate-600 dark:text-slate-300">{sim.difference}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};
