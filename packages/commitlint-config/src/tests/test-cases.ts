import {DefaultRules, ExtraRules} from '../types';

const jiraOptions = {
  requireJira: true,
};

type TestCase = Record<
  DefaultRules | ExtraRules,
  {
    valid: string[];
    invalid: string[];
    options?: {
      requireJira?: boolean;
      additionalScopes?: string[];
    };
  }
>;

const references = ['JIRA-123', 'JIRA-45Ab', 'JIRA-7Gh22'];

const moreThan100Lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

export const testCase: TestCase = {
  [DefaultRules.TypeEnum]: {
    valid: ['feat: new feature'],
    invalid: ['random: invalid type', 'FIX: valid type wrong case'],
  },
  [DefaultRules.TypeEmpty]: {
    valid: ['feat: add new feature', 'feat(scope): add new feature'],
    invalid: [': missing type', 'feat(): empty scope but valid type'],
  },
  [DefaultRules.TypeCase]: {
    valid: ['feat: message'],
    invalid: ['Feat: message'],
  },
  [DefaultRules.ScopeCase]: {
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
    valid: [
      'feat: add new feature',
      'fix(auth): google provider',
      'feat(docker): add new feature',
    ],
    invalid: ['docs(scope): update readme'],
    options: {additionalScopes: ['auth', 'docker']},
  },
  [DefaultRules.ScopeEmpty]: {
    valid: [
      'feat(docs-infra): add new feature',
      'test(core): message',
      'ci: message',
    ],
    invalid: ['feat(): empty scope', 'feat( ): space in parentheses'],
    options: {additionalScopes: ['docs-infra', 'core']},
  },
  [DefaultRules.SubjectEmpty]: {
    valid: ['feat: add new feature'],
    invalid: ['feat: ', 'feat:    '],
  },
  [DefaultRules.SubjectCase]: {
    valid: ['chore: add new feature', 'refactor: MixeD sUbJEcT CASE'],
    invalid: ['docs: UPPERCASE SUBJECT'],
  },
  [DefaultRules.SubjectFullStop]: {
    valid: ['feat: message'],
    invalid: ['feat: message.'],
  },
  [DefaultRules.BodyLeadingBlank]: {
    valid: ['feat: message\n\nbody text'],
    invalid: [
      'feat: message\nbody without blank',
      'feat: message\n \nbody with space line',
    ],
  },
  [DefaultRules.BodyCase]: {
    valid: ['feat: message\n\nbody text'],
    invalid: ['feat: message\nBODY TEXT'],
  },
  [DefaultRules.BodyMaxLineLength]: {
    valid: ['feat: message\n\nshort body'],
    invalid: [
      `feat: message\n\n${moreThan100Lorem}`,
      `feat: message\n\n${moreThan100Lorem}`,
    ],
  },
  [DefaultRules.BodyFullStop]: {
    valid: ['feat: message\n\nbody text'],
    invalid: ['feat: message\n\nbody text.'],
  },
  [DefaultRules.ReferencesEmpty]: {
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
    valid: [
      `docs: ${moreThan100Lorem.slice(0, 89)}`,
      'feat: message\n\nshort body',
    ],
    invalid: [
      `feat: ${moreThan100Lorem}`,
      `feat: ${moreThan100Lorem.slice(0, 100)}`,
    ],
  },
  [DefaultRules.HeaderTrim]: {
    valid: [
      'feat: message\n\nshort body',
      'docs: message\n\n   body text',
      'perf: message\n\nbody text   ',
    ],
    invalid: [' docs: message', 'docs: message ', ' docs: message '],
  },
  [ExtraRules.ScopeEmptyParentheses]: {
    valid: ['feat: without scope'],
    invalid: [
      'feat(: message',
      'feat): message',
      'feat(): message',
      'feat( ): space in scope',
    ],
  },
  [ExtraRules.JiraIssueKeyEmpty]: {
    valid: [
      'feat: JIRA-123 message',
      'feat: JIRA-11bc JIRA-22 message',
      'feat: JIRA-54yC JIRA-22GHF JIRA-33c message',
      'feat: JIRA-992 message\n\nanother message for JIRA-632',
      'feat: JIRA-15362 message\n\nJIRA-99Hz\n\nJIRA-QW23',
    ],
    invalid: [
      `feat: JIRA566 message`,
      `feat: JIRA- message`,
      `feat: JIRA566 jiRA253 jira-253 JIRA- message`,
      `feat: JIRA-ABC 263-JIRA message`,
      `feat: message\n\nJIRA22 message`,
      `feat: message\n\nJIRA22 jiRa-53 JIRA- message`,
    ],
    options: jiraOptions,
  },
};
