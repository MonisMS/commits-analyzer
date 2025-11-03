import { ClassificationRule, CommitType } from "./types";

export const CLASSIFICATION_RULES: ClassificationRule[] = [
 {
    type: 'frontend',
    keywords: [
      'ui', 'component', 'style', 'css', 'scss', 'tailwind',
      'layout', 'page', 'view', 'button', 'form', 'modal',
      'responsive', 'design', 'theme', 'animation', 'react',
      'vue', 'svelte', 'jsx', 'tsx'
    ],
    patterns: [
      /\b(component|ui|style|css|frontend|client)\b/i,
      /\.(css|scss|sass|less|jsx|tsx|vue|svelte)$/i,
    ],
    weight: 10,
  },
  {
    type: 'backend',
    keywords:[ 'api', 'server', 'backend', 'database', 'db', 'query',
      'route', 'controller', 'service', 'middleware', 'auth',
      'endpoint', 'model', 'schema', 'migration', 'seed'],
      patterns: [  /\b(api|server|backend|database|db|route|controller)\b/i,
      /\/(api|server|routes|controllers|services|middleware)\//i,],
      weight:9
  },
   {
    type: 'test',
    keywords: [
      'test', 'testing', 'spec', 'jest', 'vitest', 'cypress',
      'playwright', 'e2e', 'unit', 'integration', 'fixture',
      'mock', 'stub'
    ],
    patterns: [
      /\b(test|spec|testing|jest|vitest|cypress|playwright)\b/i,
      /\.(test|spec)\.(js|ts|jsx|tsx)$/i,
      /\/(test|tests|spec|__tests__|cypress|playwright)\//i,
    ],
    weight: 8,
  },
  {
    type: 'docs',
    keywords: [
      'doc', 'documentation', 'readme', 'guide', 'tutorial',
      'comment', 'jsdoc', 'markdown', 'wiki'
    ],
    patterns: [
      /\b(doc|documentation|readme|guide|tutorial)\b/i,
      /\.(md|mdx|txt|rst)$/i,
      /\/(docs|documentation|wiki|guides)\//i,
    ],
    weight: 7,
  },
  {
    type: 'config',
    keywords: [
      'config', 'configuration', 'setup', 'env', 'docker',
      'ci', 'cd', 'github action', 'workflow', 'deploy',
      'build', 'package', 'dependencies', 'tsconfig', 'eslint'
    ],
    patterns: [
      /\b(config|configuration|setup|env|docker|ci|cd)\b/i,
      /\.(json|yaml|yml|toml|ini|env|config\.(js|ts))$/i,
      /\/(config|\.github|scripts|tools)\//i,
      /^(package\.json|package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$/i,
    ],
    weight: 6,
  },
]

export const TYPE_DISPLAY_NAMES: Record<CommitType, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  docs: 'Documentation',
  config: 'Configuration',
  test: 'Testing',
  other: 'Other',
};

export const TYPE_COLORS: Record<CommitType, string> = {
  frontend: 'bg-blue-100 text-blue-800',
  backend: 'bg-green-100 text-green-800',
  docs: 'bg-purple-100 text-purple-800',
  config: 'bg-orange-100 text-orange-800',
  test: 'bg-pink-100 text-pink-800',
  other: 'bg-gray-100 text-gray-800',
};