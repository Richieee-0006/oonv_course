const PREFIX = 'csharp_oonv_';

export const storageService = {
  getTheme(): 'dark' | 'light' {
    try {
      const stored = localStorage.getItem(`${PREFIX}theme`);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // ignore
    }
    return 'dark';
  },

  setTheme(theme: 'dark' | 'light'): void {
    try {
      localStorage.setItem(`${PREFIX}theme`, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  },

  getCode(key: string, defaultCode: string): string {
    try {
      const code = localStorage.getItem(`${PREFIX}code_${key}`);
      return code !== null ? code : defaultCode;
    } catch {
      return defaultCode;
    }
  },

  saveCode(key: string, code: string): void {
    try {
      localStorage.setItem(`${PREFIX}code_${key}`, code);
    } catch {
      // ignore
    }
  },

  getProgress(): Record<string, boolean> {
    try {
      const data = localStorage.getItem(`${PREFIX}progress`);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  markCompleted(taskId: string): void {
    try {
      const current = this.getProgress();
      current[taskId] = true;
      localStorage.setItem(`${PREFIX}progress`, JSON.stringify(current));
    } catch {
      // ignore
    }
  },

  getActiveTab(defaultTab: string = 'theory_step1'): string {
    try {
      return localStorage.getItem(`${PREFIX}active_tab`) || defaultTab;
    } catch {
      return defaultTab;
    }
  },

  setActiveTab(tab: string): void {
    try {
      localStorage.setItem(`${PREFIX}active_tab`, tab);
    } catch {
      // ignore
    }
  },

  clearAll(): void {
    try {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (k.startsWith(PREFIX)) {
          localStorage.removeItem(k);
        }
      }
    } catch {
      // ignore
    }
  }
};
