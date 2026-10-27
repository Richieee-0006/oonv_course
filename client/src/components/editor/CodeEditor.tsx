import React, { useRef, useState } from 'react';
import { Play, Hammer, Copy, Check, RotateCcw, AlertCircle } from 'lucide-react';
import { RoslynDiagnostic } from '../../types/runner';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language?: 'csharp' | 'python';
  onRun?: () => void;
  onBuild?: () => void;
  onReset?: () => void;
  isRunning?: boolean;
  isBuilding?: boolean;
  diagnostics?: RoslynDiagnostic[];
  title?: string;
  readOnly?: boolean;
  minHeight?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language = 'csharp',
  onRun,
  onBuild,
  onReset,
  isRunning = false,
  isBuilding = false,
  diagnostics = [],
  title,
  readOnly = false,
  minHeight = '320px',
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Group errors by line number for gutter indicators
  const errorsByLine = React.useMemo(() => {
    const map = new Map<number, RoslynDiagnostic[]>();
    for (const d of diagnostics) {
      if (!map.has(d.line)) {
        map.set(d.line, []);
      }
      map.get(d.line)!.push(d);
    }
    return map;
  }, [diagnostics]);

  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onRun && !isRunning) {
        onRun();
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col">
      {/* Editor Top Bar */}
      <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
            {language === 'csharp' ? 'Program.cs (C# 12 / .NET 9)' : 'main.py (Python 3)'}
          </span>
          {title && (
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium border-l border-slate-300 dark:border-slate-700 pl-2">
              {title}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {onBuild && (
            <button
              onClick={onBuild}
              disabled={isBuilding || isRunning}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              title="Zkompilovat kód přes Roslyn (rychlá kontrola syntaxe)"
            >
              <Hammer className={`w-3.5 h-3.5 ${isBuilding ? 'animate-spin' : ''}`} />
              <span>{isBuilding ? 'Stavím...' : 'Kompilovat'}</span>
            </button>
          )}

          {onRun && (
            <button
              onClick={onRun}
              disabled={isRunning || isBuilding}
              className="flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm disabled:opacity-50"
              title="Spustit kód (Ctrl+Enter)"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
              <span>{isRunning ? 'Běží...' : 'Spustit v C#'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Kopírovat kód"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {onReset && (
            <button
              onClick={onReset}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Obnovit výchozí kód"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body with Gutter */}
      <div className="relative flex font-mono text-sm leading-6" style={{ minHeight }}>
        {/* Line Numbers Gutter */}
        <div className="select-none py-3 px-2 bg-slate-50 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800 text-right text-slate-400 dark:text-slate-600 text-xs flex flex-col items-end min-w-[3rem]">
          {lines.map((_, idx) => {
            const lineNum = idx + 1;
            const lineErrors = errorsByLine.get(lineNum);
            return (
              <div key={lineNum} className="h-6 flex items-center justify-end space-x-1 w-full">
                {lineErrors && lineErrors.length > 0 && (
                  <span title={lineErrors.map(e => e.message).join('\n')}>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  </span>
                )}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Text Area */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="w-full h-full min-h-[320px] p-3 font-mono text-sm leading-6 bg-transparent text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-0 selection:bg-indigo-500/20"
            placeholder="// Zde napište svůj C# kód..."
          />
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
        <span>Zkratka pro spuštění: <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Ctrl</kbd> + <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Enter</kbd></span>
        <span>{lines.length} řádků • UTF-8</span>
      </div>
    </div>
  );
};
