import {
  type UserConfig,
  type ParserPreset,
  RuleConfigSeverity,
} from '@commitlint/types';

import {
  type Plugin,
  DefaultRules,
  ExtraRules,
  type ExtraRuleKeys,
  type PluginRulesConfig,
} from './types';
import {DEFAULT_TYPES} from './constants';
import {scopeEmptyParentheses} from './rules/scope-empty-parentheses';
import {jiraIssueKeyEmpty} from './rules/jira-issue-key-empty';

const plugin: Plugin = {
  rules: {
    [ExtraRules.ScopeEmptyParentheses]: scopeEmptyParentheses,
    [ExtraRules.JiraIssueKeyEmpty]: jiraIssueKeyEmpty,
  },
};

const defaultRules: Omit<PluginRulesConfig, ExtraRuleKeys> = {
  [DefaultRules.TypeEmpty]: [RuleConfigSeverity.Error, 'never'],
  [DefaultRules.TypeEnum]: [RuleConfigSeverity.Error, 'always', DEFAULT_TYPES],
  [DefaultRules.ScopeEmpty]: [RuleConfigSeverity.Warning, 'never'],
  [DefaultRules.ScopeEnum]: [RuleConfigSeverity.Disabled],
  [DefaultRules.ScopeCase]: [RuleConfigSeverity.Error, 'never', ['upper-case']],
  [DefaultRules.SubjectEmpty]: [RuleConfigSeverity.Error, 'never'],
  [DefaultRules.SubjectCase]: [
    RuleConfigSeverity.Error,
    'never',
    ['upper-case'],
  ],
  [DefaultRules.SubjectFullStop]: [RuleConfigSeverity.Error, 'never', '.'],
  [DefaultRules.BodyLeadingBlank]: [RuleConfigSeverity.Error, 'always'],
  [DefaultRules.BodyCase]: [RuleConfigSeverity.Error, 'never', ['upper-case']],
  [DefaultRules.BodyFullStop]: [RuleConfigSeverity.Error, 'never', '.'],
  [DefaultRules.BodyMaxLineLength]: [RuleConfigSeverity.Error, 'always', 100],
  // 'footer-leading-blank': [RuleConfigSeverity.Error, 'always'],
  // 'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
  [DefaultRules.HeaderMaxLength]: [RuleConfigSeverity.Error, 'always', 100],
  [DefaultRules.HeaderTrim]: [RuleConfigSeverity.Error, 'always'],
  [DefaultRules.TypeCase]: [RuleConfigSeverity.Error, 'always', 'lower-case'],
  [DefaultRules.ReferencesEmpty]: [RuleConfigSeverity.Disabled, 'always'],
};

const customRules: Partial<PluginRulesConfig> = {
  [ExtraRules.ScopeEmptyParentheses]: [RuleConfigSeverity.Error, 'always'],
};

const jiraRulesWithOverrides: Partial<PluginRulesConfig> = {
  [DefaultRules.SubjectCase]: [RuleConfigSeverity.Disabled],
  [DefaultRules.ReferencesEmpty]: [RuleConfigSeverity.Error, 'never'],
  [ExtraRules.JiraIssueKeyEmpty]: [RuleConfigSeverity.Error, 'always'],
};

const mergedRules = {
  ...defaultRules,
  ...customRules,
};

const baseParserPreset: ParserPreset = {
  parserOpts: {
    issuePrefixes: ['JIRA-'],
    issuePrefixesCaseSensitive: true,
    referenceActions: null,
    noteKeywords: null,
    revertPattern:
      /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ['header', 'hash'],
    fieldPattern: /^-(.*?)-$/,
    headerPattern: /^(\w*)(?:\((.*)\))?: (JIRA-\d+\s+(?:JIRA-\d+\s+)*)?(.*)$/,
    headerCorrespondence: ['type', 'scope', 'references', 'subject'],
    commentChar: '#',
  },
};

interface BaseConfig extends UserConfig {
  parserPreset: ParserPreset;
}

const baseConfig: BaseConfig = {
  helpUrl:
    'https://github.com/sevilgurkan/dev-tools/blob/main/packages/commitlint-config/README.md',
  parserPreset: baseParserPreset,
};

export {
  defaultRules,
  customRules,
  mergedRules,
  baseConfig,
  baseParserPreset,
  jiraRulesWithOverrides,
  plugin,
};
