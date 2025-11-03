export type CommitType = 
  | 'frontend' 
  | 'backend' 
  | 'docs' 
  | 'config' 
  | 'test' 
  | 'other';

export interface ClassificationRule {
  type: CommitType;
  keywords: string[];
  patterns: RegExp[];
  weight: number;
}

export interface ClassificationResult {
  type: CommitType;
  confidence: number;
  matchedKeywords: string[];
  reasoning: string;
}