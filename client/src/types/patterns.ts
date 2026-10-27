export type PatternCategory = 'creational' | 'structural' | 'behavioral';

export interface SimilarPatternComparison {
  name: string;
  difference: string;
}

export interface Pattern {
  id: string;
  category: PatternCategory;
  name: string;
  czechName: string;
  syllabusWeek: string;
  intent: string;
  problem: string;
  solution: string;
  umlDescription: string;
  umlSvgKey: string;
  participants: { name: string; role: string }[];
  similarPatterns: SimilarPatternComparison[];
  csharpCode: string;
  pythonComparisonNote?: string;
  keyTakeaway: string;
}
