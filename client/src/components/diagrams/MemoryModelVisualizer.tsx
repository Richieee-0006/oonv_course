import React, { useState } from 'react';
import { RotateCcw, Box, HardDrive, AlertCircle } from 'lucide-react';

export const MemoryModelVisualizer: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  const steps = [
    {
      title: 'Krok 0: Výchozí stav (inicializace paměti)',
      csharpLine: '// Prázdný stav před vykonáním kódu',
      stack: [],
      heap: [],
      explanation: 'Zatím nebyly alokovány žádné proměnné na zásobníku (Stack) ani v haldě (Heap).'
    },
    {
      title: 'Krok 1: Vytvoření první reference',
      csharpLine: 'UkazkaZakladu a = new UkazkaZakladu("Původní", 42);',
      stack: [
        { name: 'a (typ: UkazkaZakladu)', value: 'Ukazatel: 0x4F2A', color: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' }
      ],
      heap: [
        { address: '0x4F2A', type: 'UkazkaZakladu', data: '{ Nazev: "Původní", Hodnota: 42 }', refBy: ['a'], color: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' }
      ],
      explanation: 'Levá strana (a): krabice na Stacku s nálepkou typu. Pravá strana (new): alokace reálného objektu v RAM na Heap (adresa 0x4F2A).'
    },
    {
      title: 'Krok 2: Přiřazení b = a (Zkopírování POUZE ukazatele)',
      csharpLine: 'UkazkaZakladu b = a;',
      stack: [
        { name: 'a (typ: UkazkaZakladu)', value: 'Ukazatel: 0x4F2A', color: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' },
        { name: 'b (typ: UkazkaZakladu)', value: 'Ukazatel: 0x4F2A', color: 'border-purple-500 bg-purple-50 dark:bg-purple-950/50' }
      ],
      heap: [
        { address: '0x4F2A', type: 'UkazkaZakladu', data: '{ Nazev: "Původní", Hodnota: 42 }', refBy: ['a', 'b'], color: 'border-purple-500 bg-purple-50 dark:bg-purple-950/40' }
      ],
      explanation: 'ZKOUŠKOVÝ CHYTÁK: Při b = a se nevytvoří nový objekt! Zkopíruje se POUZE adresa ukazatele (0x4F2A). Obě proměnné a i b nyní míří na stejný objekt na Heap!'
    },
    {
      title: 'Krok 3: Změna přes b.Nazev = "Změněno"',
      csharpLine: 'b.Nazev = "Změněno";',
      stack: [
        { name: 'a (typ: UkazkaZakladu)', value: 'Ukazatel: 0x4F2A', color: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' },
        { name: 'b (typ: UkazkaZakladu)', value: 'Ukazatel: 0x4F2A', color: 'border-purple-500 bg-purple-50 dark:bg-purple-950/50' }
      ],
      heap: [
        { address: '0x4F2A', type: 'UkazkaZakladu', data: '{ Nazev: "Změněno", Hodnota: 42 }', refBy: ['a', 'b'], color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40' }
      ],
      explanation: 'DŮSLEDEK: Pokud nyní přečtete a.Nazev, vrátí "Změněno"! Tímto dochází k tzv. referenčnímu aliasingu v RAM.'
    },
    {
      title: 'Krok 4: Chyták se String Immutability',
      csharpLine: 'string s1 = "ahoj"; string s2 = s1; s1 += " světe";',
      stack: [
        { name: 's1 (typ: string)', value: 'Ukazatel: 0x88CC', color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
        { name: 's2 (typ: string)', value: 'Ukazatel: 0x77AA', color: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/50' }
      ],
      heap: [
        { address: '0x77AA', type: 'string', data: '"ahoj"', refBy: ['s2'], color: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40' },
        { address: '0x88CC', type: 'string', data: '"ahoj světe"', refBy: ['s1'], color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' }
      ],
      explanation: 'U stringu je to jinak! String je na Heap, ale je NEMĚNNÝ (immutable). Operace s1 += " světe" nemění původní řetězec, ale vytvoří v RAM ZCELA NOVÝ objekt. s2 zůstává "ahoj"!'
    }
  ];

  const current = steps[step];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              RAM Model
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Mentální model: Stack (Zásobník) vs Heap (Halda v RAM)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Levá strana = nálepka na krabici (Stack) • Pravá strana = reálný objekt v paměti RAM (Heap)
          </p>
        </div>

        {/* Step Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            Předchozí
          </button>
          <span className="text-xs font-mono font-semibold px-2 text-slate-600 dark:text-slate-400">
            {step + 1} / {steps.length}
          </span>
          <button
            onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
            disabled={step === steps.length - 1}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors"
          >
            Další krok
          </button>
          <button
            onClick={() => setStep(0)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Resetovat krokování"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code line under inspection */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-300 mb-6 flex items-center justify-between">
        <span>{current.csharpLine}</span>
        <span className="text-[10px] text-slate-500 uppercase">{current.title}</span>
      </div>

      {/* Memory Visualization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* STACK Column */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 p-4">
          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Box className="w-4 h-4 text-indigo-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              STACK (Zásobník - lokální proměnné)
            </h4>
          </div>

          <div className="space-y-2 min-h-[120px]">
            {current.stack.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-6 text-center">Zásobník je prázdný</div>
            ) : (
              current.stack.map((item, i) => (
                <div key={i} className={`p-2.5 rounded-lg border text-xs font-mono ${item.color}`}>
                  <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{item.value}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* HEAP Column */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 p-4">
          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
            <HardDrive className="w-4 h-4 text-purple-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              HEAP (Halda - objekty v RAM)
            </h4>
          </div>

          <div className="space-y-2 min-h-[120px]">
            {current.heap.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-6 text-center">Halda je prázdná</div>
            ) : (
              current.heap.map((item, i) => (
                <div key={i} className={`p-2.5 rounded-lg border text-xs font-mono ${item.color}`}>
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>{item.type} @ {item.address}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Odkazy: {item.refBy.join(', ')}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-[11px] mt-1 font-semibold">{item.data}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Explanation Footer */}
      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex items-start space-x-3 text-xs text-slate-700 dark:text-slate-300">
        <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Výklad kroku:</strong> {current.explanation}
        </div>
      </div>
    </div>
  );
};
