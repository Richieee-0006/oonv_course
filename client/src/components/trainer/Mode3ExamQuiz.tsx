import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { quizQuestions } from '../../data/quizData';
import { QuizQuestion, QuizOption } from '../../types/trainer';
import { RunnerOutput } from '../editor/RunnerOutput';
import { runnerService } from '../../services/runnerService';
import { RunnerResult } from '../../types/runner';
import { storageService } from '../../services/storageService';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Award,
  Flame,
  Timer,
  AlertTriangle,
  Shuffle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const MISTAKES_STORAGE_KEY = 'oonv_quiz_mistakes';

type QuizSubMode = 'practice' | 'timed' | 'suddendeath' | 'mistakes';

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const Mode3ExamQuiz: React.FC = () => {
  const [subMode, setSubMode] = useState<QuizSubMode>('practice');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [runnerResult, setRunnerResult] = useState<RunnerResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [shuffleSeed, setShuffleSeed] = useState<number>(1);
  const [suddenDeathLost, setSuddenDeathLost] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  // Timed Exam state (10 minutes = 600s)
  const [secondsLeft, setSecondsLeft] = useState<number>(600);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);

  // Mistake IDs persisted in localStorage
  const [mistakeIds, setMistakeIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(MISTAKES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const saveMistakes = (ids: string[]) => {
    setMistakeIds(ids);
    try {
      localStorage.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  };

  // Active question pool depending on subMode
  const activeQuestions: QuizQuestion[] = useMemo(() => {
    if (subMode === 'mistakes') {
      return quizQuestions.filter(q => mistakeIds.includes(q.id));
    }
    if (subMode === 'timed' || subMode === 'suddendeath') {
      return shuffleArray(quizQuestions);
    }
    return quizQuestions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subMode, shuffleSeed, mistakeIds.length]);

  // Pre-shuffled options per question so correct answer is NOT always 'b'
  const shuffledOptionsMap = useMemo(() => {
    const map: Record<string, QuizOption[]> = {};
    quizQuestions.forEach(q => {
      map[q.id] = shuffleArray(q.options);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleSeed]);

  // Countdown timer for timed exam
  useEffect(() => {
    if (subMode !== 'timed' || examSubmitted) return;
    const t = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setExamSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [subMode, examSubmitted]);

  const currentQ: QuizQuestion | undefined = activeQuestions[currentIdx] || activeQuestions[0];
  const currentOptions: QuizOption[] = currentQ ? (shuffledOptionsMap[currentQ.id] || currentQ.options) : [];
  const selectedOptionId = currentQ ? selectedAnswers[currentQ.id] : undefined;
  const isAnswered = selectedOptionId !== undefined;
  const isExplained = currentQ ? (subMode === 'timed' ? examSubmitted : !!showExplanation[currentQ.id]) : false;

  const handleSelectOption = useCallback((optId: string) => {
    if (!currentQ) return;
    if (subMode !== 'timed' && isAnswered) return;
    if (subMode === 'timed' && examSubmitted) return;
    if (subMode === 'suddendeath' && suddenDeathLost) return;

    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optId }));
    if (subMode !== 'timed') {
      setShowExplanation(prev => ({ ...prev, [currentQ.id]: true }));
    }

    const option = currentQ.options.find(o => o.id === optId);
    if (option?.isCorrect) {
      storageService.markCompleted(`quiz_${currentQ.id}`);
      setStreak(s => s + 1);
      if (mistakeIds.includes(currentQ.id)) {
        saveMistakes(mistakeIds.filter(id => id !== currentQ.id));
      }
    } else {
      setStreak(0);
      if (!mistakeIds.includes(currentQ.id)) {
        saveMistakes([...mistakeIds, currentQ.id]);
      }
      if (subMode === 'suddendeath') {
        setSuddenDeathLost(true);
      }
    }
  }, [currentQ, subMode, isAnswered, examSubmitted, suddenDeathLost, mistakeIds]);

  // Keyboard shortcuts: 1-4 to pick option, ArrowLeft/ArrowRight to navigate
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentOptions[idx]) {
          e.preventDefault();
          handleSelectOption(currentOptions[idx].id);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIdx(i => Math.min(activeQuestions.length - 1, i + 1));
        setRunnerResult(null);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIdx(i => Math.max(0, i - 1));
        setRunnerResult(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentOptions, handleSelectOption, activeQuestions.length]);

  const handleRunSnippet = async () => {
    if (!currentQ) return;
    setIsRunning(true);
    const res = await runnerService.runCSharp(currentQ.codeSnippet);
    setRunnerResult(res);
    setIsRunning(false);
  };

  const handleReset = (nextMode: QuizSubMode = subMode) => {
    setSubMode(nextMode);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowExplanation({});
    setRunnerResult(null);
    setSuddenDeathLost(false);
    setStreak(0);
    setSecondsLeft(600);
    setExamSubmitted(false);
    setShuffleSeed(s => s + 1);
  };

  const correctCount = activeQuestions.filter(q => {
    const selected = selectedAnswers[q.id];
    return q.options.find(o => o.id === selected)?.isCorrect;
  }).length;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Sub-mode Switcher (Inspired by TZI-TIN-app) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleReset('practice')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              subMode === 'practice'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Trénink ({quizQuestions.length})</span>
          </button>

          <button
            onClick={() => handleReset('timed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              subMode === 'timed'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Zkouška nanečisto (10 min)</span>
          </button>

          <button
            onClick={() => handleReset('suddendeath')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              subMode === 'suddendeath'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Náhlá smrt (1 chyba = konec)</span>
          </button>

          <button
            onClick={() => handleReset('mistakes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              subMode === 'mistakes'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Opravna chyb ({mistakeIds.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {subMode === 'timed' && (
            <div className={`px-3 py-1 rounded-lg font-mono font-bold flex items-center space-x-1.5 ${
              secondsLeft < 60 ? 'bg-rose-100 dark:bg-rose-950 text-rose-600' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
            }`}>
              <Timer className="w-3.5 h-3.5" />
              <span>{formatTime(secondsLeft)}</span>
            </div>
          )}

          {subMode === 'suddendeath' && (
            <div className="px-3 py-1 rounded-lg font-mono font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Série: {streak}</span>
            </div>
          )}

          <button
            onClick={() => handleReset(subMode)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1"
            title="Zamíchat pořadí odpovědí a resetovat"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Zamíchat</span>
          </button>
        </div>
      </div>

      {/* Empty Mistakes State */}
      {activeQuestions.length === 0 || !currentQ ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Nemáš žádné uložené chyby!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Všechny zodpovězené otázky jsi měl správně. Přepni do režimu Trénink nebo Zkouška nanečisto.
          </p>
        </div>
      ) : (
        <>
          {/* Progress Bar & Question Pills */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Skóre: <span className="text-indigo-600 dark:text-indigo-400">{correctCount} / {activeQuestions.length}</span>
              <span className="ml-2 text-slate-400 font-normal">(Klávesy 1–4 pro výběr, šipky ←/→ pro posun)</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {activeQuestions.map((q, idx) => {
                const answered = selectedAnswers[q.id];
                const isCorrect = q.options.find(o => o.id === answered)?.isCorrect;
                const showResultColor = subMode !== 'timed' || examSubmitted;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setRunnerResult(null);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                      currentIdx === idx ? 'ring-2 ring-indigo-500 font-extrabold' : ''
                    } ${
                      answered === undefined
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        : !showResultColor
                        ? 'bg-indigo-600 text-white'
                        : isCorrect
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {subMode === 'timed' && !examSubmitted && (
              <button
                onClick={() => setExamSubmitted(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Odevzdat test
              </button>
            )}
          </div>

          {/* Sudden Death Game Over Banner */}
          {subMode === 'suddendeath' && suddenDeathLost && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 flex items-center justify-between">
              <div className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 font-semibold">
                Konec hry v Náhlé smrti! Dosáhl jsi série <strong>{streak}</strong> správných odpovědí v řadě.
              </div>
              <button
                onClick={() => handleReset('suddendeath')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Zkusit znovu</span>
              </button>
            </div>
          )}

          {/* Main Question Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400">
                  Otázka {currentIdx + 1} z {activeQuestions.length} • Kategorie: {currentQ.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {currentQ.title}
                </h3>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => {
                    setCurrentIdx(i => Math.max(0, i - 1));
                    setRunnerResult(null);
                  }}
                  disabled={currentIdx === 0}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentIdx(i => Math.min(activeQuestions.length - 1, i + 1));
                    setRunnerResult(null);
                  }}
                  disabled={currentIdx === activeQuestions.length - 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs border border-slate-800 text-slate-200 overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <span>Analyzuj následující C# kód:</span>
                <span>C# / Roslyn</span>
              </div>
              <pre className="leading-relaxed text-indigo-200 whitespace-pre-wrap">{currentQ.codeSnippet}</pre>
            </div>

            {/* Shuffled Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentOptions.map((opt, optIdx) => {
                const isSelected = selectedOptionId === opt.id;
                let style = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-indigo-400 text-slate-800 dark:text-slate-200';

                if (isAnswered && (subMode !== 'timed' || examSubmitted)) {
                  if (opt.isCorrect) {
                    style = 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-semibold';
                  } else if (isSelected && !opt.isCorrect) {
                    style = 'border-rose-500 bg-rose-50/90 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200';
                  } else {
                    style = 'border-slate-200 dark:border-slate-800 opacity-50';
                  }
                } else if (isSelected && subMode === 'timed' && !examSubmitted) {
                  style = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-semibold';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-2xl border text-left font-mono text-xs flex items-start justify-between transition-all ${style}`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {optIdx + 1}
                      </span>
                      <span className="whitespace-pre-line leading-5">{opt.text}</span>
                    </div>
                    {isAnswered && (subMode !== 'timed' || examSubmitted) && opt.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-2" />
                    )}
                    {isAnswered && (subMode !== 'timed' || examSubmitted) && isSelected && !opt.isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Live Verification */}
            {isExplained && (
              <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                <div className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">
                  Vysvětlení ke zkoušce:
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
                {currentQ.memoryDiagramNote && (
                  <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs">
                    {currentQ.memoryDiagramNote}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={handleRunSnippet}
                    disabled={isRunning}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isRunning ? 'Spouštím...' : 'Ověřit spuštěním v .NET SDK'}</span>
                  </button>
                </div>
              </div>
            )}

            {runnerResult && (
              <RunnerOutput result={runnerResult} onClear={() => setRunnerResult(null)} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
