import { CLASSIFICATION_RULES } from "./rules";
import { ClassificationResult, CommitType } from "./types"


export function classifyCommit(message:string):
ClassificationResult{
    if(!message || message.trim().length === 0){
        return {
            type: 'other',
            confidence: 0,
            matchedKeywords:[],
            reasoning: 'Empty commit message'
        }

    }

    const lowerMessage = message.toLowerCase();
    const scores = new Map<CommitType,{score: number; keywords: Set<string> }>();

    for(const rule of CLASSIFICATION_RULES){
        let score = 0;
        const matchedKeywords = new Set<string>();


        for (const keyword of rule.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        score += rule.weight;
        matchedKeywords.add(keyword);
      }
    }

     for (const pattern of rule.patterns) {
      if (pattern.test(message)) {
        score += rule.weight;
      }
    }

    if(score > 0){
        scores.set(rule.type,{score,keywords:matchedKeywords})
    }

}
let bestType: CommitType = 'other';
  let bestScore = 0;
  let bestKeywords: string[] = [];


for (const [type, { score, keywords }] of scores) {
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
      bestKeywords = Array.from(keywords);
    }
  }

    const maxPossibleScore = Math.max(...CLASSIFICATION_RULES.map(r => r.weight * 3));
  const confidence = Math.min(bestScore / maxPossibleScore, 1);

  return {
    type: bestType,
    confidence,
    matchedKeywords: bestKeywords,
    reasoning: generateReasoning(bestType, bestKeywords, confidence),
  };
}

    function generateReasoning(
  type: CommitType,
  keywords: string[],
  confidence: number
): string {
  if (type === 'other') {
    return 'No clear category detected';
  }

  const keywordList = keywords.slice(0, 3).join(', ');
  const confidencePercent = (confidence * 100).toFixed(0);
  
  return `Classified as ${type} (${confidencePercent}% confidence) based on: ${keywordList}`;
}

export function getTypeDisplayName(type: CommitType): string {
  const displayNames: Record<CommitType, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    docs: 'Documentation',
    config: 'Configuration',
    test: 'Testing',
    other: 'Other',
  };
  return displayNames[type];
}

export function getAllCommitTypes(): CommitType[] {
  return ['frontend', 'backend', 'docs', 'config', 'test', 'other'];
}