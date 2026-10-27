import React, { useState } from 'react';
import { pythonVsCSharpComparisons, step1CodeExamples } from '../../data/theoryData';
import { CodeEditor } from '../editor/CodeEditor';
import { RunnerOutput } from '../editor/RunnerOutput';
import { MemoryModelVisualizer } from '../diagrams/MemoryModelVisualizer';
import { runnerService } from '../../services/runnerService';
import { RunnerResult } from '../../types/runner';
import { Cpu, BookOpen } from 'lucide-react';

export const Step1UnderTheHood: React.FC = () => {
  const [activeCodeExample, setActiveCodeExample] = useState<'stackVsHeap' | 'uzivatelDemo'>('stackVsHeap');
  const [code, setCode] = useState<string>(step1CodeExamples.stackVsHeap);
  const [runnerResult, setRunnerResult] = useState<RunnerResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);

  const handleSelectExample = (key: 'stackVsHeap' | 'uzivatelDemo') => {
    setActiveCodeExample(key);
    setCode(step1CodeExamples[key]);
    setRunnerResult(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    const res = await runnerService.runCSharp(code);
    setRunnerResult(res);
    setIsRunning(false);
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    const res = await runnerService.buildCSharp(code);
    setRunnerResult(res);
    setIsBuilding(false);
  };

  return (
    <article className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero / Introduction */}
      <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <Cpu className="w-4 h-4" />
          <span>Krok 1 / Sylabus Týden 1</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Jak funguje C# pod kapotou &amp; Přechod z Pythonu
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Při přechodu z dynamického Pythonu do statického C# musíme pochopit dvoufázový překladový model,
          rozdělení paměti na <strong>Stack</strong> a <strong>Heap</strong> a mentální pravidlo: 
          <em> Levá strana je nálepka na krabici pro kompilátor Roslyn, pravá strana je reálný objekt alokovaný v RAM.</em>
        </p>
      </header>

      {/* Roslyn -> IL -> JIT Pipeline */}
      <section aria-labelledby="sec-roslyn" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            Dvoufázová kompilace
          </span>
          <h2 id="sec-roslyn" className="font-bold text-slate-900 dark:text-white text-lg">
            Roslyn Compiler ➔ CIL (IL) ➔ CLR / JIT Runtime
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">1. Fáze: Kompilace</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">Compile-time</span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Roslyn Compiler (.NET SDK)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Vezme vaše zdrojové soubory <code>.cs</code>, zkontroluje typovou bezpečnost, syntaxi a přeloží je do mezijazyka <strong>Intermediate Language (IL / CIL)</strong> uloženého v <code>.dll</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">2. Mezikód: Bytecode</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono">Assembly</span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">CIL / MSIL (.dll sestava)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Platformově nezávislý instrukční kód. Stejné <code>.dll</code> spustíte na Linuxu, Windows i macOS díky runtime virtualizaci.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">3. Fáze: Spuštění</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono">Runtime</span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">CLR & JIT (Just-In-Time)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Při spuštění <strong>Common Language Runtime (CLR)</strong> zavolá JIT kompilátor, který IL kód přeloží přímo do nativních strojových instrukcí konkrétního procesoru (x64 / ARM64).
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Memory Model Visualizer */}
      <section aria-label="Vizualizér paměti Stack a Heap">
        <MemoryModelVisualizer />
      </section>

      {/* Python vs C# Comparison Table */}
      <section aria-labelledby="sec-py-cs" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <h2 id="sec-py-cs" className="font-bold text-slate-900 dark:text-white text-lg">
            Srovnávací tabulka: Přechod z Pythonu do C#
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">Koncept</th>
                <th className="p-3">Python Syntax</th>
                <th className="p-3">C# Syntax</th>
                <th className="p-3">Dopad a vysvětlení</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs">
              {pythonVsCSharpComparisons.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold font-sans text-slate-900 dark:text-white">{c.feature}</td>
                  <td className="p-3 text-amber-600 dark:text-amber-400 whitespace-pre">{c.pythonSyntax}</td>
                  <td className="p-3 text-indigo-600 dark:text-indigo-400 whitespace-pre">{c.csharpSyntax}</td>
                  <td className="p-3 font-sans text-slate-600 dark:text-slate-300 text-xs">{c.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Runnable Code Sandbox for Step 1 */}
      <section aria-labelledby="sec-step1-code" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 id="sec-step1-code" className="font-bold text-slate-900 dark:text-white text-lg">
              Vyzkoušej si kód v reálném .NET SDK runneru
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Přepínej mezi ukázkami paměti a třídou Uzivatel, upravuj kód a sleduj výstup v konzoli pod editorem.
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleSelectExample('stackVsHeap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCodeExample === 'stackVsHeap'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              1. Stack vs Heap &amp; String
            </button>
            <button
              onClick={() => handleSelectExample('uzivatelDemo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCodeExample === 'uzivatelDemo'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              2. Třída Uzivatel &amp; Zapouzdření
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <CodeEditor
            code={code}
            onChange={setCode}
            onRun={handleRun}
            onBuild={handleBuild}
            onReset={() => setCode(step1CodeExamples[activeCodeExample])}
            isRunning={isRunning}
            isBuilding={isBuilding}
            diagnostics={runnerResult?.diagnostics}
            title={activeCodeExample === 'stackVsHeap' ? 'Stack vs Heap Ukázka' : 'Uzivatel Demo'}
          />

          <RunnerOutput
            result={runnerResult}
            isRunning={isRunning || isBuilding}
            onClear={() => setRunnerResult(null)}
          />
        </div>
      </section>
    </article>
  );
};
