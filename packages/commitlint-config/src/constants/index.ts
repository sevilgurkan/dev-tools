// This variable is used to indicate that a rule should be skipped without error.
// It can be utilized across different rules when a specific condition is not met.
export const SKIP_RULE = [true, ''] as const;

export const DEFAULT_TYPES = [
  'chore',
  'build',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test',
  'release',
  'ops',
];

export enum Messages {
  EMPTY_PARENT_SCOPE = 'Commit message cannot contain empty parentheses. Either provide a scope or remove the parentheses',
}
