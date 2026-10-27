import React, { useState } from 'react';
import { CodeEditor } from '../editor/CodeEditor';
import { RunnerOutput } from '../editor/RunnerOutput';
import { runnerService } from '../../services/runnerService';
import { RunnerResult } from '../../types/runner';
import { storageService } from '../../services/storageService';
import { Code2, Sparkles, Terminal } from 'lucide-react';

const DEFAULT_CODE = `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        Console.WriteLine("Vítejte ve volném C# pískovišti!");
        Console.WriteLine($"Běží na: .NET {Environment.Version}");

        var cisla = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        var sudaCisla = cisla.Where(x => x % 2 == 0).Select(x => x * x).ToList();

        Console.WriteLine("Čtverce sudých čísel (LINQ): " + string.Join(", ", sudaCisla));
    }
}`;

const TEMPLATES: Record<string, { name: string; code: string }> = {
  default: {
    name: 'Základní program (LINQ & Console)',
    code: DEFAULT_CODE
  },
  polymorphism: {
    name: 'Polymorfismus přes rozhraní',
    code: `using System;

public interface IZvire
{
    void VydejZvuk();
}

public class Pes : IZvire
{
    public void VydejZvuk() => Console.WriteLine("Haf haf!");
}

public class Kocka : IZvire
{
    public void VydejZvuk() => Console.WriteLine("Mňau!");
}

public class Program
{
    public static void Main()
    {
        IZvire[] zvirata = { new Pes(), new Kocka() };
        foreach (var z in zvirata)
        {
            z.VydejZvuk();
        }
    }
}`
  },
  recordStruct: {
    name: 'Record a Struct (C# Value typy)',
    code: `using System;

// Record struct = Hodnotový typ na Stacku s automatickým porovnáváním hodnot
public readonly record struct Bod2D(double X, double Y);

public class Program
{
    public static void Main()
    {
        Bod2D a = new Bod2D(10.5, 20.0);
        Bod2D b = new Bod2D(10.5, 20.0);

        Console.WriteLine($"a: {a}");
        Console.WriteLine($"Rovnají se hodnotově? {a == b}");
    }
}`
  }
};

export const Playground: React.FC = () => {
  const [code, setCode] = useState<string>(() => storageService.getCode('playground', DEFAULT_CODE));
  const [stdin, setStdin] = useState<string>('');
  const [runnerResult, setRunnerResult] = useState<RunnerResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    storageService.saveCode('playground', newCode);
  };

  const handleRun = async () => {
    setIsRunning(true);
    const res = await runnerService.runCSharp(code, stdin);
    setRunnerResult(res);
    setIsRunning(false);
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    const res = await runnerService.buildCSharp(code);
    setRunnerResult(res);
    setIsBuilding(false);
  };

  const handleSelectTemplate = (key: string) => {
    const tmpl = TEMPLATES[key];
    if (tmpl) {
      handleCodeChange(tmpl.code);
      setRunnerResult(null);
    }
  };

  return (
    <article className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <Code2 className="w-4 h-4" />
          <span>Volný C# Editor &amp; Kompilátor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Volné C# Pískoviště
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Napiš libovolný C# kód, vyzkoušej si chování jazyka nebo vlastní návrhový vzor.
          Kód se kompiluje a spouští v reálném .NET SDK prostředí.
        </p>
      </header>

      {/* Templates Row */}
      <nav aria-label="Rychlé šablony pískoviště" className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Rychlé šablony:</span>
        </span>
        {Object.entries(TEMPLATES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => handleSelectTemplate(key)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            {t.name}
          </button>
        ))}
      </nav>

      {/* Stdin option */}
      <section aria-label="Standardní vstup programu" className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span>Vstup pro program (Standard Input / stdin):</span>
        </div>
        <input
          type="text"
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="Volitelný text předaný do Console.ReadLine()..."
          className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </section>

      {/* Editor & Output Stacked Vertically */}
      <section aria-label="Editor kódu a výstupní konzole" className="space-y-4">
        <CodeEditor
          code={code}
          onChange={handleCodeChange}
          onRun={handleRun}
          onBuild={handleBuild}
          onReset={() => handleCodeChange(DEFAULT_CODE)}
          isRunning={isRunning}
          isBuilding={isBuilding}
          diagnostics={runnerResult?.diagnostics}
          title="Playground.cs"
          minHeight="420px"
        />

        <RunnerOutput
          result={runnerResult}
          isRunning={isRunning || isBuilding}
          onClear={() => setRunnerResult(null)}
        />
      </section>
    </article>
  );
};
