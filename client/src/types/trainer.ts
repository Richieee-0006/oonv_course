export interface FillBlankExercise {
  id: string;
  title: string;
  category: string;
  description: string;
  codeTemplate: string; // contains {{blank_1}}, {{blank_2}}, etc.
  blanks: {
    id: string;
    correctAnswers: string[];
    options: string[];
    placeholder: string;
    explanation: string;
  }[];
  runnableFullCode: string;
}

export interface FourPartsPatternExercise {
  id: string;
  title: string;
  patternName: string;
  pageReference: string; // "str. 16 z PDF"
  scenario: string;
  part1Hint: string; // Rozhraní / Abstraktní třída
  part2Hint: string; // Konkrétní produkt
  part3Hint: string; // Samotný vzor
  part4Hint: string; // Main() - vlevo rozhraní, vpravo třída
  starterCode: string;
  solutionCode: string;
  validationRules: {
    expectedInterfaces: string[];
    expectedClasses: string[];
    expectedMainAssignments: { leftType: string; rightType: string }[];
  };
}

export interface QuizQuestion {
  id: string;
  title: string;
  category: 'memory' | 'inheritance' | 'polymorphism' | 'access' | 'gotchas';
  codeSnippet: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  memoryDiagramNote?: string;
}

export interface SandboxTemplate {
  id: string;
  name: string;
  patternsUsed: string[];
  description: string;
  architectureHighlights: string[];
  initialCode: string;
}
