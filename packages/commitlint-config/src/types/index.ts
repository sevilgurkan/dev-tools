import type {
  Plugin as PluginType,
  RuleConfigQuality,
  RulesConfig,
  AnyRuleConfig,
  Rule,
  AsyncRule,
  SyncRule,
} from '@commitlint/types';

export interface Plugin extends PluginType {
  rules: {
    [ruleName in keyof ExtraRulesConfig]: Rule | AsyncRule | SyncRule;
  };
}

export enum DefaultRules {
  TypeEnum = 'type-enum',
  TypeEmpty = 'type-empty',
  TypeCase = 'type-case',
  ScopeEnum = 'scope-enum',
  ScopeEmpty = 'scope-empty',
  ScopeCase = 'scope-case',
  SubjectEmpty = 'subject-empty',
  SubjectCase = 'subject-case',
  SubjectFullStop = 'subject-full-stop',
  BodyLeadingBlank = 'body-leading-blank',
  BodyCase = 'body-case',
  BodyMaxLineLength = 'body-max-line-length',
  BodyFullStop = 'body-full-stop',
  ReferencesEmpty = 'references-empty',
  HeaderMaxLength = 'header-max-length',
  HeaderTrim = 'header-trim',
}
export type DefaultRuleKeys = `${DefaultRules}`;

export enum ExtraRules {
  ScopeEmptyParentheses = 'scope-empty-parentheses',
  JiraIssueKeyEmpty = 'jira-issue-key-empty',
}
export type ExtraRuleKeys = `${ExtraRules}`;

type DefaultRulesConfig = Pick<
  RulesConfig,
  | DefaultRules.TypeEmpty
  | DefaultRules.TypeEnum
  | DefaultRules.ScopeEmpty
  | DefaultRules.ScopeEnum
  | DefaultRules.ScopeCase
  | DefaultRules.SubjectEmpty
  | DefaultRules.SubjectCase
  | DefaultRules.SubjectFullStop
  | DefaultRules.BodyLeadingBlank
  | DefaultRules.BodyCase
  | DefaultRules.BodyFullStop
  | DefaultRules.ReferencesEmpty
  | DefaultRules.BodyMaxLineLength
  // | 'footer-leading-blank'
  // | 'footer-max-line-length'
  | DefaultRules.HeaderMaxLength
  | DefaultRules.HeaderTrim
  | DefaultRules.TypeCase
>;

export interface ExtraRulesConfig<V = RuleConfigQuality.User> {
  [ExtraRules.ScopeEmptyParentheses]: AnyRuleConfig<V>;
  [ExtraRules.JiraIssueKeyEmpty]: AnyRuleConfig<V>;
}

export type PluginRulesConfig = DefaultRulesConfig & ExtraRulesConfig;
export type PluginRuleNames = keyof PluginRulesConfig;
