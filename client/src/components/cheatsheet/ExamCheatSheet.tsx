import React, { useState, useMemo } from 'react';
import {
  SCOPE_DEFINITIONS,
  ACCESS_MODIFIERS_DATA,
  UML_ARROWS_DATA,
  PATTERNS_QUICK_SUMMARY,
  EXAM_TRAPS_DATA,
  ScopeKey,
  AccessModifierInfo,
  UmlArrowRelation,
  PatternQuickSummary,
  ExamTrapItem
} from '../../data/cheatsheetData';
import {
  Shield,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  BookOpen,
  ArrowRight,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

export type CheatSheetSection = 'modifiers' | 'uml' | 'patterns' | 'traps';

interface ExamCheatSheetProps {
  initialSection?: CheatSheetSection;
  onSelectPattern?: (patternId: string) => void;
  onNavigateToTab?: (tab: string, section?: string) => void;
}

export const ExamCheatSheet: React.FC<ExamCheatSheetProps> = ({
  initialSection = 'modifiers',
  onSelectPattern
}) => {
  const [activeSection, setActiveSection] = useState<CheatSheetSection>(initialSection);

  // --- 1. Access Modifiers State ---
  const [selectedModifierId, setSelectedModifierId] = useState<string>(ACCESS_MODIFIERS_DATA[1].id); // default 'protected-internal'
  const [filterScope, setFilterScope] = useState<ScopeKey | 'all'>('all');

  // --- 2. UML Arrows State ---
  const [selectedArrowId, setSelectedArrowId] = useState<string>(UML_ARROWS_DATA[0].id);

  // --- 3. 16 Patterns in 1 Minute State ---
  const [patternSearch, setPatternSearch] = useState<string>('');
  const [patternCategory, setPatternCategory] = useState<'all' | 'creational' | 'structural' | 'behavioral'>('all');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // --- 4. 5 Exam Traps State ---
  const [openTraps, setOpenTraps] = useState<Record<string, boolean>>({
    'vtable-vs-static-bind': true,
    'value-vs-ref-assignment': true
  });

  const toggleTrap = (id: string) => {
    setOpenTraps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setAllTraps = (open: boolean) => {
    const updated: Record<string, boolean> = {};
    EXAM_TRAPS_DATA.forEach(t => {
      updated[t.id] = open;
    });
    setOpenTraps(updated);
  };

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId(prev => (prev === id ? null : prev));
    }, 2000);
  };

  const selectedModifier = useMemo(
    () => ACCESS_MODIFIERS_DATA.find(m => m.id === selectedModifierId) || ACCESS_MODIFIERS_DATA[0],
    [selectedModifierId]
  );

  const selectedArrow = useMemo(
    () => UML_ARROWS_DATA.find(a => a.id === selectedArrowId) || UML_ARROWS_DATA[0],
    [selectedArrowId]
  );

  const filteredPatterns = useMemo(() => {
    return PATTERNS_QUICK_SUMMARY.filter(p => {
      const matchCat = patternCategory === 'all' || p.category === patternCategory;
      const q = patternSearch.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.czechName.toLowerCase().includes(q) ||
        p.intent.toLowerCase().includes(q) ||
        p.oneLinerCsharp.toLowerCase().includes(q) ||
        p.examKey.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [patternCategory, patternSearch]);

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <header className="rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-900/0 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900/40 p-6 sm:p-8 backdrop-blur shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zkouškový tahák & Rychlý rozcestník</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              C# & OONV Zkouškový Tahák
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Všechny klíčové koncepty na jednom místě: matice všech 6 specifikátorů přístupu,
              dekodér UML šipek do C#, bleskový přehled 16 GoF vzorů a 5 nejčastějších zkouškových chytáků.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              6 Specifikátorů
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              6 UML Vztahů
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              16 GoF Vzorů
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 font-mono font-semibold">
              5 Chytáků
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <nav aria-label="Sekce zkouškového taháku" className="mt-8 border-t border-slate-200 dark:border-slate-800/80 pt-4">
          <ul className="flex flex-wrap gap-2">
            {[
              { id: 'modifiers', label: '1. Matice specifikátorů (6)', icon: Shield },
              { id: 'uml', label: '2. UML Převodník šipek (6)', icon: Layers },
              { id: 'patterns', label: '3. 16 Vzorů za 1 minutu', icon: Sparkles },
              { id: 'traps', label: '4. 5 Zkouškových pastí', icon: AlertTriangle }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveSection(tab.id as CheatSheetSection)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 dark:bg-indigo-600 dark:text-white'
                        : 'bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* ========================================================================= */}
      {/* SECTION 1: MATICE SPECIFIKÁTORŮ PŘÍSTUPU */}
      {/* ========================================================================= */}
      {activeSection === 'modifiers' && (
        <section aria-labelledby="heading-modifiers" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 id="heading-modifiers" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                <span>Matice specifikátorů přístupu (Access Modifiers Matrix)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Porovnání viditelnosti v C# napříč 5 oblastmi. Kliknutím na řádek zobrazíte detail, mnemotechnickou pomůcku a kód.
              </p>
            </div>

            {/* Filter by scope */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Zvýraznit rozsah:</span>
              <select
                value={filterScope}
                onChange={e => setFilterScope(e.target.value as ScopeKey | 'all')}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Všechny sloupce</option>
                {SCOPE_DEFINITIONS.map(s => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Matrix Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 text-slate-700 dark:text-slate-300 font-semibold">
                  <th className="py-3.5 px-4 min-w-[160px]">Specifikátor</th>
                  {SCOPE_DEFINITIONS.map(scope => (
                    <th
                      key={scope.key}
                      className={`py-3.5 px-3 text-center transition-colors min-w-[120px] ${
                        filterScope === scope.key
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold'
                          : ''
                      }`}
                      title={scope.description}
                    >
                      <div className="font-semibold">{scope.shortLabel}</div>
                      <div className="text-[10px] font-normal text-slate-400 hidden sm:block">
                        {scope.description}
                      </div>
                    </th>
                  ))}
                  <th className="py-3.5 px-4 text-center min-w-[100px]">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {ACCESS_MODIFIERS_DATA.map(mod => {
                  const isSelected = selectedModifierId === mod.id;
                  return (
                    <tr
                      key={mod.id}
                      onClick={() => setSelectedModifierId(mod.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-inset ring-indigo-500/50'
                          : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <code className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm">
                            {mod.keyword}
                          </code>
                        </div>
                      </td>
                      {SCOPE_DEFINITIONS.map(scope => {
                        const isAllowed = mod.scopes[scope.key];
                        const isColHighlighted = filterScope === scope.key;
                        return (
                          <td
                            key={scope.key}
                            className={`py-3.5 px-3 text-center transition-colors ${
                              isColHighlighted ? 'bg-indigo-50/40 dark:bg-indigo-950/30' : ''
                            }`}
                          >
                            {isAllowed ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-xs">
                                <span className="text-xs">✕</span>
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedModifierId(mod.id);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100'
                          }`}
                        >
                          {isSelected ? 'Vybráno' : 'Zobrazit'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Modifier Detail Panel */}
          {selectedModifier && (
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {selectedModifier.name}
                      </h3>
                      <code className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold font-mono">
                        {selectedModifier.keyword}
                      </code>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selectedModifier.summary}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs">
                  <span className="font-bold">Mnemotechnická pomůcka: </span>
                  <span>{selectedModifier.mnemonic}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* Explanation & Watchout */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      Přesné pravidlo kompilátoru
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedModifier.ruleExplanation}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span>Zkouškový chyták</span>
                    </div>
                    <p className="leading-relaxed">{selectedModifier.examWatchout}</p>
                  </div>
                </div>

                {/* Example Code */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>C# Ukázka syntaxe</span>
                    </h4>
                    <button
                      onClick={() => handleCopyCode(selectedModifier.id, selectedModifier.exampleCode)}
                      className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1"
                    >
                      {copiedCodeId === selectedModifier.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Zkopírováno</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Kopírovat</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                    <code>{selectedModifier.exampleCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Quick defaults table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-500" />
              <span>Výchozí (Default) specifikátory v C#, když nic neuvedete:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Třída v namespace:</span>
                <code className="text-amber-600 dark:text-amber-400 font-bold font-mono">internal</code>
                <p className="text-[11px] text-slate-500 mt-1">
                  <code>class Foo {}</code> je viditelná jen v rámci aktuálního sestavení.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Člen třídy / struktury:</span>
                <code className="text-rose-600 dark:text-rose-400 font-bold font-mono">private</code>
                <p className="text-[11px] text-slate-500 mt-1">
                  Proměnné a metody bez modifikátoru jsou striktně privátní.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Člen rozhraní (interface):</span>
                <code className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">public</code>
                <p className="text-[11px] text-slate-500 mt-1">
                  Metody v <code>interface IFoo</code> jsou automaticky veřejný kontrakt.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: UML PŘEVODNÍK ŠIPEK */}
      {/* ========================================================================= */}
      {activeSection === 'uml' && (
        <section aria-labelledby="heading-uml" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 id="heading-uml" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                <span>UML Převodník šipek (UML to C# Syntax Decoder)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Jak číst všech 6 typů vazeb z diagramů Refactoring.Guru a jak je přesně zapsat v C#.
              </p>
            </div>
          </div>

          {/* Arrow Selection Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {UML_ARROWS_DATA.map(rel => {
              const isSelected = selectedArrowId === rel.id;
              return (
                <button
                  key={rel.id}
                  onClick={() => setSelectedArrowId(rel.id)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
                  }`}
                >
                  <div className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">
                    {rel.symbol}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs leading-tight">
                    {rel.name.split('/')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    {rel.relationshipKind}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Arrow Visualizer Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedArrow.name}
                  </h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {selectedArrow.nameEn}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {selectedArrow.description}
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400">Síla vazby: </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedArrow.couplingLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual SVG Diagram for the Selected Arrow */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-4">
                Vizuální UML Notace
              </span>
              <svg viewBox="0 0 540 120" className="w-full max-w-lg h-auto overflow-visible">
                <defs>
                  {/* Empty triangle for inheritance */}
                  <marker
                    id="marker-triangle-empty"
                    markerWidth="12"
                    markerHeight="12"
                    refX="11"
                    refY="6"
                    orient="auto"
                  >
                    <polygon points="1 1, 11 6, 1 11" fill="white" stroke="#6366f1" strokeWidth="1.5" />
                  </marker>

                  {/* Empty diamond for aggregation */}
                  <marker
                    id="marker-diamond-empty"
                    markerWidth="16"
                    markerHeight="12"
                    refX="1"
                    refY="6"
                    orient="auto"
                  >
                    <polygon points="1 6, 8 1, 15 6, 8 11" fill="white" stroke="#6366f1" strokeWidth="1.5" />
                  </marker>

                  {/* Filled diamond for composition */}
                  <marker
                    id="marker-diamond-filled"
                    markerWidth="16"
                    markerHeight="12"
                    refX="1"
                    refY="6"
                    orient="auto"
                  >
                    <polygon points="1 6, 8 1, 15 6, 8 11" fill="#6366f1" stroke="#6366f1" strokeWidth="1.5" />
                  </marker>

                  {/* Open arrow for association & dependency */}
                  <marker
                    id="marker-arrow-open"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="5"
                    orient="auto"
                  >
                    <polyline points="1 1, 9 5, 1 9" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                  </marker>
                </defs>

                {/* Left Box (Source) */}
                <g transform="translate(20, 20)">
                  <rect
                    width="140"
                    height="75"
                    rx="8"
                    className="fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700"
                    strokeWidth="1.5"
                  />
                  <rect width="140" height="24" rx="8" className="fill-slate-100 dark:fill-slate-800" />
                  <text
                    x="70"
                    y="16"
                    textAnchor="middle"
                    className="text-[12px] font-bold fill-slate-800 dark:fill-slate-200 font-sans"
                  >
                    {selectedArrow.id === 'inheritance'
                      ? 'Programator'
                      : selectedArrow.id === 'realization'
                      ? 'PlatebniKarta'
                      : selectedArrow.id === 'composition'
                      ? 'Auto'
                      : selectedArrow.id === 'aggregation'
                      ? 'NakupniKosik'
                      : selectedArrow.id === 'association'
                      ? 'Lekar'
                      : 'Generator'}
                  </text>
                  <text
                    x="12"
                    y="45"
                    className="text-[10px] font-mono fill-slate-500 dark:fill-slate-400"
                  >
                    {selectedArrow.id === 'composition'
                      ? '- _motor: Motor'
                      : selectedArrow.id === 'aggregation'
                      ? '- _brana: IBrana'
                      : selectedArrow.id === 'association'
                      ? '+ Pacient: Pacient'
                      : '+ Execute()'}
                  </text>
                </g>

                {/* Connector Arrow */}
                {selectedArrow.id === 'inheritance' && (
                  <path
                    d="M 160 55 L 368 55"
                    stroke="#6366f1"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#marker-triangle-empty)"
                  />
                )}
                {selectedArrow.id === 'realization' && (
                  <path
                    d="M 160 55 L 368 55"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeDasharray="6,4"
                    fill="none"
                    markerEnd="url(#marker-triangle-empty)"
                  />
                )}
                {selectedArrow.id === 'composition' && (
                  <path
                    d="M 172 55 L 370 55"
                    stroke="#6366f1"
                    strokeWidth="2"
                    fill="none"
                    markerStart="url(#marker-diamond-filled)"
                    markerEnd="url(#marker-arrow-open)"
                  />
                )}
                {selectedArrow.id === 'aggregation' && (
                  <path
                    d="M 172 55 L 370 55"
                    stroke="#6366f1"
                    strokeWidth="2"
                    fill="none"
                    markerStart="url(#marker-diamond-empty)"
                    markerEnd="url(#marker-arrow-open)"
                  />
                )}
                {selectedArrow.id === 'association' && (
                  <path
                    d="M 160 55 L 370 55"
                    stroke="#6366f1"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#marker-arrow-open)"
                  />
                )}
                {selectedArrow.id === 'dependency' && (
                  <path
                    d="M 160 55 L 370 55"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeDasharray="6,4"
                    fill="none"
                    markerEnd="url(#marker-arrow-open)"
                  />
                )}

                {/* Arrow Label */}
                <text
                  x="265"
                  y="45"
                  textAnchor="middle"
                  className="text-[11px] font-mono font-bold fill-indigo-600 dark:fill-indigo-400"
                >
                  {selectedArrow.relationshipKind}
                </text>

                {/* Right Box (Target) */}
                <g transform="translate(380, 20)">
                  <rect
                    width="140"
                    height="75"
                    rx="8"
                    className="fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700"
                    strokeWidth="1.5"
                  />
                  <rect width="140" height="24" rx="8" className="fill-slate-100 dark:fill-slate-800" />
                  <text
                    x="70"
                    y="16"
                    textAnchor="middle"
                    className="text-[12px] font-bold fill-slate-800 dark:fill-slate-200 font-sans"
                  >
                    {selectedArrow.id === 'inheritance'
                      ? 'Zamestnanec'
                      : selectedArrow.id === 'realization'
                      ? '«interface» IPlatebni'
                      : selectedArrow.id === 'composition'
                      ? 'Motor'
                      : selectedArrow.id === 'aggregation'
                      ? '«interface» IBrana'
                      : selectedArrow.id === 'association'
                      ? 'Pacient'
                      : 'Tiskarna'}
                  </text>
                  <text
                    x="12"
                    y="45"
                    className="text-[10px] font-mono fill-slate-500 dark:fill-slate-400"
                  >
                    {selectedArrow.id === 'realization' || selectedArrow.id === 'aggregation'
                      ? '+ Zaplat()'
                      : '+ Start()'}
                  </text>
                </g>
              </svg>
            </div>

            {/* Rules and C# Equivalent Code */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Životní cyklus a správa paměti
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedArrow.lifeCycleRule}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Zkouškový tahák & GoF pravidlo</span>
                  </span>
                  <p className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed">
                    {selectedArrow.quickTip}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>C# Zápis do zkouškového kódu</span>
                  </span>
                  <button
                    onClick={() => handleCopyCode(selectedArrow.id, selectedArrow.csharpCode)}
                    className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1"
                  >
                    {copiedCodeId === selectedArrow.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Zkopírováno</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopírovat</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                  <code>{selectedArrow.csharpCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: 16 VZORŮ ZA 1 MINUTU */}
      {/* ========================================================================= */}
      {activeSection === 'patterns' && (
        <section aria-labelledby="heading-patterns" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 id="heading-patterns" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span>16 Vzorů za 1 minutu (Ultra-rychlý přehled ke zkoušce)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Klíčový záměr, jednořádková C# signatura a zkouškový chyták pro všech 16 předepsaných návrhových vzorů.
              </p>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Hledat vzor, kód, záměr..."
                  value={patternSearch}
                  onChange={e => setPatternSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-56"
                />
              </div>

              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs">
                {(['all', 'creational', 'structural', 'behavioral'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPatternCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      patternCategory === cat
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat === 'all'
                      ? 'Vše (16)'
                      : cat === 'creational'
                      ? 'Vytvářející (4)'
                      : cat === 'structural'
                      ? 'Strukturální (7)'
                      : 'Chování (5)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Patterns Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 text-slate-700 dark:text-slate-300 font-semibold">
                  <th className="py-3 px-4 min-w-[150px]">Vzor & Týden</th>
                  <th className="py-3 px-4 min-w-[200px]">Záměr (Intent)</th>
                  <th className="py-3 px-4 min-w-[280px]">Jednořádková C# signatura</th>
                  <th className="py-3 px-4 min-w-[220px]">Klíč ke zkoušce</th>
                  {onSelectPattern && <th className="py-3 px-3 text-center min-w-[60px]">Akce</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredPatterns.map(p => {
                  const catBadgeColor =
                    p.category === 'creational'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : p.category === 'structural'
                      ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                      : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 align-top">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{p.name}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {p.czechName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${catBadgeColor}`}>
                            {p.categoryCzech}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {p.week}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {p.intent}
                      </td>

                      <td className="py-3 px-4 align-top">
                        <div className="relative group">
                          <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 whitespace-pre-wrap">
                            <code>{p.oneLinerCsharp}</code>
                          </pre>
                          <button
                            onClick={() => handleCopyCode(p.id, p.oneLinerCsharp)}
                            title="Kopírovat signaturu"
                            className="absolute right-2 top-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedCodeId === p.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {p.examKey}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1 italic">
                          Rule: {p.gofRule}
                        </p>
                      </td>

                      {onSelectPattern && (
                        <td className="py-3 px-3 align-middle text-center">
                          <button
                            onClick={() => onSelectPattern(p.id)}
                            title="Otevřít v Katalogu vzorů"
                            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: 5 ZKOUŠKOVÝCH PASTÍ */}
      {/* ========================================================================= */}
      {activeSection === 'traps' && (
        <section aria-labelledby="heading-traps" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 id="heading-traps" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span>5 Zkouškových pastí (Top 5 Exam Traps in C#)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Kritické zkouškové chytáky, na kterých studenti nejčastěji ztrácejí body: vtable vs new, struct vs class, immutabilita, boxing a casty.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setAllTraps(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                Rozbalit vše
              </button>
              <button
                onClick={() => setAllTraps(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                Sbalit vše
              </button>
            </div>
          </div>

          {/* Accordion of 5 Traps */}
          <div className="space-y-4">
            {EXAM_TRAPS_DATA.map(trap => {
              const isOpen = !!openTraps[trap.id];
              return (
                <div
                  key={trap.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all"
                >
                  {/* Trap Header */}
                  <button
                    onClick={() => toggleTrap(trap.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start sm:items-center space-x-4">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm shrink-0">
                        #{trap.number}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-base text-slate-900 dark:text-white">
                            {trap.title}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                            {trap.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Koncept: {trap.concept}
                        </p>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expanded Trap Content */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-5">
                      {/* Question */}
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                          Otázka u zkoušky:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          {trap.question}
                        </p>
                      </div>

                      {/* Code Snippet & Expected Output */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                              <Code2 className="w-3.5 h-3.5" />
                              <span>Zkouškový C# kód</span>
                            </span>
                            <button
                              onClick={() => handleCopyCode(trap.id, trap.code)}
                              className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1"
                            >
                              {copiedCodeId === trap.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-500">Zkopírováno</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Kopírovat</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                            <code>{trap.code}</code>
                          </pre>
                        </div>

                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                            Co program skutečně vypíše:
                          </span>
                          <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 h-[calc(100%-24px)] flex flex-col justify-center">
                            <span className="text-[10px] text-slate-500 uppercase block mb-1">Konzole:</span>
                            <pre className="whitespace-pre-wrap">{trap.output}</pre>
                          </div>
                        </div>
                      </div>

                      {/* Why it happens and How to solve */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                          <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block mb-1">
                            Proč k tomu dochází (Pod kapotou .NET runtime):
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {trap.whyItHappens}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
                            Jak to správně vyřešit u zkoušky:
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {trap.howToSolve}
                          </p>
                        </div>
                      </div>

                      {/* Golden Rule Highlight */}
                      <div className="p-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs sm:text-sm flex items-center space-x-2.5 shadow-sm">
                        <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
                        <span>{trap.examRule}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
};
