export interface RunnerResult {
  success: boolean;
  output?: string;
  stdout?: string;
  stderr?: string;
  error?: string;
  exitCode?: number;
  executionTimeMs?: number;
  diagnostics?: RoslynDiagnostic[];
  offline?: boolean;
}

export interface RoslynDiagnostic {
  file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
}

export interface BackendHealth {
  status: 'ok' | 'error' | 'checking';
  dotnetVersion?: string;
  message?: string;
}

export interface ValidationIssue {
  line: number;
  column?: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface ClientValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  structureSummary: {
    hasNamespace?: boolean;
    classes: string[];
    interfaces: string[];
    hasMain: boolean;
    usesBaseCall?: boolean;
    hasVirtual?: boolean;
    hasOverride?: boolean;
    hasNew?: boolean;
  };
}
