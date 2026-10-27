import React, { useState } from 'react';
import { fillBlanksData } from '../../data/fillBlanksData';
import { RunnerOutput } from '../editor/RunnerOutput';
import { runnerService } from '../../services/runnerService';
import { RunnerResult } from '../../types/runner';
import { storageService } from '../../services/storageService';
import { CheckCircle2, XCircle, RotateCcw, Play } from 'lucide-react';

export const Mode1FillInBlanks: React.FC = () => {
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { ok: boolean; msg: string }>>({});
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [runnerResult, setRunnerResult] = useState<RunnerResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const currentExercise = fillBlanksData[exerciseIndex];

  const handleInputChange = (blankId: string, val: string) => {
    setUserInputs(prev => ({ ...prev, [blankId]: val }));
  };

  const handleCheck = () => {
    const newFeedback: Record<string, { ok: boolean; msg: string }> = {};
    let allOk = true;

    for (const b of currentExercise.blanks) {
      const input = (userInputs[b.id] || '').trim().toLowerCase();
      const isCorrect = b.correctAnswers.some(ans => ans.toLowerCase() === input);
      newFeedback[b.id] = {
        ok: isCorrect,
        msg: isCorrect
          ? `Správně! ${b.explanation}`
          : `Nesprávně. Nápověda: ${b.explanation}`
      };
      if (!isCorrect) allOk = false;
    }

    setFeedback(newFeedback);
    if (allOk) {
      storageService.markCompleted(`fillblank_${currentExercise.id}`);
    }
  };

  const handleReset = () => {
    setUserInputs({});
    setFeedback({});
    setShowSolution(false);
    setRunnerResult(null);
  };

  const handleRunFullCode = async () => {
    setIsRunning(true);
    const res = await runnerService.runCSharp(currentExercise.runnableFullCode);
    setRunnerResult(res);
    setIsRunning(false);
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
              <span>{idx + 1}. {ex.title.split(':')[0]}</span>
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
              {showSolution ? 'Skrýt řešení' : 'Zobrazit nápovědu'}
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

        {/* Blanks inputs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          {currentExercise.blanks.map((b, i) => (
            <div key={b.id} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                Doplňte mezeru #{i + 1} ({b.placeholder}):
              </label>
              <div className="flex items-center space-x-2">
                <select
                  value={userInputs[b.id] || ''}
                  onChange={(e) => handleInputChange(b.id, e.target.value)}
                  className="flex-1 p-2 rounded-lg text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Vyberte klíčové slovo --</option>
                  {b.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {feedback[b.id] && (
                <div className={`p-2 rounded-lg text-xs flex items-start space-x-1.5 ${
                  feedback[b.id].ok
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                }`}>
                  {feedback[b.id].ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />}
                  <span>{feedback[b.id].msg}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleCheck}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Zkontrolovat odpovědi
          </button>

          <button
            onClick={handleRunFullCode}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Spouštím...' : 'Spustit ověřený kód v .NET'}</span>
          </button>
        </div>

        {/* Solution Code Display */}
        {showSolution && (
          <div className="mt-6 p-4 rounded-xl bg-slate-900 text-indigo-300 font-mono text-xs overflow-x-auto border border-slate-800">
            <div className="text-[10px] text-slate-400 mb-2">// Správné řešení:</div>
            <pre className="leading-5">{currentExercise.runnableFullCode}</pre>
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
