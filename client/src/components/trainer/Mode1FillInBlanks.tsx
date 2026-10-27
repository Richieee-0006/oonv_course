import React, { useState } from 'react';
import { fillBlanksData } from '../../data/fillBlanksData';
import { RunnerOutput } from '../editor/RunnerOutput';
import { runnerService } from '../../services/runnerService';
import { RunnerResult } from '../../types/runner';
import { storageService } from '../../services/storageService';
import { CheckCircle2, XCircle, RotateCcw, Play, HelpCircle, Check, X, ShieldAlert } from 'lucide-react';

// Levenshtein distance <= 1: single substitution, insertion or deletion
function isLevenshtein1(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1);
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}

// Normalize: lowercase, trim, remove excessive spaces, strip diacritics
function normalizeAnswer(str: string): string {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,;:!?'"„“”‚‘’()\[\]{}_\/…\-–—−]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface MatchResult {
  isCorrect: boolean;
  isTypo: boolean;
  matchedVariant?: string;
}

function matchSmartAnswer(userInput: string, correctAnswers: string[]): MatchResult {
  const normUser = normalizeAnswer(userInput);
  if (!normUser) return { isCorrect: false, isTypo: false };

  // 1. Exact match (case & whitespace insensitive)
  for (const ans of correctAnswers) {
    if (normalizeAnswer(ans) === normUser) {
      return { isCorrect: true, isTypo: false, matchedVariant: ans };
    }
  }

  // 2. Levenshtein <= 1 typo tolerance for words > 5 chars with identical first letter
  const userWords = normUser.split(' ');
  for (const ans of correctAnswers) {
    const ansWords = normalizeAnswer(ans).split(' ');
    if (userWords.length === ansWords.length) {
      const allMatch = ansWords.every((aw, i) => {
        const uw = userWords[i];
        if (aw === uw) return true;
        if (aw.length > 5 && uw.length > 5 && aw[0] === uw[0] && isLevenshtein1(aw, uw)) {
          return true;
        }
        return false;
      });
      if (allMatch) {
        return { isCorrect: true, isTypo: true, matchedVariant: ans };
      }
    }
  }

  return { isCorrect: false, isTypo: false };
}

interface BlankFeedback {
  ok: boolean;
  msg: string;
  isTypo?: boolean;
  manual?: boolean;
}

export const Mode1FillInBlanks: React.FC = () => {
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, BlankFeedback>>({});
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [runnerResult, setRunnerResult] = useState<RunnerResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const currentExercise = fillBlanksData[exerciseIndex];

  const handleInputChange = (blankId: string, val: string) => {
    setUserInputs(prev => ({ ...prev, [blankId]: val }));
  };

  const handleCheck = () => {
    const newFeedback: Record<string, BlankFeedback> = {};
    let allOk = true;

    for (const b of currentExercise.blanks) {
      const input = userInputs[b.id] || '';
      const match = matchSmartAnswer(input, b.correctAnswers);

      let msg = '';
      if (match.isCorrect) {
        if (match.isTypo) {
          msg = `Správně (uznán drobný překlep pro "${match.matchedVariant}"). ${b.explanation}`;
        } else {
          msg = `Správně! ${b.explanation}`;
        }
      } else {
        msg = `Nesprávně. Nápověda: ${b.explanation}`;
        allOk = false;
      }

      newFeedback[b.id] = {
        ok: match.isCorrect,
        msg,
        isTypo: match.isTypo,
        manual: false
      };
    }

    setFeedback(newFeedback);
    if (allOk) {
      storageService.markCompleted(`fillblank_${currentExercise.id}`);
    }
  };

  const handleManualOverride = (blankId: string) => {
    const currentFb = feedback[blankId];
    if (!currentFb) return;

    const newOk = !currentFb.ok;
    const b = currentExercise.blanks.find(item => item.id === blankId);
    const updatedFeedback: Record<string, BlankFeedback> = {
      ...feedback,
      [blankId]: {
        ok: newOk,
        msg: newOk
          ? `Uznáno ručně jako správné. ${b?.explanation || ''}`
          : `Ručně označeno jako špatné. ${b?.explanation || ''}`,
        manual: true
      }
    };
    setFeedback(updatedFeedback);

    const allOkNow = currentExercise.blanks.every(item => updatedFeedback[item.id]?.ok);
    if (allOkNow) {
      storageService.markCompleted(`fillblank_${currentExercise.id}`);
    }
  };

  const handleReset = () => {
    setUserInputs({});
    setFeedback({});
    setShowSolution(false);
    setRunnerResult(null);
  };

  const buildSubstitutedCode = (): string => {
    let code = currentExercise.runnableFullCode;
    for (const b of currentExercise.blanks) {
      const rawVal = userInputs[b.id];
      const val = (rawVal !== undefined && rawVal.trim() !== '') ? rawVal.trim() : '/* CHYBĚJÍCÍ KLÍČOVÉ SLOVO */';
      code = code.replaceAll(`{{${b.id}}}`, val);
    }
    return code;
  };

  const handleRunSubstitutedCode = async () => {
    setIsRunning(true);
    const codeToExecute = buildSubstitutedCode();
    const res = await runnerService.runCSharp(codeToExecute);
    setRunnerResult(res);
    setIsRunning(false);
  };

  // Helper to render code template with inline interactive inputs
  const renderInteractiveTemplate = () => {
    const lines = currentExercise.codeTemplate.split('\n');
    return lines.map((line, lineIdx) => {
      const parts = line.split(/(\{\{blank_\d+\}\})/g);
      return (
        <div key={lineIdx} className="leading-6 min-h-[1.5rem] whitespace-pre">
          {parts.map((part, partIdx) => {
            const match = part.match(/^\{\{(blank_\d+)\}\}$/);
            if (match) {
              const blankId = match[1];
              const blankNum = blankId.replace('blank_', '');
              const fb = feedback[blankId];
              const val = userInputs[blankId] || '';
              const width = Math.max(95, Math.min(220, (val.length + 3) * 9.5));

              let borderStyle = 'border-indigo-500/70 bg-slate-900 text-indigo-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400';
              if (fb) {
                if (fb.ok) {
                  borderStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold';
                } else {
                  borderStyle = 'border-rose-500 bg-rose-950/60 text-rose-300 font-bold';
                }
              }

              return (
                <span key={partIdx} className="inline-flex items-center space-x-1 align-middle mx-1 my-0.5">
                  <span className="text-[10px] font-bold text-indigo-400">#{blankNum}</span>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleInputChange(blankId, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheck();
                    }}
                    placeholder="doplň..."
                    style={{ width: `${width}px` }}
                    className={`font-mono text-xs px-2 py-0.5 rounded border text-center transition-all outline-none ${borderStyle}`}
                  />
                </span>
              );
            }
            return <span key={partIdx} className="text-slate-200">{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Exercise Selector */}
      <div className="flex flex-wrap gap-2">
        {fillBlanksData.map((ex, idx) => {
          const isDone = !!storageService.getProgress()[`fillblank_${ex.id}`];
          return (
            <button
              key={ex.id}
              onClick={() => {
                setExerciseIndex(idx);
                handleReset();
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-all ${
                exerciseIndex === idx
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>Úloha {idx + 1} ({ex.category})</span>
            </button>
          );
        })}
      </div>

      {/* Main Exercise Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {currentExercise.category}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {currentExercise.title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentExercise.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {showSolution ? 'Skrýt řešení' : 'Nápověda'}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Resetovat odpovědi"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Code Template with Inline Inputs */}
        <div className="my-5 rounded-2xl bg-slate-950 p-5 font-mono text-xs border border-slate-800 overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-[10px] text-slate-400">
            <span>Doplňte chybějící C# klíčová slova přímo do kódu:</span>
            <span className="text-indigo-400 font-mono">Chytrá kontrola (překlep Levenshtein ≤ 1)</span>
          </div>
          <div className="font-mono text-xs leading-relaxed">
            {renderInteractiveTemplate()}
          </div>
        </div>

        {/* Feedback & Manual Override Controls */}
        {Object.keys(feedback).length > 0 && (
          <div className="space-y-2 mb-5">
            {currentExercise.blanks.map((b, i) => {
              const fb = feedback[b.id];
              if (!fb) return null;
              return (
                <div
                  key={b.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                    fb.ok
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {fb.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold mr-1">Mezera #{i + 1}:</span>
                      <span>{fb.msg}</span>
                    </div>
                  </div>

                  {/* Manual override button */}
                  <button
                    onClick={() => handleManualOverride(b.id)}
                    className="self-end sm:self-auto text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center space-x-1"
                    title="Ruční oprava hodnocení"
                  >
                    {fb.ok ? (
                      <>
                        <X className="w-3 h-3 text-rose-500" />
                        <span>Označit jako špatně</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Uznat jako správně</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCheck}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Zkontrolovat doplňovačku</span>
          </button>

          <button
            onClick={handleRunSubstitutedCode}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
            title="Spustí kód s vašimi doplněnými slovy v reálném .NET SDK"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? 'Kompiluji a spouštím...' : 'Spustit v C# (.NET SDK)'}</span>
          </button>
        </div>

        {/* Solution View */}
        {showSolution && (
          <div className="mt-6 p-4 rounded-xl bg-slate-900 text-indigo-300 font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-amber-400 flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Správná klíčová slova k doplnění:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {currentExercise.blanks.map((b, i) => (
                <li key={b.id}>
                  <strong>Mezera #{i + 1}:</strong> <code className="text-emerald-400 font-bold">{b.correctAnswers.join(' nebo ')}</code> — {b.explanation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Runner Output */}
        {runnerResult && (
          <div className="mt-6">
            <RunnerOutput result={runnerResult} onClear={() => setRunnerResult(null)} />
          </div>
        )}
      </div>
    </div>
  );
};
