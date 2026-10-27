export interface PythonCSharpComparison {
  feature: string;
  pythonSyntax: string;
  csharpSyntax: string;
  explanation: string;
}

export interface AccessModifierInfo {
  modifier: string;
  czechName: string;
  sameClass: boolean;
  derivedClassSameAssembly: boolean;
  otherClassSameAssembly: boolean;
  derivedClassOtherAssembly: boolean;
  otherClassOtherAssembly: boolean;
  description: string;
  examNote: string;
}

export interface UmlArrowRelation {
  name: string;
  umlSymbol: string;
  meaning: string;
  csharpSyntax: string;
  example: string;
  guruTip: string;
}
