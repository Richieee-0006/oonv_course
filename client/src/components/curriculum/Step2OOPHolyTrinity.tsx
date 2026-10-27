import React, { useState } from 'react';
import { accessModifiersData, step2CodeExamples } from '../../data/theoryData';
import { CodeEditor } from '../editor/CodeEditor';
import { RunnerOutput } from '../editor/RunnerOutput';
import { UMLArrowInteractive } from '../diagrams/UMLArrowInteractive';
import { runnerService } from '../../services/runnerService';
import { RunnerResult } from '../../types/runner';
import { Layers, ShieldCheck, Sparkles, Bookmark } from 'lucide-react';

export const Step2OOPHolyTrinity: React.FC = () => {
  const [code, setCode] = useState<string>(step2CodeExamples.holyTrinityPolymorphism);
  const [runnerResult, setRunnerResult] = useState<RunnerResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [selectedModifier, setSelectedModifier] = useState<string>('protected');

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

  const activeModInfo = accessModifiersData.find(m => m.modifier === selectedModifier) || accessModifiersData[0];

  return (
    <article className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          <span>Kroky 2 &amp; 3 / Sylabus Týdny 1–5 ke zkoušce</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Svatá trojice OOP &amp; Zkoušková teorie C#
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Klíčová látka pro zkoušku: typový systém, řízený polymorfismus (<strong>virtual/override</strong> vs <strong>new</strong>),
          VTABLE dynamická vazba, <strong>6 specifikátorů přístupu</strong>, povinné volání <code>: base(...)</code> a 2 zlatá pravidla GoF.
        </p>
      </header>

      {/* 2 Golden Rules of GoF Banner */}
      <section aria-label="2 zlatá pravidla GoF" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/80 to-white dark:from-indigo-950/30 dark:to-slate-900 shadow-sm flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            1
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              &quot;Programuj vůči rozhraní, nikoliv vůči implementaci&quot;
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              V proměnných, polích a parametrech metod používejte typ rozhraní (<code>IPlatebniBrana</code>), nikoliv konkrétní třídu. Umožňuje polymorfní výměnu.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-r from-purple-50/80 to-white dark:from-purple-950/30 dark:to-slate-900 shadow-sm flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            2
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              &quot;Upřednostňuj kompozici objektů před dědičností tříd&quot;
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Místo rigidních hierarchií vložte vnitřní objekt jako soukromé pole a vstříkněte jej přes konstruktor (Dependency Injection).
            </p>
          </div>
        </div>
      </section>

      {/* Interactive UML Arrows */}
      <section aria-label="Překlad UML šipek do C#">
        <UMLArrowInteractive />
      </section>

      {/* VTABLE vs Static Binding Comparison Card */}
      <section aria-labelledby="sec-vtable" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 id="sec-vtable" className="font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span>Zkouškový přehled: Virtual vs Override vs New vs Sealed</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
            <div>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">virtual</span>
              <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Předek definuje výchozí tělo metody a zapisuje odkaz do <strong>VTABLE</strong>. Umožňuje potomkům metodu polymorfně přepsat.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-mono">Předek: public virtual void M()</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
            <div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">override</span>
              <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Potomek <strong>přepisuje záznam ve VTABLE</strong>. Volání přes referenci typu předka (<code>Rodic r = new Potomek()</code>) zavolá potomka!
              </p>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-mono">Potomek: public override void M()</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
            <div>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">new (shadowing)</span>
              <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Potomek <strong>zastíní</strong> metodu předka. NEZAPISUJE se do vtable! Volá se staticky podle typu proměnné (<code>Rodic</code> zavolá rodiče).
              </p>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-mono">Potomek: public new void M()</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
            <div>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">sealed override</span>
              <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Potomek metodu přepíše, ale <strong>uzamkne</strong> ji před dalším přepisováním v nižších generacích potomků.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-mono">public sealed override void M()</div>
          </div>
        </div>
      </section>

      {/* 6 Access Modifiers Matrix */}
      <section aria-labelledby="sec-modifiers" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 id="sec-modifiers" className="font-bold text-slate-900 dark:text-white text-lg flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <span>Matice všech 6 specifikátorů přístupu v C#</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Vyberte modifikátor pro detailní zkouškový výklad.
            </p>
          </div>

          {/* Quick Filter buttons */}
          <div className="flex flex-wrap gap-1.5">
            {accessModifiersData.map((m) => (
              <button
                key={m.modifier}
                onClick={() => setSelectedModifier(m.modifier)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  selectedModifier === m.modifier
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {m.modifier}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-2.5">Modifikátor</th>
                <th className="p-2.5 text-center">Stejná třída</th>
                <th className="p-2.5 text-center">Potomek (stejný projekt)</th>
                <th className="p-2.5 text-center">Cizí třída (stejný projekt)</th>
                <th className="p-2.5 text-center">Potomek (cizí projekt)</th>
                <th className="p-2.5 text-center">Cizí třída (cizí projekt)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
              {accessModifiersData.map((m) => (
                <tr
                  key={m.modifier}
                  onClick={() => setSelectedModifier(m.modifier)}
                  className={`cursor-pointer transition-colors ${
                    selectedModifier === m.modifier
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 font-bold'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="p-2.5 text-indigo-600 dark:text-indigo-400 font-bold">{m.modifier}</td>
                  <td className="p-2.5 text-center">{m.sameClass ? '✅' : '❌'}</td>
                  <td className="p-2.5 text-center">{m.derivedClassSameAssembly ? '✅' : '❌'}</td>
                  <td className="p-2.5 text-center">{m.otherClassSameAssembly ? '✅' : '❌'}</td>
                  <td className="p-2.5 text-center">{m.derivedClassOtherAssembly ? '✅' : '❌'}</td>
                  <td className="p-2.5 text-center">{m.otherClassOtherAssembly ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail of selected modifier */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs">
          <Bookmark className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-slate-900 dark:text-white font-mono">
              {activeModInfo.modifier} ({activeModInfo.czechName})
            </div>
            <p className="text-slate-600 dark:text-slate-300">{activeModInfo.description}</p>
            <p className="text-amber-600 dark:text-amber-400 font-semibold">{activeModInfo.examNote}</p>
          </div>
        </div>
      </section>

      {/* Runnable Code: Zamestnanec & Programator */}
      <section aria-labelledby="sec-step2-code" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 id="sec-step2-code" className="font-bold text-slate-900 dark:text-white text-lg">
            Spustitelná demonstrace: Zaměstnanec, Programátor &amp; VTABLE
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Vyzkoušej si chování <code>override</code> vs <code>new</code> a bezpečné přetypování pomocí <code>is</code> a <code>as</code>.
          </p>
        </div>

        <div className="space-y-4">
          <CodeEditor
            code={code}
            onChange={setCode}
            onRun={handleRun}
            onBuild={handleBuild}
            onReset={() => setCode(step2CodeExamples.holyTrinityPolymorphism)}
            isRunning={isRunning}
            isBuilding={isBuilding}
            diagnostics={runnerResult?.diagnostics}
            title="Zamestnanec & Programator"
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
