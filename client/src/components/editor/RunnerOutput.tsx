import React from 'react';
import { RunnerResult } from '../../types/runner';
import { Terminal, Clock, CheckCircle2, XCircle, AlertTriangle, Trash2, WifiOff } from 'lucide-react';

interface RunnerOutputProps {
  result: RunnerResult | null;
  isRunning?: boolean;
  onClear?: () => void;
}

export const RunnerOutput: React.FC<RunnerOutputProps> = ({ result, isRunning = false, onClear }) => {
  if (!result && !isRunning) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-400 p-6 flex flex-col items-center justify-center text-center font-mono text-sm min-h-[160px]">
        <Terminal className="w-8 h-8 mb-2 opacity-30 text-slate-400" />
        <p className="text-slate-500">Konzole je připravena. Klikněte na &quot;Spustit v C#&quot; nebo stiskněte Ctrl+Enter.</p>
      </div>
    );
  }

  const isSuccess = result?.success;
  const diagnostics = result?.diagnostics || [];
  const errors = diagnostics.filter(d => d.severity === 'error');
  const warnings = diagnostics.filter(d => d.severity === 'warning');

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 overflow-hidden shadow-md flex flex-col font-mono text-sm">
      {/* Console Header */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-xs tracking-wider text-slate-300 uppercase">
            Výstupní konzole
          </span>

          {isRunning && (
            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              <span>Probíhá kompilace Roslyn...</span>
            </span>
          )}

          {!isRunning && result && (
            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold ${
              isSuccess
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                : 'bg-rose-950/80 text-rose-400 border border-rose-800'
            }`}>
              {isSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              <span>{isSuccess ? 'Exit 0 (Úspěch)' : 'Chyba běhu'}</span>
            </span>
          )}

          {result?.offline && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-800">
              <WifiOff className="w-3 h-3" />
              <span>Offline simulátor</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-400">
          {result?.executionTimeMs !== undefined && (
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{result.executionTimeMs} ms</span>
            </span>
          )}
          {onClear && (
            <button
              onClick={onClear}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Vymazat konzoli"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Roslyn Diagnostics if any */}
      {diagnostics.length > 0 && (
        <div className="border-b border-slate-800 bg-slate-900/40 p-3 space-y-1.5 text-xs">
          <div className="flex items-center space-x-2 text-slate-400 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">
              Diagnostika kompilátoru Roslyn ({errors.length} chyb, {warnings.length} varování):
            </span>
          </div>
          {diagnostics.map((diag, i) => (
            <div
              key={i}
              className={`p-2 rounded border ${
                diag.severity === 'error'
                  ? 'bg-rose-950/30 border-rose-900/60 text-rose-300'
                  : 'bg-amber-950/30 border-amber-900/60 text-amber-300'
              }`}
            >
              <span className="font-bold underline decoration-dotted mr-1">
                {diag.file}({diag.line},{diag.column}):
              </span>
              <span className="font-semibold uppercase tracking-wider text-[10px] px-1 py-0.5 rounded bg-black/40 mr-1.5">
                {diag.code}
              </span>
              <span>{diag.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stdout / Stderr output text */}
      <div className="p-4 overflow-x-auto min-h-[140px] max-h-[360px] text-xs leading-5">
        {result?.stdout && (
          <pre className="text-emerald-300 whitespace-pre-wrap">{result.stdout}</pre>
        )}
        {result?.stderr && (
          <pre className="text-rose-400 whitespace-pre-wrap mt-2">{result.stderr}</pre>
        )}
        {result?.output && !result.stdout && !result.stderr && (
          <pre className={`whitespace-pre-wrap ${isSuccess ? 'text-slate-300' : 'text-rose-400'}`}>
            {result.output}
          </pre>
        )}
        {result?.error && (
          <div className="text-rose-400 mt-2 font-semibold">
            {result.error}
          </div>
        )}
      </div>
    </div>
  );
};
