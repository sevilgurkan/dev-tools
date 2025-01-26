import rules from '@commitlint/rules';

export const SEVERITY = {
  Disabled: 0,
  Warning: 1,
  Error: 2,
};

/** @type {import('@commitlint/types').Plugin} */
const fmssCommitlintPlugin = {
  rules: {
    'fmss/subject-case-with-jira-key': (parsed, when, value) => {
      let subject = parsed.subject;

      const jiraIssueKeyPattern = /JIRA-\d+\s*/g;
      const jiraKeys = subject.match(jiraIssueKeyPattern);

      // Since <ISSUE_KEY> consists of uppercase letters and numbers,
      // the built-in subject-case rule doesn't accept it.
      // We remove the <ISSUE_KEY> parts for this rule to work.
      if (jiraKeys) {
        subject = subject.replace(jiraIssueKeyPattern, '');
      }

      const [isValid, message] = rules['subject-case']({subject}, when, value);

      return [isValid, message];
    },
    'fmss/jira-task': (parsed, when, value) => {
      const isNumberRegex = /^\d+$/;
      const isJiraHeaderRegex = /^JIRA-/;
      const anyIssueKeyRegex = /[A-Z]+-\d+/g;

      const allIssueKeys = parsed.subject.match(anyIssueKeyRegex) || [];

      const hasNonJiraPrefix = allIssueKeys.some(
        (key) => !isJiraHeaderRegex.test(key),
      );

      if (hasNonJiraPrefix) {
        return [
          false,
          'Only JIRA- prefix is allowed in commit messages. Other issue prefixes (like FAS-, ABC-, etc.) are not allowed.',
        ];
      }

      const isValid =
        (parsed.references.length > 0 &&
          parsed.references.every((ref) => {
            return (
              isJiraHeaderRegex.test(ref.prefix) &&
              isNumberRegex.test(ref.issue)
            );
          })) ||
        allIssueKeys.length > 0;

      return [
        isValid,
        'Commit message must start with one or more Jira task numbers separated by spaces (e.g: JIRA-123 JIRA-42).',
      ];
    },
  },
};

/** @type {import('@commitlint/types').RulesConfig} */
const baseRules = {
  'type-empty': [SEVERITY.Error, 'never'],
  'type-enum': [
    SEVERITY.Error,
    'always',
    [
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
    ],
  ],
  'scope-empty': [SEVERITY.Warning, 'never'],
  'scope-case': [SEVERITY.Error, 'never', ['upper-case']],
  'subject-empty': [SEVERITY.Error, 'never'],
  'subject-case': [SEVERITY.Error, 'never', ['upper-case']],
  'body-leading-blank': [SEVERITY.Error, 'always'],
  'body-case': [SEVERITY.Error, 'never', ['upper-case']],
  'body-full-stop': [SEVERITY.Error, 'never'],
};

/** @type {import('@commitlint/types').RulesConfig} */
const jiraRulesWithOverrides = {
  'subject-case': [SEVERITY.Disabled],
  'fmss/subject-case-with-jira-key': [SEVERITY.Error, 'never', ['upper-case']],
  'fmss/jira-task': [SEVERITY.Error, 'always'],
  'references-empty': [SEVERITY.Error, 'never'],
};

/** @type {import('@commitlint/types').UserConfig['parserPreset']} */
const baseParserPreset = {
  parserOpts: {
    issuePrefixes: ['JIRA-'],
    issuePrefixesCaseSensitive: true,
    referenceActions: null,
    noteKeywords: null,
    revertPattern:
      /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ['header', 'hash'],
    fieldPattern: /^-(.*?)-$/,
    headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
    headerCorrespondence: ['type', 'scope', 'subject'],
    commentChar: '#',
  },
};

/** @type {import('@commitlint/types').UserConfig} */
const baseConfig = {
  extends: ['@commitlint/config-conventional'],
  helpUrl:
    'https://github.com/sevilgurkan/web-configs/blob/main/packages/commitlint-plugin/README.md',
  parserPreset: baseParserPreset,
};

export {
  baseConfig,
  baseRules,
  baseParserPreset,
  jiraRulesWithOverrides,
  fmssCommitlintPlugin,
};
