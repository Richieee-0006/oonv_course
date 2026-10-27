import React, { useState } from 'react';
import { quizQuestions } from '../../data/quizData';
import { RunnerOutput } from '../editor/RunnerOutput';
import { runnerService } from '../../services/runnerService';
import { RunnerResult } from '../../types/runner';
import { storageService } from '../../services/storageService';
import { HelpCircle, CheckCircle2, XCircle, Play, RotateCcw, Award } from 'lucide-react';

export const Mode3ExamQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [runnerResult, setRunnerResult] = useState<RunnerResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const currentQ = quizQuestions[currentIdx];
  const selectedOptionId = selectedAnswers[currentQ.id];
  const isAnswered = selectedOptionId !== undefined;
  const isExplained = !!showExplanation[currentQ.id];

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return; // Locked once answered
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optId }));
    setShowExplanation(prev => ({ ...prev, [currentQ.id]: true }));

    const option = currentQ.options.find(o => o.id === optId);
    if (option?.isCorrect) {
      storageService.markCompleted(`quiz_${currentQ.id}`);
    }
  };

  const handleRunSnippet = async () => {
    setIsRunning(true);
    const res = await runnerService.runCSharp(currentQ.codeSnippet);
    setRunnerResult(res);
    setIsRunning(false);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setRunnerResult(null);
  };

  const correctCount = Object.keys(selectedAnswers).filter(qId => {
    const q = quizQuestions.find(item => item.id === qId);
    const selected = selectedAnswers[qId];
    return q?.options.find(o => o.id === selected)?.isCorrect;
  }).length;

  return (
    <div className="space-y-6">
      {/* Quiz Progress & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Zkouškové skóre</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {correctCount} správně z {quizQuestions.length} otázek
            </div>
          </div>
        </div>

        {/* Question pills */}
        <div className="flex flex-wrap gap-1.5">
          {quizQuestions.map((q, idx) => {
            const answered = selectedAnswers[q.id];
            const isCorrect = q.options.find(o => o.id === answered)?.isCorrect;
            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIdx(idx);
                  setRunnerResult(null);
                }}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                  currentIdx === idx
                    ? 'ring-2 ring-indigo-500 font-extrabold'
                    : ''
                } ${
                  answered === undefined
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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

        <button
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Resetovat kvíz</span>
        </button>
      </div>

      {/* Main Question Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400">
            Otázka {currentIdx + 1} z {quizQuestions.length} • Kategorie: {currentQ.category}
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {currentQ.title}
          </h3>
        </div>

        {/* Code Snippet Box */}
        <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs border border-slate-800 text-slate-200 overflow-x-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
            <span>Co vypíše metoda Main()?</span>
            <button
              onClick={handleRunSnippet}
              disabled={isRunning}
              className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isRunning ? 'Spouštím...' : 'Spustit v .NET'}</span>
            </button>
          </div>
          <pre className="leading-5 text-indigo-300">{currentQ.codeSnippet}</pre>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Zvolte správný výstup:
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let style = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200';

              if (isExplained) {
                if (opt.isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold';
                } else if (isSelected && !opt.isCorrect) {
                  style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition-all ${style}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                    {opt.id.toUpperCase()}
                  </span>
                  <div className="flex-1 font-mono text-xs whitespace-pre-wrap leading-5">
                    {opt.text}
                  </div>
                  {isExplained && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  )}
                  {isExplained && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Card */}
        {isExplained && (
          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-2 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
            <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5 text-sm">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>Detailní zkouškový výklad:</span>
            </div>
            <p>{currentQ.explanation}</p>
            {currentQ.memoryDiagramNote && (
              <div className="p-2.5 rounded-lg bg-slate-900 text-indigo-300 font-mono text-[11px] border border-slate-800 mt-2">
                <strong>Paměťový model:</strong> {currentQ.memoryDiagramNote}
              </div>
            )}
          </div>
        )}

        {/* Runner Output if executed */}
        {runnerResult && (
          <div className="mt-4">
            <RunnerOutput result={runnerResult} onClear={() => setRunnerResult(null)} />
          </div>
        )}
      </div>
    </div>
  );
};
