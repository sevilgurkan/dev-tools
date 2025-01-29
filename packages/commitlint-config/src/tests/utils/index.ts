import {RuleConfigSeverity} from '@commitlint/types';

type CommitlintRuleValue =
  | string
  | number
  | boolean
  | (string | number | boolean)[];

interface ParsedRule<T extends CommitlintRuleValue = CommitlintRuleValue> {
  severity: RuleConfigSeverity;
  condition: string;
  value: T;
}

const checkIsValidRule = (x: any): x is any[] => {
  return Array.isArray(x) && x.length >= 1 && x.length <= 3;
};

export function parseRule<T extends CommitlintRuleValue = CommitlintRuleValue>(
  rule: any,
): ParsedRule<T>;
export function parseRule<T extends CommitlintRuleValue = CommitlintRuleValue>(
  rule: any,
  allowEmptyRule: boolean,
): ParsedRule<T> | undefined;
export function parseRule<T extends CommitlintRuleValue = CommitlintRuleValue>(
  rule: any,
  allowEmptyRule = false,
): ParsedRule<T> | undefined {
  const isValidRule = checkIsValidRule(rule);

  if (!isValidRule) {
    if (!allowEmptyRule) {
      throw new Error('Rule must be an array with at least 1 elements');
    }

    return undefined;
  }

  const [severity, condition, value] = rule;

  if (
    typeof severity !== 'number' ||
    !Object.values(RuleConfigSeverity).includes(severity)
  ) {
    throw new Error('Rule severity must be defined');
  }

  if (condition && typeof condition !== 'string') {
    throw new Error('Rule condition must be a string');
  }

  return {
    severity,
    condition: condition ?? null,
    value: (value ?? null) as T,
  } as ParsedRule<T>;
}
