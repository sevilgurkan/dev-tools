import {DefaultRules, ExtraRules} from '../types';

const jiraOptions = {
  requireJira: true,
};

type TestCase = Record<
  DefaultRules | ExtraRules,
  {
    description: string;
    valid: string[];
    invalid: string[];
    options?: {
      requireJira?: boolean;
      additionalScopes?: string[];
    };
  }
>;

const references = ['JIRA-123', 'JIRA-45Ab', 'JIRA-7Gh22'];

const lorem100 = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
const lorem70 = lorem100.slice(0, 70);

export const testCase: TestCase = {
  [DefaultRules.TypeEnum]: {
    description: 'Commit must use standard types like feat, fix, docs, etc.',
    valid: [
      'feat: new feature',
      'fix: auth provider',
      'docs: update readme',
      'perf: optimize performance',
    ],
    invalid: [
      'random: invalid type',
      'FIX: valid type with wrong case',
      'e: invalid type',
    ],
  },
  [DefaultRules.TypeEmpty]: {
    description: 'A type followed by a colon is mandatory.',
    valid: ['feat: add new feature', 'feat(scope): add new feature'],
    invalid: [': missing type', 'feat(): empty scope but valid type'],
  },
  [DefaultRules.TypeCase]: {
    description: 'All commit types should be lowercase.',
    valid: ['feat: message', 'perf: optimize performance'],
    invalid: ['Feat: capitalize', 'fEaT: mixed case', 'FEAT: uppercase'],
  },
  [DefaultRules.ScopeCase]: {
    description: 'Scope text must follow lowercase format.',
    valid: ['feat(k8s): pipeline', 'ci(workflow): pipeline'],
    invalid: [
      'feat(WORKFLOW): uppercase scope',
      'feat(K8S): mixed case scope',
      'feat(Workflow): message',
      'feat(WoRKfLOw): mix scope',
      'feat(another-scope): message',
    ],
    options: {additionalScopes: ['k8s', 'workflow']},
  },
  [DefaultRules.ScopeEnum]: {
    description: 'Only allowed scope values are accepted.',
    valid: [
      'feat: add new feature',
      'fix(auth): google provider',
      'feat(docker): add new feature',
    ],
    invalid: ['docs(scope): update readme'],
    options: {additionalScopes: ['auth', 'docker']},
  },
  [DefaultRules.ScopeEmpty]: {
    description: 'When scope is used, it must contain a valid value.',
    valid: [
      'feat(docs-infra): add new feature',
      'test(core): message',
      'ci: message with empty scope',
    ],
    invalid: [
      'feat(invalid-scope): message with invalid scope',
      'feat(random): message',
    ],
    options: {additionalScopes: ['docs-infra', 'core']},
  },
  [ExtraRules.ScopeEmptyParentheses]: {
    description: 'Proper scope syntax without empty brackets.',
    valid: ['feat: without scope'],
    invalid: [
      'feat(: message',
      'feat): message',
      'feat(): message',
      'feat( ): space in scope',
    ],
  },
  [DefaultRules.SubjectEmpty]: {
    description: 'Commit message requires a meaningful subject.',
    valid: ['feat: add new feature'],
    invalid: ['feat: ', 'feat:    '],
  },
  [DefaultRules.SubjectCase]: {
    description: 'Avoids fully capitalized subject lines.',
    valid: ['chore: add new feature', 'refactor: MixeD sUbJEcT CASE'],
    invalid: ['docs: UPPERCASE SUBJECT'],
  },
  [DefaultRules.SubjectFullStop]: {
    description: 'No period at the end of subject line.',
    valid: ['feat: message'],
    invalid: ['feat: message.'],
  },
  [DefaultRules.BodyLeadingBlank]: {
    description: 'Requires space between subject and body.',
    valid: ['feat: message\n\nbody text'],
    invalid: ['feat: message\nbody without blank'],
  },
  [DefaultRules.BodyCase]: {
    description: 'Body text should not be all uppercase.',
    valid: ['feat: message\n\nbody text'],
    invalid: ['feat: message\nBODY TEXT'],
  },
  [DefaultRules.BodyMaxLineLength]: {
    description: 'Keeps body lines within readable length.',
    valid: [`feat: message\n\n${lorem70}`],
    invalid: [
      `feat: message\n\n${lorem100}`,
      `fix(infra): message\n\n${lorem100}`,
    ],
  },
  [DefaultRules.BodyFullStop]: {
    description: 'No period at the end of body text.',
    valid: ['feat: message\n\nbody text'],
    invalid: ['feat: message\n\nbody text.'],
  },
  [DefaultRules.ReferencesEmpty]: {
    description: 'Checks for required JIRA issue references.',
    valid: [
      `feat: ${references[0]} message`,
      `test: ${references.join(' ')} message`,
    ],
    invalid: [
      'docs: message without reference',
      `style: INVALID-REF-21 message`,
      `style: ASD-43 YG-4 message`,
    ],
    options: jiraOptions,
  },
  [DefaultRules.HeaderMaxLength]: {
    description: 'Maintains readable header length.',
    valid: [`docs: ${lorem70}`],
    invalid: [`feat: ${lorem100}`],
  },
  [DefaultRules.HeaderTrim]: {
    description: 'No extra spaces around header text.',
    valid: ['feat: message', 'docs: message', 'perf: message'],
    invalid: [' docs: message', '  docs: message   ', '    docs: message   '],
  },

  [ExtraRules.JiraIssueKeyEmpty]: {
    description: 'Valid JIRA issue format (JIRA-XXX) required.',
    valid: [
      'feat: JIRA-123 message',
      'feat: JIRA-11bc JIRA-22 message',
      'feat: JIRA-54yC JIRA-22GHF JIRA-33c message',
      'feat: JIRA-992 message\n\nanother body message for JIRA-632',
      'feat: JIRA-15362 message\n\nbody JIRA-99Hz\n\nfooter JIRA-QW23',
    ],
    invalid: [
      `feat: JIRA566 message`,
      `feat: JIRA- message`,
      `feat: JIRA566 jiRA253 jira-253 JIRA- message`,
      `feat: JIRA-ABC 263-JIRA message`,
      `feat: message\n\nbody JIRA22 message`,
      `feat: message\n\nbody JIRA22 jiRa-53 JIRA- message`,
    ],
    options: jiraOptions,
  },
};
