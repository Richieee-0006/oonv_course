import { BackendHealth, RunnerResult } from '../types/runner';
import { clientValidator } from './clientValidator';

const API_URLS = ['/api', 'http://localhost:3001/api', 'http://127.0.0.1:3001/api'];

async function fetchBackend(endpoint: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  let lastError: unknown;
  for (const base of API_URLS) {
    try {
      const res = await fetch(`${base}${endpoint}`, {
        ...options,
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (res.ok || res.status === 400 || res.status === 500) {
        return res;
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Backend unreachable');
}

export const runnerService = {
  /**
   * Check backend server health and .NET SDK version
   */
  async checkHealth(): Promise<BackendHealth> {
    try {
      const res = await fetchBackend('/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }, 4000);
      if (!res.ok) {
        return {
          status: 'error',
          message: `Backend odpověděl se statusem ${res.status}`
        };
      }
      const data = await res.json();
      return {
        status: 'ok',
        dotnetVersion: data.dotnetVersion || 'Dostupný'
      };
    } catch {
      return {
        status: 'error',
        message: 'Backend API není dostupné (localhost:3001)'
      };
    }
  },

  /**
   * Compile C# code without running
   */
  async buildCSharp(code: string): Promise<RunnerResult> {
    const startTime = performance.now();
    try {
      const res = await fetchBackend('/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      }, 25000);

      const data = await res.json();
      const elapsed = Math.round(performance.now() - startTime);

      return {
        ...data,
        executionTimeMs: data.executionTimeMs || elapsed,
        offline: false
      };
    } catch {
      // Offline fallback: client-side syntax check
      const elapsed = Math.round(performance.now() - startTime);
      const val = clientValidator.validateCSharp(code);
      return {
        success: val.valid,
        output: val.valid
          ? 'Kompilace [Offline režim]: Syntaxe v pořádku (backend .NET SDK offline).'
          : 'Chyby v syntaxi kódu zjištěné lokálním analyzátorem.',
        diagnostics: val.issues.map(iss => ({
          file: 'Program.cs',
          line: iss.line,
          column: iss.column || 1,
          severity: iss.severity,
          code: 'CLIENT01',
          message: iss.message
        })),
        executionTimeMs: elapsed,
        offline: true
      };
    }
  },

  /**
   * Compile and execute C# code via dotnet run
   */
  async runCSharp(code: string, stdin?: string): Promise<RunnerResult> {
    const startTime = performance.now();
    try {
      const res = await fetchBackend('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, stdin, timeoutMs: 15000 })
      }, 25000);

      const data = await res.json();
      const elapsed = Math.round(performance.now() - startTime);

      return {
        ...data,
        executionTimeMs: data.executionTimeMs || elapsed,
        offline: false
      };
    } catch {
      // Fallback offline runner with smart simulation
      const elapsed = Math.round(performance.now() - startTime);
      const val = clientValidator.validateCSharp(code);

      if (!val.valid) {
        return {
          success: false,
          output: 'Chyba: Kód obsahuje syntaktické chyby nalezené offline validátorem.',
          diagnostics: val.issues.map(iss => ({
            file: 'Program.cs',
            line: iss.line,
            column: iss.column || 1,
            severity: iss.severity,
            code: 'CLIENT01',
            message: iss.message
          })),
          executionTimeMs: elapsed,
          offline: true
        };
      }

      // Offline pseudo-simulation from Console.WriteLine strings if backend is offline
      const simulatedLines: string[] = [];
      const cwRegex = /Console\.WriteLine\s*\(\s*(?:\$"([^"]*)"|"([^"]*)"|([^)]+))\s*\)/g;
      let m;
      while ((m = cwRegex.exec(code)) !== null) {
        if (m[2] !== undefined) {
          simulatedLines.push(m[2]);
        } else if (m[1] !== undefined) {
          simulatedLines.push(m[1].replace(/\{[^}]+\}/g, '...'));
        } else if (m[3] !== undefined) {
          simulatedLines.push(`[Hodnota: ${m[3].trim()}]`);
        }
      }

      return {
        success: true,
        output: simulatedLines.length > 0
          ? `[Offline simulace - Pro reálný Roslyn běh spusťte backend 'npm run start:server']\n` + simulatedLines.join('\n')
          : `[Offline režim: Syntaxe v pořádku, ale nebyl detekován žádný Console.WriteLine výstup. Připojte se k backendu pro plný Roslyn běh.]`,
        stdout: simulatedLines.join('\n'),
        executionTimeMs: elapsed,
        offline: true
      };
    }
  }
};
