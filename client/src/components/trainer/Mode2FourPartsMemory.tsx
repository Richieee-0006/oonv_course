import React, { useState } from 'react';
import { fourPartsData } from '../../data/fourPartsData';
import { CodeEditor } from '../editor/CodeEditor';
import { RunnerOutput } from '../editor/RunnerOutput';
import { clientValidator } from '../../services/clientValidator';
import { runnerService } from '../../services/runnerService';
import { RunnerResult } from '../../types/runner';
import { storageService } from '../../services/storageService';
import { CheckCircle2 } from 'lucide-react';

export const Mode2FourPartsMemory: React.FC = () => {
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [userCodes, setUserCodes] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    fourPartsData.forEach(ex => {
      map[ex.id] = storageService.getCode(`fourparts_${ex.id}`, ex.starterCode);
    });
    return map;
  });
  const [runnerResult, setRunnerResult] = useState<RunnerResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);

  const currentExercise = fourPartsData[exerciseIndex];
  const code = userCodes[currentExercise.id] || currentExercise.starterCode;

  // Real-time structural validation of the 4 parts
  const validation = clientValidator.validateFourPartsPattern(code, currentExercise.validationRules);

  const handleCodeChange = (newCode: string) => {
    setUserCodes(prev => ({ ...prev, [currentExercise.id]: newCode }));
    storageService.saveCode(`fourparts_${currentExercise.id}`, newCode);
  };

  const handleRun = async () => {
    setIsRunning(true);
    const res = await runnerService.runCSharp(code);
    setRunnerResult(res);
    setIsRunning(false);
    if (res.success && validation.allPassed) {
      storageService.markCompleted(`fourparts_${currentExercise.id}`);
    }
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    const res = await runnerService.buildCSharp(code);
    setRunnerResult(res);
    setIsBuilding(false);
  };

  const handleLoadSolution = () => {
    handleCodeChange(currentExercise.solutionCode);
  };

  const handleResetStarter = () => {
    handleCodeChange(currentExercise.starterCode);
    setRunnerResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Exercise selector */}
      <div className="flex flex-wrap gap-2">
        {fourPartsData.map((ex, idx) => {
          const isDone = !!storageService.getProgress()[`fourparts_${ex.id}`];
          return (
            <button
              key={ex.id}
              onClick={() => {
                setExerciseIndex(idx);
                setRunnerResult(null);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-all ${
                exerciseIndex === idx
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{ex.patternName} ({ex.pageReference.split(' - ')[0]})</span>
            </button>
          );
        })}
      </div>

      {/* 4 Parts Checklist Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Pravidlo str. 16 z PDF
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {currentExercise.title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentExercise.scenario}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLoadSolution}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Načíst vzorové řešení
            </button>
            <button
              onClick={handleResetStarter}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Výchozí šablona
            </button>
          </div>
        </div>

        {/* 4 Parts Live Validation Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
          {/* Part 1 */}
          <div className={`p-3 rounded-xl border text-xs ${
            validation.part1Ok
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center space-x-1.5 font-bold mb-1">
              {validation.part1Ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px]">1</div>}
              <span>1. Rozhraní produktu</span>
            </div>
            <div className="text-[11px] leading-snug">{validation.part1Msg}</div>
          </div>

          {/* Part 2 */}
          <div className={`p-3 rounded-xl border text-xs ${
            validation.part2Ok
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center space-x-1.5 font-bold mb-1">
              {validation.part2Ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px]">2</div>}
              <span>2. Konkrétní produkt</span>
            </div>
            <div className="text-[11px] leading-snug">{validation.part2Msg}</div>
          </div>

          {/* Part 3 */}
          <div className={`p-3 rounded-xl border text-xs ${
            validation.part3Ok
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center space-x-1.5 font-bold mb-1">
              {validation.part3Ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px]">3</div>}
              <span>3. Samotný vzor</span>
            </div>
            <div className="text-[11px] leading-snug">{validation.part3Msg}</div>
          </div>

          {/* Part 4 */}
          <div className={`p-3 rounded-xl border text-xs ${
            validation.part4Ok
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center space-x-1.5 font-bold mb-1">
              {validation.part4Ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px]">4</div>}
              <span>4. Main (Vlevo=I, Vpravo=C)</span>
            </div>
            <div className="text-[11px] leading-snug">{validation.part4Msg}</div>
          </div>
        </div>
      </div>

      {/* Editor & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <CodeEditor
          code={code}
          onChange={handleCodeChange}
          onRun={handleRun}
          onBuild={handleBuild}
          onReset={handleResetStarter}
          isRunning={isRunning}
          isBuilding={isBuilding}
          diagnostics={runnerResult?.diagnostics}
          title={`4 Části: ${currentExercise.patternName}`}
          minHeight="420px"
        />

        <RunnerOutput
          result={runnerResult}
          isRunning={isRunning || isBuilding}
          onClear={() => setRunnerResult(null)}
        />
      </div>
    </div>
  );
};
