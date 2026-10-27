import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  CornerDownLeft
} from 'lucide-react';

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  group: 'Vzory GoF (16)' | 'OOP Teorie' | 'Zkouškový tahák' | 'Trénink & Kvízy' | 'Pískoviště';
  tab: string;
  section?: string;
  badge?: string;
  keywords: string[];
}

export const COMMAND_ITEMS: CommandItem[] = [
  // --- VZORY GoF (16) ---
  {
    id: 'pattern-singleton',
    title: 'Singleton (Jedináček)',
    subtitle: 'Vytvářející • Týdny 6–7 • Globální bod přístupu a privátní konstruktor',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'singleton',
    badge: 'Creational',
    keywords: ['singleton', 'jedinacek', 'instance', 'lazy', 'vytvarejici', 'private konstruktor']
  },
  {
    id: 'pattern-factory-method',
    title: 'Factory Method (Tovární metoda)',
    subtitle: 'Vytvářející • Týdny 6–7 • Virtuální metoda pro tvorbu instancí v potomcích',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'factory-method',
    badge: 'Creational',
    keywords: ['factory', 'method', 'tovarni', 'metoda', 'creator', 'vytvarejici']
  },
  {
    id: 'pattern-abstract-factory',
    title: 'Abstract Factory (Abstraktní továrna)',
    subtitle: 'Vytvářející • Týdny 6–7 • Rodiny souvisejících produktů bez konkrétních tříd',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'abstract-factory',
    badge: 'Creational',
    keywords: ['abstract', 'factory', 'abstraktni', 'tovarna', 'rodina', 'vytvarejici']
  },
  {
    id: 'pattern-builder',
    title: 'Builder (Stavitel)',
    subtitle: 'Vytvářející • Týdny 6–7 • Krok za krokem sestavování složitých objektů (Fluent)',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'builder',
    badge: 'Creational',
    keywords: ['builder', 'stavitel', 'fluent', 'build', 'vytvarejici']
  },
  {
    id: 'pattern-adapter',
    title: 'Adapter (Adaptér / Wrapper)',
    subtitle: 'Strukturální • Týdny 8–9 • Propojení nekompatibilních rozhraní tříd',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'adapter',
    badge: 'Structural',
    keywords: ['adapter', 'prevodnik', 'wrapper', 'adaptee', 'strukturalni']
  },
  {
    id: 'pattern-proxy',
    title: 'Proxy (Zástupce)',
    subtitle: 'Strukturální • Týdny 8–9 • Řízení přístupu, líná inicializace, cachování',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'proxy',
    badge: 'Structural',
    keywords: ['proxy', 'zastupce', 'lazy', 'ochranna', 'virtual', 'strukturalni']
  },
  {
    id: 'pattern-decorator',
    title: 'Decorator (Dekorátor)',
    subtitle: 'Strukturální • Týdny 8–9 • Dynamické přidávání funkcionality balením (cibule)',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'decorator',
    badge: 'Structural',
    keywords: ['decorator', 'dekorator', 'cibule', 'wrapee', 'kompozice', 'strukturalni']
  },
  {
    id: 'pattern-bridge',
    title: 'Bridge (Most)',
    subtitle: 'Strukturální • Týdny 8–9 • Oddělení abstrakce od implementace ve 2 osách',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'bridge',
    badge: 'Structural',
    keywords: ['bridge', 'most', 'abstrakce', 'implementace', 'strukturalni']
  },
  {
    id: 'pattern-flyweight',
    title: 'Flyweight (Muší váha)',
    subtitle: 'Strukturální • Týdny 8–9 • Šetření RAM sdílením vnitřního stavu (intrinsic)',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'flyweight',
    badge: 'Structural',
    keywords: ['flyweight', 'musi', 'vaha', 'intrinsic', 'extrinsic', 'pamet', 'strukturalni']
  },
  {
    id: 'pattern-facade',
    title: 'Facade (Fasáda)',
    subtitle: 'Strukturální • Týdny 8–9 • Zjednodušené rozhraní ke komplexnímu subsystému',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'facade',
    badge: 'Structural',
    keywords: ['facade', 'fasada', 'jednoduche', 'rozhrani', 'subsytem', 'strukturalni']
  },
  {
    id: 'pattern-composite',
    title: 'Composite (Kompozit)',
    subtitle: 'Strukturální • Týdny 8–9 • Stromová hierarchie část-celek, jednotný přístup',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'composite',
    badge: 'Structural',
    keywords: ['composite', 'kompozit', 'strom', 'list', 'uzel', 'strukturalni']
  },
  {
    id: 'pattern-strategy',
    title: 'Strategy (Strategie)',
    subtitle: 'Chování • Týdny 10–11 • Záměnné algoritmy zapouzdřené do samostatných tříd',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'strategy',
    badge: 'Behavioral',
    keywords: ['strategy', 'strategie', 'algoritmus', 'platba', 'chovani']
  },
  {
    id: 'pattern-command',
    title: 'Command (Příkaz)',
    subtitle: 'Chování • Týdny 10–11 • Požadavek jako objekt s podporou Execute() a Undo()',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'command',
    badge: 'Behavioral',
    keywords: ['command', 'prikaz', 'undo', 'redo', 'invoker', 'receiver', 'chovani']
  },
  {
    id: 'pattern-memento',
    title: 'Memento (Upomínka)',
    subtitle: 'Chování • Týdny 10–11 • Uložení vnitřního stavu objektu bez porušení zapouzdření',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'memento',
    badge: 'Behavioral',
    keywords: ['memento', 'upominka', 'snapshot', 'originator', 'caretaker', 'chovani']
  },
  {
    id: 'pattern-observer',
    title: 'Observer (Pozorovatel)',
    subtitle: 'Chování • Týdny 10–11 • Závislost 1:N s automatickým upozorňováním odběratelů',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'observer',
    badge: 'Behavioral',
    keywords: ['observer', 'pozorovatel', 'pubsub', 'notify', 'chovani']
  },
  {
    id: 'pattern-state',
    title: 'State (Stav)',
    subtitle: 'Chování • Týdny 10–11 • Změna chování objektu při změně vnitřního stavu',
    group: 'Vzory GoF (16)',
    tab: 'patterns',
    section: 'state',
    badge: 'Behavioral',
    keywords: ['state', 'stav', 'prechod', 'kontext', 'chovani']
  },

  // --- ZKOUŠKOVÝ TAHÁK ---
  {
    id: 'cheat-modifiers',
    title: 'Matice 6 specifikátorů přístupu',
    subtitle: 'Zkouškový tahák • Tabulka viditelnosti: public, internal, protected, private protected...',
    group: 'Zkouškový tahák',
    tab: 'cheatsheet',
    section: 'modifiers',
    badge: 'Tahák',
    keywords: ['specifikatory', 'pristup', 'modifiers', 'protected internal', 'private protected', 'internal']
  },
  {
    id: 'cheat-uml',
    title: 'UML Převodník šipek do C#',
    subtitle: 'Zkouškový tahák • Dědičnost, Realizace, Kompozice, Agregace, Asociace, Závislost',
    group: 'Zkouškový tahák',
    tab: 'cheatsheet',
    section: 'uml',
    badge: 'Tahák',
    keywords: ['uml', 'sipky', 'dedicnost', 'kompozice', 'agregace', 'realizace', 'asociace', 'zavislost']
  },
  {
    id: 'cheat-quick-patterns',
    title: '16 Vzorů za 1 minutu (Blesková tabulka)',
    subtitle: 'Zkouškový tahák • Jednořádkové C# signatury a klíčové zkouškové poznatky',
    group: 'Zkouškový tahák',
    tab: 'cheatsheet',
    section: 'patterns',
    badge: 'Tahák',
    keywords: ['vzory za minutu', 'bleskova tabulka', 'cheatsheet', 'rychly prehled']
  },
  {
    id: 'cheat-traps',
    title: '5 Zkouškových pastí a chytáků',
    subtitle: 'Zkouškový tahák • vtable vs new, struct vs class, string immutability, boxing, casty',
    group: 'Zkouškový tahák',
    tab: 'cheatsheet',
    section: 'traps',
    badge: 'Chytáky',
    keywords: ['chytaky', 'zkouskove pasti', 'vtable', 'boxing', 'immutability', 'struct vs class']
  },

  // --- OOP TEORIE & ZKOUŠKA ---
  {
    id: 'theory-under-the-hood',
    title: 'C# pod kapotou: Roslyn, IL, JIT',
    subtitle: '1. Krok • Kompilace zdrojáku C# do Intermediate Language a strojového kódu',
    group: 'OOP Teorie',
    tab: 'step1',
    section: 'roslyn',
    badge: 'Teorie',
    keywords: ['roslyn', 'il', 'jit', 'kompilace', 'pod kapotou', 'clr']
  },
  {
    id: 'theory-memory-model',
    title: 'Paměťový model: Zásobník vs Halda (Stack vs Heap)',
    subtitle: '1. Krok • Kde žijí hodnotové typy a kde referenční objekty v RAM',
    group: 'OOP Teorie',
    tab: 'step1',
    section: 'memory',
    badge: 'Teorie',
    keywords: ['stack', 'heap', 'zasobnik', 'halda', 'ram', 'alokace', 'pamet']
  },
  {
    id: 'theory-value-vs-ref',
    title: 'Hodnotové vs Referenční typy (struct vs class)',
    subtitle: '1. Krok • Rozdíl při přiřazení a kopírování dat v paměti',
    group: 'OOP Teorie',
    tab: 'step1',
    section: 'valueref',
    badge: 'Teorie',
    keywords: ['value', 'reference', 'struct', 'class', 'kopirovani', 'priřazeni']
  },
  {
    id: 'theory-python-vs-csharp',
    title: 'Přechod z Pythonu na C# (Srovnání)',
    subtitle: '1. Krok • Klíčové rozdíly v typování, syntaxi a mentálním modelu',
    group: 'OOP Teorie',
    tab: 'step1',
    section: 'python',
    badge: 'Teorie',
    keywords: ['python', 'csharp', 'prechod', 'rozdily', 'srovnani']
  },
  {
    id: 'theory-holy-trinity',
    title: 'Svatá trojice OOP: Zapouzdření, Dědičnost, Polymorfismus',
    subtitle: '2. Krok • Základní pilíře objektově orientovaného návrhu',
    group: 'OOP Teorie',
    tab: 'step2',
    section: 'trinity',
    badge: 'Teorie',
    keywords: ['svata trojice', 'oop', 'zapouzdreni', 'dedicnost', 'polymorfismus']
  },
  {
    id: 'theory-vtable-override',
    title: 'Polymorfismus: virtual, override vs new zastínění',
    subtitle: '2. Krok • Pozdní vazba (vtable) vs časná statická vazba',
    group: 'OOP Teorie',
    tab: 'step2',
    section: 'polymorphism',
    badge: 'Teorie',
    keywords: ['virtual', 'override', 'new', 'zastineni', 'vtable', 'v-table']
  },
  {
    id: 'theory-gof-rules',
    title: '2 Zlatá pravidla návrhu GoF',
    subtitle: '2. Krok • 1. Programuj proti rozhraní, 2. Upřednostňuj kompozici před dědičností',
    group: 'OOP Teorie',
    tab: 'step2',
    section: 'gof-rules',
    badge: 'Teorie',
    keywords: ['pravidla', 'gof', 'kompozice', 'rozhrani', 'zasady']
  },

  // --- TRÉNINK & KVÍZY ---
  {
    id: 'trainer-mode1',
    title: 'Režim 1: Doplň chybějící klíčová slova',
    subtitle: 'Trénink • Procvičování klíčových slov: interface, override, new, base...',
    group: 'Trénink & Kvízy',
    tab: 'trainer',
    section: 'mode1',
    badge: 'Trénink',
    keywords: ['doplnovacka', 'rezim 1', 'fill in blanks', 'klicova slova']
  },
  {
    id: 'trainer-mode2',
    title: 'Režim 2: Napiš 4 části vzoru zpaměti',
    subtitle: 'Trénink • Rozhraní produktu, konkrétní produkt, samotný vzor a klientský kód',
    group: 'Trénink & Kvízy',
    tab: 'trainer',
    section: 'mode2',
    badge: 'Trénink',
    keywords: ['4 casti', 'rezim 2', 'zpameti', 'four parts', 'tvorba kodu']
  },
  {
    id: 'trainer-mode3',
    title: 'Režim 3: Zkouškový kvíz "Co vypíše tento kód?"',
    subtitle: 'Trénink • Interaktivní testy s okamžitou zpětnou vazbou a vysvětlením',
    group: 'Trénink & Kvízy',
    tab: 'trainer',
    section: 'mode3',
    badge: 'Kvíz',
    keywords: ['kviz', 'rezim 3', 'co vypise', 'zkouska', 'test']
  },
  {
    id: 'trainer-exam-sim',
    title: 'Zkoušková simulace na čas (20 minut)',
    subtitle: 'Trénink • 15 náhodných otázek s časovačem a 60% hranicí úspěšnosti',
    group: 'Trénink & Kvízy',
    tab: 'trainer',
    section: 'exam-sim',
    badge: 'Simulace',
    keywords: ['simulace', 'casovac', 'ostra zkouska', 'timed exam', '20 minut']
  },
  {
    id: 'trainer-sudden-death',
    title: 'Sudden Death výzva (1 život)',
    subtitle: 'Trénink • Okamžitý konec při první chybě, sběr maximálního komba',
    group: 'Trénink & Kvízy',
    tab: 'trainer',
    section: 'sudden-death',
    badge: 'Survival',
    keywords: ['sudden death', '1 zivot', 'preziti', 'survival', 'kombo']
  },
  {
    id: 'trainer-flashcards',
    title: 'Leitnerovy kartičky (Flashcards)',
    subtitle: 'Trénink • Active recall systém se 3 přihrádkami a otáčením kartiček',
    group: 'Trénink & Kvízy',
    tab: 'trainer',
    section: 'flashcards',
    badge: 'Kartičky',
    keywords: ['flashcards', 'karticky', 'leitner', 'active recall', 'opakovani']
  },

  // --- PÍSKOVIŠTĚ ---
  {
    id: 'playground-payment',
    title: 'Šablona: Chytrý systém plateb',
    subtitle: 'Pískoviště • Kombinace 3 vzorů: Strategy + Adapter + Proxy',
    group: 'Pískoviště',
    tab: 'playground',
    section: 'payment',
    badge: 'Šablona',
    keywords: ['platby', 'strategy', 'adapter', 'proxy', 'sablona 1', 'započet']
  },
  {
    id: 'playground-rpg',
    title: 'Šablona: Tahové RPG / Editor',
    subtitle: 'Pískoviště • Kombinace 4 vzorů: Command + Memento + Observer + Decorator',
    group: 'Pískoviště',
    tab: 'playground',
    section: 'rpg',
    badge: 'Šablona',
    keywords: ['rpg', 'editor', 'command', 'memento', 'observer', 'decorator', 'sablona 2']
  }
];

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (targetTab: string, targetSection?: string) => void;
  enableGlobalShortcuts?: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelect,
  enableGlobalShortcuts = true
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Listener for Ctrl+K and /
  useEffect(() => {
    if (!enableGlobalShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger slash if user is typing inside an input/textarea/editor
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInput =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open
          setQuery('');
          setSelectedIndex(0);
        }
      } else if (e.key === '/' && !isInput && !isOpen) {
        e.preventDefault();
        setQuery('');
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableGlobalShortcuts, isOpen, onClose]);

  // Focus input whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMAND_ITEMS;

    return COMMAND_ITEMS.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle?.toLowerCase().includes(q);
      const matchKeywords = item.keywords.some(k => k.toLowerCase().includes(q));
      const matchGroup = item.group.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchKeywords || matchGroup;
    });
  }, [query]);

  // Keep selected index within valid range
  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(Math.max(0, filteredItems.length - 1));
    }
  }, [filteredItems.length, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Handle keyboard navigation within the open dialog
  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        handleSelectItem(selected);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelectItem = (item: CommandItem) => {
    onSelect(item.tab, item.section);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Globální vyhledávání a navigace"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onKeyDown={handleDialogKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-slate-200 dark:border-slate-800 flex items-center px-4 py-3 bg-slate-50/50 dark:bg-slate-950/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Hledejte vzor, téma, zkouškový tahák nebo kvíz..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40 max-h-[55vh] scrollbar-thin"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">Žádný výsledek pro &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">
                Zkuste hledat např. &ldquo;Singleton&rdquo;, &ldquo;UML&rdquo;, &ldquo;Matice&rdquo;, &ldquo;Stack&rdquo; nebo &ldquo;Kvíz&rdquo;.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-index={idx}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold text-xs sm:text-sm truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {item.title}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p
                        className={`text-xs truncate mt-0.5 ${
                          isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.group}
                    </span>
                    {isSelected && <CornerDownLeft className="w-4 h-4 text-white" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Shortcuts */}
        <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-2 bg-slate-50 dark:bg-slate-950/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                ↓
              </kbd>
              <span className="ml-1">navigovat</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                ↵
              </kbd>
              <span className="ml-1">otevřít</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                ESC
              </kbd>
              <span className="ml-1">zavřít</span>
            </span>
          </div>

          <div className="font-mono text-[10px] text-slate-400">
            {filteredItems.length} položek
          </div>
        </div>
      </div>
    </div>
  );
};
