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
import { Sparkles, Search, CheckCircle2, BookOpen, Layers, Shield, Zap, Network, Code2, HelpCircle, AlertTriangle } from 'lucide-react';

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

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Catalog Header */}
      <div className="bg-gradient-to-br from-indigo-900/30 via-slate-900/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Kroky 4 & 5 / Kompletní katalog sylabu</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Katalog všech 16 návrhových vzorů GoF
        </h2>
          <div className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed space-y-2">
          <p>
            Hlavní důraz u každého vzoru je na <strong>samotný C# kód (anatomii vzoru)</strong> a na pochopení
            <strong> KDY, JAK a PROČ vzor funguje a kdy je vhodný</strong> (včetně UML diagramu a živého spuštění přes <code>dotnet</code>).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Všechny vzory (16)
          </button>
          <button
            onClick={() => setSelectedCategory('creational')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'creational'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Vytvářející (4)
          </button>
          <button
            onClick={() => setSelectedCategory('structural')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'structural'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Strukturální (7)
          </button>
          <button
            onClick={() => setSelectedCategory('behavioral')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'behavioral'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Chování (5)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hledat vzor (např. Proxy, Adapter)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Pattern Selector Cards (Horizontal or Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {filteredPatterns.map((pat) => {
          const isSelected = pat.id === selectedPatternId;
          const isDone = !!progress[`pattern_${pat.id}`];
          return (
            <button
              key={pat.id}
              onClick={() => {
                setSelectedPatternId(pat.id);
                setRunnerResult(null);
              }}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono uppercase font-bold ${
                    isSelected ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {pat.category.slice(0, 4)}
                  </span>
                  {isDone && (
                    <CheckCircle2 className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                  )}
                </div>
                <div className="font-bold text-xs leading-snug">{pat.name}</div>
              </div>
              <div className={`text-[10px] mt-1.5 truncate ${
                isSelected ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {pat.czechName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Pattern Inspection View */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {/* Pattern Banner */}
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                selectedPattern.category === 'creational'
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : selectedPattern.category === 'structural'
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}>
                {selectedPattern.category} vzor
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {selectedPattern.syllabusWeek}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {selectedPattern.name} ({selectedPattern.czechName})
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
              <strong>Záměr:</strong> {selectedPattern.intent}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 max-w-sm text-xs space-y-1">
            <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Zkouškový tahák:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedPattern.keyTakeaway}
            </p>
          </div>
        </div>

        {/* Problem, Solution & Comparisons Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-200 dark:border-slate-800">
          {/* Problem */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
            <h4 className="font-bold text-rose-900 dark:text-rose-300 text-sm mb-2 flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-rose-500" />
              <span>Proč vzniká problém (Bez vzoru)</span>
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedPattern.problem}
            </p>
          </div>

          {/* Solution */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm mb-2 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Jak a proč to vzor řeší v C#</span>
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedPattern.solution}
            </p>
          </div>

          {/* Similar Patterns */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm mb-2 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Srovnání (S čím si ho neplést)</span>
            </h4>
            <div className="space-y-2 text-xs">
              {selectedPattern.similarPatterns.map((sim, i) => (
                <div key={i} className="text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400">{sim.name}:</strong>{' '}
                  <span className="text-[11px]">{sim.difference}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KDY A PROČ JE VZOR VHODNÝ + ANATOMIE C# KÓDU */}
        {codeGuide && (
          <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Kdy a proč vzor použít vs kdy ne */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-sm">
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm mb-2.5 flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Kdy a proč je {selectedPattern.name} vhodný:</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                    {codeGuide.whenToUse.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-sm">
                  <h4 className="font-bold text-amber-800 dark:text-amber-300 text-xs mb-1.5 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>Kdy vzor naopak NEPOUŽÍVAT:</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {codeGuide.whenNotToUse}
                  </p>
                </div>
              </div>

              {/* Right: Anatomie C# kódu krok za krokem */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span>Anatomie C# kódu: Jak a proč vzor uvnitř funguje (3 klíčové kroky)</span>
                </h4>
                <div className="space-y-3">
                  {codeGuide.codeAnatomy.map((part, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                        {part.step}
                      </div>
                      <pre className="p-2 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto mb-1.5">
                        {part.codeLine}
                      </pre>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        <strong className="text-slate-800 dark:text-slate-200">Proč to funguje:</strong> {part.whyItWorks}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Code Editor & Runner Section (Prominent right below Anatomy!) */}
        <div className="p-6 sm:p-8 space-y-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Kompletní C# kód vzoru se spustitelnou metodou Main()
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              Klikněte na &quot;Spustit v C#&quot; (nebo Ctrl+Enter) pro reálný překlad přes Roslyn
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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
              minHeight="420px"
            />

            <RunnerOutput
              result={runnerResult}
              isRunning={isRunning || isBuilding}
              onClear={() => setRunnerResult(null)}
            />
          </div>
        </div>

        {/* Python vs C# Note if available */}
        {selectedPattern.pythonComparisonNote && (
          <div className="px-6 py-3 bg-amber-50/40 dark:bg-amber-950/20 border-b border-slate-200 dark:border-slate-800 text-xs text-amber-900 dark:text-amber-200 flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span><strong>Python vs. C# postřeh:</strong> {selectedPattern.pythonComparisonNote}</span>
          </div>
        )}

        {/* UML Description & Architecture Participants */}
        <div className="p-6 sm:p-8 bg-slate-50/40 dark:bg-slate-950/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* UML Structure */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center space-x-1.5">
                <Network className="w-4 h-4 text-indigo-500" />
                <span>UML diagram &amp; vazby tříd</span>
              </h4>
              <PatternUMLDiagram patternKey={selectedPattern.umlSvgKey} />
              <div className="mt-2 p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-[11px] text-indigo-600 dark:text-indigo-300 border border-slate-200/80 dark:border-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                {selectedPattern.umlDescription}
              </div>
            </div>

            {/* Architecture Participants */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-purple-500" />
                <span>Účastníci v kódu (Role jednotlivých tříd)</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Rozdělení odpovědností jednotlivých tříd a rozhraní v C# implementaci:
              </p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedPattern.participants.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70">
                    <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                      {p.name}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 text-xs mt-0.5 leading-relaxed">
                      {p.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
