import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Flashcard,
  FlashcardCategory,
  flashcardsData
} from '../../data/flashcardsData';
import { PatternUMLDiagram } from '../diagrams/PatternUMLDiagram';
import {
  Brain,
  RotateCw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  Info,
  BookOpen,
  Filter
} from 'lucide-react';

const STORAGE_KEY = 'oonv_flashcards_buckets';

type BucketNumber = 1 | 2 | 3;
type BucketFilter = 'all' | BucketNumber;
type CategoryFilter = 'all' | FlashcardCategory;

export const FlashcardDeck: React.FC = () => {
  // 1. Leitner Buckets State (persisted in localStorage)
  const [buckets, setBuckets] = useState<Record<string, BucketNumber>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse error
    }
    const initial: Record<string, BucketNumber> = {};
    flashcardsData.forEach((c) => {
      initial[c.id] = 1;
    });
    return initial;
  });

  // Save to localStorage whenever buckets change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(buckets));
    } catch {
      // storage unavailable
    }
  }, [buckets]);

  // Filters & Navigation State
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [bucketFilter, setBucketFilter] = useState<BucketFilter>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Filtered Cards List
  const filteredCards = useMemo(() => {
    return flashcardsData.filter((card) => {
      const matchCat =
        categoryFilter === 'all' || card.category === categoryFilter;
      const currentBucket = buckets[card.id] || 1;
      const matchBucket =
        bucketFilter === 'all' || currentBucket === bucketFilter;
      return matchCat && matchBucket;
    });
  }, [categoryFilter, bucketFilter, buckets]);

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredCards.length) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
    setShowHint(false);
  }, [filteredCards.length, currentIndex]);

  const currentCard: Flashcard | undefined = filteredCards[currentIndex];

  // Bucket counters
  const bucketCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0 };
    flashcardsData.forEach((c) => {
      const b = buckets[c.id] || 1;
      counts[b] = (counts[b] || 0) + 1;
    });
    return counts;
  }, [buckets]);

  const totalCards = flashcardsData.length;
  const masteredPercentage = Math.round((bucketCounts[3] / totalCards) * 100);

  // Card movement actions
  const handleRateCard = useCallback(
    (targetBucket: BucketNumber) => {
      if (!currentCard) return;
      setBuckets((prev) => ({
        ...prev,
        [currentCard.id]: targetBucket
      }));

      // Next card with flip reset
      setIsFlipped(false);
      setShowHint(false);
      if (filteredCards.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
      }
    },
    [currentCard, filteredCards.length]
  );

  const handleNext = useCallback(() => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  }, [filteredCards.length]);

  const handlePrev = useCallback(() => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(
      (prev) => (prev - 1 + filteredCards.length) % filteredCards.length
    );
  }, [filteredCards.length]);

  const handleShuffle = useCallback(() => {
    if (filteredCards.length <= 1) return;
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(randomIndex);
  }, [filteredCards.length]);

  const handleResetBuckets = useCallback(() => {
    if (
      window.confirm(
        'Opravdu chceš resetovat průchod kartičkami zpět do Boxu 1 (K prostudování)?'
      )
    ) {
      const reset: Record<string, BucketNumber> = {};
      flashcardsData.forEach((c) => {
        reset[c.id] = 1;
      });
      setBuckets(reset);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, []);

  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        // Ještě neumím -> move to bucket 2 (Opakovat)
        handleRateCard(2);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        // Zvládnuto -> move to bucket 3 (Zvládnuto)
        handleRateCard(3);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRateCard, handleNext, handlePrev]);

  // Category labels and badge colors
  const categoryConfig: Record<
    FlashcardCategory,
    { label: string; bg: string; text: string; border: string }
  > = {
    creational: {
      label: 'Vytvářející vzor',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-700'
    },
    structural: {
      label: 'Strukturální vzor',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700'
    },
    behavioral: {
      label: 'Vzor chování',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-300 dark:border-purple-700'
    },
    'oop-theory': {
      label: 'OOP Zkoušková Teorie',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-700'
    }
  };

  // Helper for rendering custom SVG diagrams for OOP theory cards
  const renderTheoryDiagram = (cardId: string) => {
    if (cardId === 'fc-stack-vs-heap') {
      return (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <svg viewBox="0 0 520 180" className="w-full h-auto min-w-[460px]">
            {/* Stack box */}
            <rect
              x="20"
              y="20"
              width="210"
              height="140"
              rx="8"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <text
              x="125"
              y="45"
              fill="#38bdf8"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="14"
            >
              STACK (Zásobník - LIFO)
            </text>
            <rect
              x="35"
              y="60"
              width="180"
              height="30"
              rx="4"
              fill="#0f172a"
              stroke="#64748b"
            />
            <text x="45" y="80" fill="#f8fafc" fontSize="11">
              int x = 10 (Hodnota uložena přímo)
            </text>
            <rect
              x="35"
              y="100"
              width="180"
              height="45"
              rx="4"
              fill="#0f172a"
              stroke="#64748b"
            />
            <text x="45" y="118" fill="#f8fafc" fontSize="11">
              Uzivatel u1 = 0x7FFE4A
            </text>
            <text x="45" y="134" fill="#94a3b8" fontSize="10">
              u2 = u1 (Kopíruje jen ukazatel!)
            </text>

            {/* Pointer arrow from Stack to Heap */}
            <path
              d="M 215 120 L 290 100"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              markerEnd="url(#arrow-pointer)"
            />
            <defs>
              <marker
                id="arrow-pointer"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b" />
              </marker>
            </defs>

            {/* Heap box */}
            <rect
              x="295"
              y="20"
              width="205"
              height="140"
              rx="8"
              fill="#1e293b"
              stroke="#10b981"
              strokeWidth="2"
            />
            <text
              x="397"
              y="45"
              fill="#10b981"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="14"
            >
              HEAP (Halda - RAM)
            </text>
            <rect
              x="310"
              y="65"
              width="175"
              height="80"
              rx="6"
              fill="#0f172a"
              stroke="#10b981"
            />
            <text x="320" y="85" fill="#34d399" fontWeight="bold" fontSize="11">
              Objekt na adrese 0x7FFE4A:
            </text>
            <text x="320" y="105" fill="#f8fafc" fontSize="11">
              new Uzivatel("David")
            </text>
            <text x="320" y="125" fill="#94a3b8" fontSize="10">
              Žije v RAM dokud GC neuvolní
            </text>
          </svg>
        </div>
      );
    }

    if (cardId === 'fc-upcasting-downcasting') {
      return (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <svg viewBox="0 0 520 180" className="w-full h-auto min-w-[460px]">
            {/* Base class box */}
            <rect
              x="160"
              y="15"
              width="200"
              height="50"
              rx="6"
              fill="#1e293b"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <text
              x="260"
              y="37"
              fill="#a5b4fc"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="13"
            >
              Zamestnanec (Předek)
            </text>
            <text
              x="260"
              y="53"
              fill="#94a3b8"
              textAnchor="middle"
              fontSize="10"
            >
              Obecný typ vlevo: Zamestnanec z;
            </text>

            {/* Derived class box */}
            <rect
              x="160"
              y="115"
              width="200"
              height="50"
              rx="6"
              fill="#1e293b"
              stroke="#8b5cf6"
              strokeWidth="2"
            />
            <text
              x="260"
              y="137"
              fill="#c4b5fd"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="13"
            >
              Programator (Potomek)
            </text>
            <text
              x="260"
              y="153"
              fill="#94a3b8"
              textAnchor="middle"
              fontSize="10"
            >
              Reálný objekt v RAM: new Programator();
            </text>

            {/* Upcasting arrow */}
            <path
              d="M 140 120 L 140 60"
              stroke="#10b981"
              strokeWidth="2.5"
              markerEnd="url(#arrow-green)"
            />
            <text
              x="130"
              y="93"
              fill="#10b981"
              textAnchor="end"
              fontWeight="bold"
              fontSize="11"
            >
              UPCASTING (implicitní, bezpečný)
            </text>

            {/* Downcasting arrow */}
            <path
              d="M 380 60 L 380 120"
              stroke="#f59e0b"
              strokeWidth="2.5"
              markerEnd="url(#arrow-amber)"
            />
            <text
              x="390"
              y="93"
              fill="#f59e0b"
              textAnchor="start"
              fontWeight="bold"
              fontSize="11"
            >
              DOWNCASTING (přes "is" / "as")
            </text>

            <defs>
              <marker
                id="arrow-green"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
              </marker>
              <marker
                id="arrow-amber"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b" />
              </marker>
            </defs>
          </svg>
        </div>
      );
    }

    if (cardId === 'fc-inheritance-override-vs-new') {
      return (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <svg viewBox="0 0 520 180" className="w-full h-auto min-w-[460px]">
            {/* Left box: STATICKÁ VAZBA (NEW) */}
            <rect
              x="15"
              y="15"
              width="235"
              height="150"
              rx="8"
              fill="#1e293b"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <text
              x="132"
              y="40"
              fill="#fca5a5"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="13"
            >
              STATICKÁ VAZBA ("new")
            </text>
            <text
              x="132"
              y="60"
              fill="#94a3b8"
              textAnchor="middle"
              fontSize="11"
            >
              Vlevo: Rodic r = new Potomek();
            </text>
            <rect
              x="28"
              y="75"
              width="210"
              height="40"
              rx="4"
              fill="#0f172a"
              stroke="#ef4444"
            />
            <text x="38" y="93" fill="#f87171" fontSize="11">
              r.PozdravObycejne();
            </text>
            <text x="38" y="107" fill="#cbd5e1" fontSize="10">
              ➔ Zavolá RODIČ (podle typu proměnné!)
            </text>
            <text
              x="132"
              y="145"
              fill="#f87171"
              textAnchor="middle"
              fontSize="10"
            >
              Kompilátor váže v compile-time
            </text>

            {/* Right box: DYNAMICKÁ VAZBA (OVERRIDE / VTABLE) */}
            <rect
              x="270"
              y="15"
              width="235"
              height="150"
              rx="8"
              fill="#1e293b"
              stroke="#10b981"
              strokeWidth="2"
            />
            <text
              x="387"
              y="40"
              fill="#6ee7b7"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="13"
            >
              DYNAMICKÁ VAZBA ("override")
            </text>
            <text
              x="387"
              y="60"
              fill="#94a3b8"
              textAnchor="middle"
              fontSize="11"
            >
              Vpravo: ... = new Potomek();
            </text>
            <rect
              x="283"
              y="75"
              width="210"
              height="40"
              rx="4"
              fill="#0f172a"
              stroke="#10b981"
            />
            <text x="293" y="93" fill="#34d399" fontSize="11">
              r.PozdravVirtualne();
            </text>
            <text x="293" y="107" fill="#cbd5e1" fontSize="10">
              ➔ Zavolá POTOMEK (přes VTABLE v RAM!)
            </text>
            <text
              x="387"
              y="145"
              fill="#34d399"
              textAnchor="middle"
              fontSize="10"
            >
              Runtime polymorfismus
            </text>
          </svg>
        </div>
      );
    }

    if (cardId === 'fc-access-modifiers') {
      return (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <svg viewBox="0 0 520 180" className="w-full h-auto min-w-[460px]">
            <rect
              x="10"
              y="15"
              width="500"
              height="150"
              rx="8"
              fill="#0f172a"
              stroke="#64748b"
            />
            <text
              x="260"
              y="38"
              fill="#f8fafc"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="13"
            >
              Hierarchie dosahu 6 modifikátorů v C#
            </text>

            {/* Modifier bands */}
            <rect
              x="30"
              y="55"
              width="70"
              height="35"
              rx="4"
              fill="#ef4444"
              opacity="0.85"
            />
            <text
              x="65"
              y="72"
              fill="#ffffff"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="10"
            >
              private
            </text>
            <text
              x="65"
              y="84"
              fill="#fee2e2"
              textAnchor="middle"
              fontSize="8"
            >
              Jen třída
            </text>

            <rect
              x="105"
              y="55"
              width="75"
              height="35"
              rx="4"
              fill="#f97316"
              opacity="0.85"
            />
            <text
              x="142"
              y="72"
              fill="#ffffff"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="9"
            >
              private prot.
            </text>
            <text
              x="142"
              y="84"
              fill="#ffedd5"
              textAnchor="middle"
              fontSize="8"
            >
              Dědic AND .dll
            </text>

            <rect
              x="185"
              y="55"
              width="75"
              height="35"
              rx="4"
              fill="#eab308"
              opacity="0.85"
            />
            <text
              x="222"
              y="72"
              fill="#ffffff"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="10"
            >
              protected
            </text>
            <text
              x="222"
              y="84"
              fill="#fef9c3"
              textAnchor="middle"
              fontSize="8"
            >
              Všichni dědici
            </text>

            <rect
              x="265"
              y="55"
              width="75"
              height="35"
              rx="4"
              fill="#06b6d4"
              opacity="0.85"
            />
            <text
              x="302"
              y="72"
              fill="#ffffff"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="10"
            >
              internal
            </text>
            <text
              x="302"
              y="84"
              fill="#cffafe"
              textAnchor="middle"
              fontSize="8"
            >
              Celý projekt
            </text>

            <rect
              x="345"
              y="55"
              width="80"
              height="35"
              rx="4"
              fill="#8b5cf6"
              opacity="0.85"
            />
            <text
              x="385"
              y="72"
              fill="#ffffff"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="9"
            >
              prot. internal
            </text>
            <text
              x="385"
              y="84"
              fill="#ede9fe"
              textAnchor="middle"
              fontSize="8"
            >
              Dědic OR .dll
            </text>

            <rect
              x="430"
              y="55"
              width="60"
              height="35"
              rx="4"
              fill="#10b981"
              opacity="0.85"
            />
            <text
              x="460"
              y="72"
              fill="#ffffff"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="10"
            >
              public
            </text>
            <text
              x="460"
              y="84"
              fill="#d1fae5"
              textAnchor="middle"
              fontSize="8"
            >
              Kdekoliv
            </text>

            {/* Explanation note */}
            <rect
              x="30"
              y="105"
              width="460"
              height="45"
              rx="6"
              fill="#1e293b"
              stroke="#475569"
            />
            <text x="45" y="123" fill="#38bdf8" fontSize="11" fontWeight="bold">
              Zkouškový tahák:
            </text>
            <text x="45" y="139" fill="#cbd5e1" fontSize="10">
              • private protected = (odvozená třída) AND (stejná assembly)
              [PRŮNIK]
            </text>
            <text x="280" y="139" fill="#cbd5e1" fontSize="10">
              • protected internal = (odvozená třída) OR (stejná assembly)
              [SJEDNOCENÍ]
            </text>
          </svg>
        </div>
      );
    }

    if (cardId === 'fc-two-golden-rules-gof') {
      return (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <svg viewBox="0 0 520 180" className="w-full h-auto min-w-[460px]">
            {/* Rule 1 */}
            <rect
              x="15"
              y="15"
              width="235"
              height="150"
              rx="8"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <text
              x="132"
              y="40"
              fill="#7dd3fc"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="12"
            >
              1. Zlaté pravidlo GoF
            </text>
            <text
              x="132"
              y="58"
              fill="#f8fafc"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="10"
            >
              "Programuj proti rozhraní,
            </text>
            <text
              x="132"
              y="72"
              fill="#f8fafc"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="10"
            >
              ne proti implementaci"
            </text>
            <rect
              x="28"
              y="85"
              width="210"
              height="65"
              rx="4"
              fill="#0f172a"
              stroke="#38bdf8"
            />
            <text x="38" y="103" fill="#f87171" fontSize="10">
              ❌ MySQLDb db = new MySQLDb();
            </text>
            <text x="38" y="120" fill="#34d399" fontSize="10">
              ✅ IDatabaze db = new MySQLDb();
            </text>
            <text x="38" y="138" fill="#94a3b8" fontSize="9">
              Volná vazba umožňuje snadné mockování
            </text>

            {/* Rule 2 */}
            <rect
              x="270"
              y="15"
              width="235"
              height="150"
              rx="8"
              fill="#1e293b"
              stroke="#10b981"
              strokeWidth="2"
            />
            <text
              x="387"
              y="40"
              fill="#6ee7b7"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="12"
            >
              2. Zlaté pravidlo GoF
            </text>
            <text
              x="387"
              y="58"
              fill="#f8fafc"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="10"
            >
              "Upřednostňuj kompozici
            </text>
            <text
              x="387"
              y="72"
              fill="#f8fafc"
              textAnchor="middle"
              fontWeight="bold"
              fontSize="10"
            >
              před dědičností"
            </text>
            <rect
              x="283"
              y="85"
              width="210"
              height="65"
              rx="4"
              fill="#0f172a"
              stroke="#10b981"
            />
            <text x="293" y="103" fill="#f87171" fontSize="10">
              ❌ class Auto : Motor, Prevodovka
            </text>
            <text x="293" y="120" fill="#34d399" fontSize="10">
              ✅ class Auto &#123; IMotor _motor; &#125;
            </text>
            <text x="293" y="138" fill="#94a3b8" fontSize="9">
              Kompozice (HAS-A) je flexibilní za běhu
            </text>
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Leitner Stats Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              <span>Aktivní vybavování • Leitnerův 3-boxový systém</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              📖 Studuj pak testuj (Flashcards)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              21 kartiček pokrývajících všech 16 GoF návrhových vzorů a 5
              zkouškových konceptů OOP v C#. Kartičky, které ještě bezpečně
              neumíš, se přesouvají do Boxu 2 k častějšímu opakování.
            </p>
          </div>

          {/* Mastered gauge counter */}
          <div className="flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center space-x-4 min-w-[200px]">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-base">
              {masteredPercentage}%
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Zvládnuto ke zkoušce
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {bucketCounts[3]} / {totalCards} karet
              </div>
            </div>
          </div>
        </div>

        {/* Leitner Box Progress Distribution */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setBucketFilter(bucketFilter === 1 ? 'all' : 1)}
            className={`p-3 rounded-xl border text-left transition-all ${
              bucketFilter === 1
                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Box 1: Nové / K prostudování
              </span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                {bucketCounts[1]}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Karty k prvotnímu prostudování
            </div>
          </button>

          <button
            type="button"
            onClick={() => setBucketFilter(bucketFilter === 2 ? 'all' : 2)}
            className={`p-3 rounded-xl border text-left transition-all ${
              bucketFilter === 2
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Box 2: K opakování
              </span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                {bucketCounts[2]}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Chyby & témata k intenzivnímu drilu
            </div>
          </button>

          <button
            type="button"
            onClick={() => setBucketFilter(bucketFilter === 3 ? 'all' : 3)}
            className={`p-3 rounded-xl border text-left transition-all ${
              bucketFilter === 3
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Box 3: Zvládnuto bezpečně
              </span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                {bucketCounts[3]}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Připraveno na 100 % ke zkoušce
            </div>
          </button>
        </div>
      </div>

      {/* Controls & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 mr-1" />
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Všechny ({totalCards})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('creational')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === 'creational'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Vytvářející (4)
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('structural')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === 'structural'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Strukturální (7)
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('behavioral')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === 'behavioral'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Chování (5)
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('oop-theory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === 'oop-theory'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            OOP Teorie (5)
          </button>
        </div>

        {/* Shuffle & Reset */}
        <div className="flex items-center space-x-2 flex-shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleShuffle}
            disabled={filteredCards.length <= 1}
            title="Náhodně zamíchat kartičky"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Zamíchat</span>
          </button>
          <button
            type="button"
            onClick={handleResetBuckets}
            title="Resetovat Leitnerovy boxy"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 dark:hover:text-red-400"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetovat</span>
          </button>
        </div>
      </div>

      {/* Main Flashcard Interactive Area */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Žádné kartičky v tomto výběru
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Pro vybranou kombinaci kategorie a Leitnerova boxu zde nejsou žádné
            kartičky. Všechny karty jsou možná již v jiném boxu!
          </p>
          <button
            type="button"
            onClick={() => {
              setBucketFilter('all');
              setCategoryFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
          >
            Zobrazit všechny kartičky
          </button>
        </div>
      ) : currentCard ? (
        <div className="space-y-4">
          {/* Deck Navigation header */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 dark:text-white">
                Karta {currentIndex + 1} z {filteredCards.length}
              </span>
              <span>•</span>
              <span>
                {bucketFilter === 'all'
                  ? 'Všechny boxy'
                  : `Aktivní: Box ${bucketFilter}`}
              </span>
            </div>

            {/* Quick Keyboard shortcuts reminder */}
            <div className="hidden sm:flex items-center space-x-2 text-[11px]">
              <span className="text-slate-400">Klávesové zkratky:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                Mezerník
              </kbd>
              <span>otočit</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ←
              </kbd>
              <span>opakovat</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                →
              </kbd>
              <span>zvládnuto</span>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div style={{ perspective: '1200px' }} className="w-full">
            <div
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
              className="relative w-full min-h-[520px]"
            >
              {/* ======================================================= */}
              {/* CARD FRONT (Aktivní vybavování / Problém / Nápověda) */}
              {/* ======================================================= */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
                className={`w-full h-full rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between ${
                  isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div>
                  {/* Top Bar: Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          categoryConfig[currentCard.category].bg
                        } ${categoryConfig[currentCard.category].text} ${
                          categoryConfig[currentCard.category].border
                        }`}
                      >
                        {categoryConfig[currentCard.category].label}
                      </span>
                      {currentCard.patternId && (
                        <span className="font-mono text-xs text-slate-400">
                          ID: {currentCard.patternId}
                        </span>
                      )}
                    </div>

                    {/* Current card bucket badge */}
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          buckets[currentCard.id] === 3
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : buckets[currentCard.id] === 2
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        Box {buckets[currentCard.id] || 1}:{' '}
                        {buckets[currentCard.id] === 3
                          ? 'Zvládnuto'
                          : buckets[currentCard.id] === 2
                          ? 'K opakování'
                          : 'K prostudování'}
                      </span>
                    </div>
                  </div>

                  {/* Card Title & Czech Title */}
                  <div className="mt-6 text-center">
                    <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      Otázka na znalost zkouškového konceptu
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                      {currentCard.title}
                    </h3>
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      {currentCard.czechTitle}
                    </div>
                  </div>

                  {/* Scenario / Problem Callout */}
                  <div className="mt-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-left">
                    <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>🎯 Scénář / Problém z praxe & zkoušky</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
                      {currentCard.problemScenario}
                    </p>
                  </div>

                  {/* Hint Accordion */}
                  <div className="mt-4">
                    {!showHint ? (
                      <button
                        type="button"
                        onClick={() => setShowHint(true)}
                        className="flex items-center space-x-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline mx-auto"
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span>💡 Potřebuješ nápovědu? (Klikni zde)</span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left text-xs sm:text-sm text-amber-800 dark:text-amber-300 flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                        <div>
                          <span className="font-bold">Nápověda: </span>
                          {currentCard.hint}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions on Front */}
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Předchozí kartička (Šipka nahoru)"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Další kartička (Šipka dolů)"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Primary Flip Button */}
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Otočit kartu a zkontrolovat řešení (Mezerník)</span>
                  </button>
                </div>
              </div>

              {/* ======================================================= */}
              {/* CARD BACK (Řešení, SVG Diagram, C# Anatomie, Hodnocení) */}
              {/* ======================================================= */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
                className={`absolute inset-0 w-full h-full overflow-y-auto rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-600 shadow-xl flex flex-col justify-between ${
                  !isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div className="space-y-6">
                  {/* Top Bar on Back */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          categoryConfig[currentCard.category].bg
                        } ${categoryConfig[currentCard.category].text} ${
                          categoryConfig[currentCard.category].border
                        }`}
                      >
                        {categoryConfig[currentCard.category].label}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {currentCard.title} ({currentCard.czechTitle})
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsFlipped(false)}
                      className="flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Otočit zpět</span>
                    </button>
                  </div>

                  {/* GoF / Exam Rule Banner */}
                  <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60">
                    <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-1">
                      <Info className="w-4 h-4" />
                      <span>Zkouškové pravidlo / Definice GoF</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                      {currentCard.gofRule}
                    </p>
                  </div>

                  {/* Visual SVG Diagram (Pattern UML or OOP Theory Diagram) */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span>Vizuální SVG diagram architektury</span>
                    </div>

                    {currentCard.patternId ? (
                      <PatternUMLDiagram patternKey={currentCard.patternId} />
                    ) : (
                      renderTheoryDiagram(currentCard.id)
                    )}
                  </div>

                  {/* Key C# Code Anatomy */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        <span>Klíčová C# anatomie vzoru / konceptu</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(currentCard.codeSnippet)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">
                              Zkopírováno
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Kopírovat C#</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs sm:text-[13px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                      <code>{currentCard.codeSnippet}</code>
                    </pre>
                  </div>

                  {/* When to use vs When NOT to use */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* When to use */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-xs sm:text-sm">
                      <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>✅ Kdy použít:</span>
                      </div>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                        {currentCard.whenToUse.map((w, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* When NOT to use */}
                    <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 text-xs sm:text-sm">
                      <div className="font-bold text-rose-700 dark:text-rose-400 mb-2 flex items-center space-x-1.5">
                        <XCircle className="w-4 h-4" />
                        <span>❌ Kdy NEPOUŽÍT / Anti-pattern:</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentCard.whenNotToUse}
                      </p>
                    </div>
                  </div>

                  {/* Exam Trap */}
                  {currentCard.examTrap && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <span className="font-bold">
                          ⚠️ Zkouškový chyták na zápočet:{' '}
                        </span>
                        {currentCard.examTrap}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rating Actions Bar (Leitner Leitfaden) */}
                <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Jak dobře tuto kartičku ovládáš?
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRateCard(2)}
                      className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-sm shadow transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Ještě neumím / Zopakovat (Šipka vlevo ←)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRateCard(3)}
                      className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Zvládnuto / Umím bezpečně (Šipka vpravo →)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default FlashcardDeck;
