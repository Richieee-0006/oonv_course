import { ClientValidationResult, ValidationIssue } from '../types/runner';

export const clientValidator = {
  /**
   * General C# offline validator and structural analysis
   */
  validateCSharp(code: string): ClientValidationResult {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');

    // 1. Bracket & brace matching
    const stack: { char: string; line: number; col: number }[] = [];
    const pairs: Record<string, string> = { '}': '{', ')': '(', ']': '[' };
    let inBlockComment = false;

    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      let inString = false;
      let stringChar = '';

      for (let i = 0; i < lineText.length; i++) {
        const char = lineText[i];
        const nextChar = lineText[i + 1] || '';

        if (inBlockComment) {
          if (char === '*' && nextChar === '/') {
            inBlockComment = false;
            i++;
          }
          continue;
        }

        if (!inString && char === '/' && nextChar === '*') {
          inBlockComment = true;
          i++;
          continue;
        }

        if (!inString && char === '/' && nextChar === '/') {
          // rest of line is line comment
          break;
        }

        if (!inString && (char === '"' || char === '\'')) {
          inString = true;
          stringChar = char;
          continue;
        } else if (inString && char === stringChar && lineText[i - 1] !== '\\') {
          inString = false;
          continue;
        }

        if (inString) continue;

        if (char === '{' || char === '(' || char === '[') {
          stack.push({ char, line: lineNum, col: i + 1 });
        } else if (char === '}' || char === ')' || char === ']') {
          const expected = pairs[char];
          if (stack.length === 0 || stack[stack.length - 1].char !== expected) {
            issues.push({
              line: lineNum,
              column: i + 1,
              severity: 'error',
              message: `Neočekávaný uzavírací znak '${char}' (neodpovídá žádné otevřené závorce).`
            });
          } else {
            stack.pop();
          }
        }
      }

      // Check common Python syntax slips
      const trimmed = lineText.trim();
      if (/^def\s+[a-zA-Z_]/.test(trimmed)) {
        issues.push({
          line: lineNum,
          severity: 'error',
          message: "Chyba syntaxe z Pythonu: 'def'. V C# uveďte návratový typ, např. 'void MojeMetoda()' nebo 'int Spocti()'."
        });
      }
      if (/\bprint\s*\(/.test(trimmed)) {
        issues.push({
          line: lineNum,
          severity: 'warning',
          message: "V C# použijte 'Console.WriteLine(...)' místo Pythonovského 'print(...)'."
        });
      }
      if (/\belif\b/.test(trimmed)) {
        issues.push({
          line: lineNum,
          severity: 'error',
          message: "V C# se píše 'else if', nikoliv 'elif'."
        });
      }
      if (/\bself\./.test(trimmed)) {
        issues.push({
          line: lineNum,
          severity: 'error',
          message: "V C# se používá klíčové slovo 'this.' nebo přímo název členu, nikoliv 'self.'."
        });
      }
      if (/\b(True|False)\b/.test(trimmed)) {
        issues.push({
          line: lineNum,
          severity: 'warning',
          message: "V C# se booleovské literály píší malými písmeny: 'true' / 'false'."
        });
      }
      if (/\bNone\b/.test(trimmed)) {
        issues.push({
          line: lineNum,
          severity: 'warning',
          message: "V C# se prázdná reference píše jako 'null', nikoliv 'None'."
        });
      }
    });

    while (stack.length > 0) {
      const unclosed = stack.pop()!;
      issues.push({
        line: unclosed.line,
        column: unclosed.col,
        severity: 'error',
        message: `Neuzavřená závorka '${unclosed.char}'.`
      });
    }

    // Extract structure
    const classes: string[] = [];
    const interfaces: string[] = [];
    const classRegex = /\b(?:public|internal|private|protected)?\s*(?:abstract|sealed|static)?\s*class\s+([A-Za-z0-9_]+)/g;
    const interfaceRegex = /\b(?:public|internal)?\s*interface\s+([A-Za-z0-9_]+)/g;

    let match;
    while ((match = classRegex.exec(code)) !== null) {
      classes.push(match[1]);
    }
    while ((match = interfaceRegex.exec(code)) !== null) {
      interfaces.push(match[1]);
    }

    const hasMain = /\b(?:static\s+(?:void|int|async\s+Task)\s+Main|Console\.WriteLine)/.test(code);
    const usesBaseCall = /:\s*base\s*\(/.test(code);
    const hasVirtual = /\bvirtual\b/.test(code);
    const hasOverride = /\boverride\b/.test(code);
    const hasNew = /\bnew\s+(?:void|int|string|[A-Z][a-zA-Z0-9_]*)\s+[A-Za-z0-9_]+\s*\(/.test(code);

    if (classes.length === 0 && interfaces.length === 0 && !hasMain) {
      issues.push({
        line: 1,
        severity: 'warning',
        message: 'Kód neobsahuje žádnou třídu, rozhraní ani spustitelnou metodu Main.'
      });
    }

    return {
      valid: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      structureSummary: {
        classes,
        interfaces,
        hasMain,
        usesBaseCall,
        hasVirtual,
        hasOverride,
        hasNew
      }
    };
  },

  /**
   * Mode 2: Verify the 4 structural components of a pattern (str. 16 z PDF)
   */
  validateFourPartsPattern(
    code: string,
    expected: {
      expectedInterfaces: string[];
      expectedClasses: string[];
      expectedMainAssignments: { leftType: string; rightType: string }[];
    }
  ): {
    part1Ok: boolean;
    part1Msg: string;
    part2Ok: boolean;
    part2Msg: string;
    part3Ok: boolean;
    part3Msg: string;
    part4Ok: boolean;
    part4Msg: string;
    allPassed: boolean;
  } {
    // Part 1: Product Interface or Abstract Class
    const hasInterface = expected.expectedInterfaces.some(name => {
      const reg = new RegExp(`\\b(?:interface|abstract\\s+class)\\s+${name}\\b`);
      return reg.test(code);
    });
    const part1Ok = hasInterface;
    const part1Msg = part1Ok
      ? `Část 1 splněna: Nalezeno rozhraní / abstraktní třída (${expected.expectedInterfaces.join(', ')})`
      : `Část 1 chybí: Vytvořte rozhraní nebo abstraktní třídu (${expected.expectedInterfaces.join(' nebo ')})`;

    // Part 2: Concrete Product implementing the interface
    const hasConcreteProduct = expected.expectedClasses.some(cls => {
      const reg = new RegExp(`\\bclass\\s+${cls}\\b[^{]*:\\s*(${expected.expectedInterfaces.join('|')})`);
      return reg.test(code);
    });
    const part2Ok = hasConcreteProduct;
    const part2Msg = part2Ok
      ? `Část 2 splněna: Nalezena konkrétní třída implementující rozhraní`
      : `Část 2 chybí: Třída musí implementovat rozhraní, např. 'class Konkretni : ${expected.expectedInterfaces[0]}'`;

    // Part 3: Pattern class exists (either Singleton, Factory, Adapter, Proxy, Decorator, Strategy, etc.)
    const hasPatternClass = /\bclass\s+[A-Za-z0-9_]+(?:Adapter|Proxy|Decorator|Factory|Strategy|Brana|Singleton|Builder|Command|Memento|Observer)\b/.test(code)
      || /\b(?:Instance|Vytvor|Dekoruj|Zpracuj|Execute|Uloz)\b/.test(code);
    const part3Ok = hasPatternClass;
    const part3Msg = part3Ok
      ? 'Část 3 splněna: Nalezena struktura samotného návrhového vzoru'
      : 'Část 3 chybí: Definujte samotný vzor s odpovídající vnitřní logikou';

    // Part 4: Main with Interface on the Left and Concrete Class on the Right
    // e.g., IRozhrani var = new Konkretni();
    let foundLeftRightPolymorphism = false;
    for (const rule of expected.expectedMainAssignments) {
      const pattern = new RegExp(`\\b${rule.leftType}\\s+[a-zA-Z_][a-zA-Z0-9_]*\\s*=\\s*new\\s+${rule.rightType}\\s*\\(`, 'g');
      if (pattern.test(code)) {
        foundLeftRightPolymorphism = true;
        break;
      }
    }

    // Also accept general interface = new Concrete() in Main
    if (!foundLeftRightPolymorphism) {
      const generalPolymorphism = /\bI[A-Z][a-zA-Z0-9_]*\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*new\s+[A-Z][a-zA-Z0-9_]*\s*\(/;
      if (generalPolymorphism.test(code)) {
        foundLeftRightPolymorphism = true;
      }
    }

    const hasMain = /\b(?:static\s+(?:void|int|async\s+Task)\s+Main|Console\.WriteLine)/.test(code);
    const part4Ok = hasMain && foundLeftRightPolymorphism;
    const part4Msg = part4Ok
      ? 'Část 4 splněna: Main() obsahuje správné přiřazení (vlevo Rozhraní, vpravo Konkrétní třída)'
      : 'Část 4 nekompletní: V Main() deklarujte proměnnou typu rozhraní vlevo a new konkrétní třídu vpravo (např. ' +
        (expected.expectedMainAssignments[0] ? `${expected.expectedMainAssignments[0].leftType} obj = new ${expected.expectedMainAssignments[0].rightType}();` : 'IRozhrani p = new Produkt();') + ')';

    return {
      part1Ok,
      part1Msg,
      part2Ok,
      part2Msg,
      part3Ok,
      part3Msg,
      part4Ok,
      part4Msg,
      allPassed: part1Ok && part2Ok && part3Ok && part4Ok
    };
  }
};
