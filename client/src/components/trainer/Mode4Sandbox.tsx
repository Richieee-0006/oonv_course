import React, { useState } from 'react';
import { sandboxTemplates } from '../../data/sandboxTemplates';
import { CodeEditor } from '../editor/CodeEditor';
import { RunnerOutput } from '../editor/RunnerOutput';
import { runnerService } from '../../services/runnerService';
import { RunnerResult } from '../../types/runner';
import { storageService } from '../../services/storageService';
import { CreditCard, Swords, Sparkles, CheckCircle2 } from 'lucide-react';

export const Mode4Sandbox: React.FC = () => {
  const [activeTemplateId, setActiveTemplateId] = useState<string>(sandboxTemplates[0].id);
  const [templateCodes, setTemplateCodes] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    sandboxTemplates.forEach(t => {
      map[t.id] = storageService.getCode(`sandbox_${t.id}`, t.initialCode);
    });
    return map;
  });
  const [runnerResult, setRunnerResult] = useState<RunnerResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);

  const currentTemplate = sandboxTemplates.find(t => t.id === activeTemplateId) || sandboxTemplates[0];
  const code = templateCodes[currentTemplate.id] || currentTemplate.initialCode;

  const handleCodeChange = (newCode: string) => {
    setTemplateCodes(prev => ({ ...prev, [currentTemplate.id]: newCode }));
    storageService.saveCode(`sandbox_${currentTemplate.id}`, newCode);
  };

  const handleRun = async () => {
    setIsRunning(true);
    const res = await runnerService.runCSharp(code);
    setRunnerResult(res);
    setIsRunning(false);
    if (res.success) {
      storageService.markCompleted(`sandbox_${currentTemplate.id}`);
    }
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    const res = await runnerService.buildCSharp(code);
    setRunnerResult(res);
    setIsBuilding(false);
  };

  const handleReset = () => {
    handleCodeChange(currentTemplate.initialCode);
    setRunnerResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Template selector tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sandboxTemplates.map((tmpl) => {
          const isActive = activeTemplateId === tmpl.id;
          const isDone = !!storageService.getProgress()[`sandbox_${tmpl.id}`];
          const Icon = tmpl.id.includes('payments') ? CreditCard : Swords;

          return (
            <button
              key={tmpl.id}
              onClick={() => {
                setActiveTemplateId(tmpl.id);
                setRunnerResult(null);
              }}
              className={`p-5 rounded-2xl border text-left flex items-start space-x-4 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className={`p-3 rounded-xl flex-shrink-0 ${
                isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              }`}>
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm sm:text-base leading-snug">
                    {tmpl.name}
                  </h4>
                  {isDone && (
                    <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tmpl.patternsUsed.map(pat => (
                    <span
                      key={pat}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {pat}
                    </span>
                  ))}
                </div>

                <p className={`text-xs mt-2 leading-relaxed ${
                  isActive ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {tmpl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Architecture Highlights Pill */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-2">
        <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Architektura kombinace vzorů v této šabloně:</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-slate-600 dark:text-slate-300">
          {currentTemplate.architectureHighlights.map((hl, i) => (
            <li key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              {hl}
            </li>
          ))}
        </ul>
      </div>

      {/* Editor & Output Stacked Vertically */}
      <div className="space-y-4">
        <CodeEditor
          code={code}
          onChange={handleCodeChange}
          onRun={handleRun}
          onBuild={handleBuild}
          onReset={handleReset}
          isRunning={isRunning}
          isBuilding={isBuilding}
          diagnostics={runnerResult?.diagnostics}
          title={currentTemplate.name}
          minHeight="460px"
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
