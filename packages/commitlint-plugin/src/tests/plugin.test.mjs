import lint from '@commitlint/lint';
import cvConfig from '@commitlint/config-conventional';

import {createConfig} from '../utils.mjs';

const commitLint = async (message, {requireJira = false} = {}) => {
  const config = createConfig({requireJira});

  const rules = {...cvConfig.rules, ...config.rules};
  const options = {...config.parserPreset, plugins: config.plugins};

  const result = await lint(message, rules, options);

  const {errors, warnings, ...rest} = result;

  const mapMessage = (messages) =>
    messages.map(({level, name, message}) => `{${name}:${level}} - ${message}`);

  const errorMessages =
    errors.length > 0
      ? mapMessage(errors)
      : warnings.length > 0
        ? mapMessage(warnings)
        : [];

  const messageString = `\n${errorMessages.join('\n')}`;

  return {...rest, errorMessages: messageString};
};

describe('FMSS Commitlint Plugin', () => {
  const messages = {
    withoutJira: {
      valid: {
        basic: [
          'feat: add new feature',
          'fix: fix multiple bugs',
          'docs: update documentation',
        ],
        withScope: [
          'feat(ui): add button component',
          'fix(api): handle error cases',
          'refactor(core): optimize performance',
        ],
        withBody: [
          `feat: add new feature

          This adds a new feature that does something amazing`,
          `fix(api): handle error cases

          Previously the API would fail silently.
          Now it properly handles and logs errors`,
        ],
        withFooter: [
          `feat: add new feature

          This is the body

          Signed-off-by: John Doe`,
          `fix: update dependencies

          Update all dependencies to latest versions

          BREAKING CHANGE: Major version updates in dependencies`,
        ],
        withBodyAndFooter: [
          `feat(ui): add new component

          This commit introduces a new reusable component.
          The component is fully tested and documented.

          BREAKING CHANGE: New props API
          Signed-off-by: John Doe`,
          `fix(core): optimize performance

          This improves the overall application performance.
          - Reduced bundle size
          - Improved load time

          Reviewed-by: Jane Smith
          Co-authored-by: Bob Johnson`,
        ],
      },
      invalid: {
        invalidType: [
          'random: some message',
          'invalid: some message',
          ': missing type',
          'FIX: uppercase type',
        ],
        invalidFormat: [
          'feat:missing space',
          'feat(scope:invalid parenthesis',
          'feat(scope) missing colon',
          'feat(:empty scope)',
        ],
        invalidScope: [
          'feat(INVALID-CASE): message',
          'fix(@INVALID-CHARS): message',
          'docs(52INVALID-COLONS): message',
        ],
        invalidSubjectCase: [
          'feat: UPPERCASE MESSAGE',
          'fix: INVALID CASE',
          'docs: THIS IS NOT ALLOWED',
        ],
        invalidBodyLeadingBlank: [
          `feat: message
          no blank line before body`,
          `fix: message
          another message without blank line`,
        ],
        invalidBodyCase: [
          `feat: message

          BODY IN UPPERCASE`,
          `fix: message

          ANOTHER BODY IN UPPERCASE`,
        ],
        invalidBodyFullStop: [
          `feat: message

          This is a body that ends with a period.`,
          `fix: message

          Another body that ends with a period.`,
        ],
        invalidFooterLeadingBlank: [
          `feat: message

          body
          BREAKING CHANGE: no blank line before footer`,
          `fix: message

          body
          Closes: #123`,
        ],
      },
    },
    withJira: {
      valid: {
        singleReference: [
          'feat: JIRA-123 add new feature',
          'fix: JIRA-456 fix login issue',
          'docs: JIRA-789 update api docs',
        ],
        multipleReferences: [
          'fix: JIRA-123 JIRA-456 fix multiple issues',
          'feat: JIRA-789 JIRA-101 add related features',
          'refactor: JIRA-202 JIRA-303 update components',
        ],
        withScope: [
          'feat(ui): JIRA-123 add button component',
          'fix(api): JIRA-456 handle errors',
          'refactor(core): JIRA-789 optimize performance',
        ],
        withBody: [
          `feat: JIRA-123 add new feature

          This feature implements the requirements specified in JIRA-123.
          `,
          `fix(api): JIRA-456 handle errors

          As described in JIRA-456, this fix implements proper error handling.
          The solution includes:
          - Better error messages
          - Proper status codes
          `,
        ],
        withFooter: [
          `feat: JIRA-123 add feature

          Implement new feature

          Related to: JIRA-124
          BREAKING CHANGE: New API
          `,
          `fix: JIRA-456 JIRA-457 update logic

          Fix multiple issues

          Closes: JIRA-456, JIRA-457
          Signed-off-by: John Doe
          `,
        ],
        withBodyAndFooter: [
          `feat(ui): JIRA-123 add component

          This implements the new component as specified in JIRA-123.
          The component includes all requested features.

          Related to: JIRA-124
          BREAKING CHANGE: New props API
          Signed-off-by: John Doe
          `,
          `fix(core): JIRA-456 optimize performance

          As per JIRA-456 requirements:
          - Improved load time
          - Reduced bundle size

          Closes: JIRA-456
          Related to: JIRA-457
          Reviewed-by: Jane Smith
          `,
        ],
      },
      invalid: {
        invalidJiraReference: [
          'feat: add new feature',
          'fix: fix some bugs',
          'feat(ui): add component',
        ],
        invalidJiraPrefix: [
          'feat: ABC-123 invalid prefix',
          'fix: TEST-456 wrong project',
          'docs: XYZ-789 not allowed',
        ],
        invalidJiraFormat: [
          'feat: jira-123 lowercase not allowed',
          'fix: JIRA123 missing hyphen',
          'docs: JIRA- missing number',
          'feat: JIRA-ABC invalid issue number',
        ],
        invalidSubjectCase: [
          'feat: JIRA-123 UPPERCASE MESSAGE',
          'fix: JIRA-456 INVALID CASE',
          'docs: JIRA-789 THIS IS NOT ALLOWED',
        ],
        invalidBodyLeadingBlank: [
          'feat: JIRA-123 add feature\nno blank line before body',
          'fix: JIRA-456 fix issue\nno blank line here either',
        ],
        invalidBodyCase: [
          `fix: JIRA-456 fix issue

          BODY IN UPPERCASE IS NOT ALLOWED`,
          `feat: JIRA-789 add feature

          ANOTHER BODY IN UPPERCASE`,
        ],
        invalidBodyFullStop: [
          `fix: JIRA-789 fix issue

          This body ends with an invalid period.`,
          `feat: JIRA-123 add feature

          Another body that ends with a period.`,
        ],
        invalidFooterLeadingBlank: [
          `feat: JIRA-123 add feature

          body
          Related to: JIRA-124`,
          `fix: JIRA-456 fix issue

          body
          BREAKING CHANGE: this is a breaking change`,
        ],
        invalidMixedPrefixes: [
          'feat: JIRA-123 ABC-456 mixed prefixes',
          'fix: JIRA-789 TEST-101 invalid combination',
          'docs: ABC-123 JIRA-456 wrong order',
        ],
      },
    },
  };

  describe('Commit Message Validation without Required JIRA', () => {
    describe('Valid Commits', () => {
      it('pass for basic valid commit messages', async () => {
        for (const message of messages.withoutJira.valid.basic) {
          const result = await commitLint(message);
          expect(result.valid).toBe(true);
        }
      });

      it('pass for commit messages with scope', async () => {
        for (const message of messages.withoutJira.valid.withScope) {
          const result = await commitLint(message);
          expect(result.valid).toBe(true);
        }
      });

      it('pass for commit messages with body', async () => {
        for (const message of messages.withoutJira.valid.withBody) {
          const result = await commitLint(message);
          expect(result.valid).toBe(true);
        }
      });

      it('pass for commit messages with footer', async () => {
        for (const message of messages.withoutJira.valid.withFooter) {
          const result = await commitLint(message);
          expect(result.valid).toBe(true);
        }
      });

      it('pass for commit messages with both body and footer', async () => {
        for (const message of messages.withoutJira.valid.withBodyAndFooter) {
          const result = await commitLint(message);
          expect(result.valid).toBe(true);
        }
      });
    });

    describe('Invalid Commits', () => {
      it('fail for invalid commit types', async () => {
        for (const message of messages.withoutJira.invalid.invalidType) {
          const result = await commitLint(message);
          expect(result.valid).toBe(false);
        }
      });
      it('fail for invalid commit format', async () => {
        for (const message of messages.withoutJira.invalid.invalidFormat) {
          const result = await commitLint(message);
          expect(result.valid).toBe(false);
        }
      });
      it('fail for invalid scope format', async () => {
        for (const message of messages.withoutJira.invalid.invalidScope) {
          const result = await commitLint(message);
          expect(result.valid).toBe(false);
        }
      });
      it('fail for uppercase subject', async () => {
        for (const message of messages.withoutJira.invalid.invalidSubjectCase) {
          const result = await commitLint(message);
          expect(result.valid).toBe(false);
        }
      });
      it('fail for invalid body format', async () => {
        for (const message of messages.withoutJira.invalid
          .invalidBodyLeadingBlank) {
          const result = await commitLint(message);
          expect(result.valid).toBe(false);
        }
      });

      it('fail for body ending with period', async () => {
        const message = messages.withoutJira.invalid.invalidBodyFullStop[0];
        const result = await commitLint(message);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('Commit Message Validation with Required JIRA', () => {
    describe('Valid Commits', () => {
      it('pass for valid commit messages with single JIRA reference', async () => {
        for (const message of messages.withJira.valid.singleReference) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(true);
        }
      });
      it('pass for valid commit messages with multiple JIRA references', async () => {
        for (const message of messages.withJira.valid.multipleReferences) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(true);
        }
      });
      it('pass for valid commit messages with scope and JIRA reference', async () => {
        for (const message of messages.withJira.valid.withScope) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(true);
        }
      });
      it('pass for valid commit messages with body', async () => {
        for (const message of messages.withJira.valid.withBody) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(true);
        }
      });
      it('pass for valid commit messages with footer', async () => {
        for (const message of messages.withJira.valid.withFooter) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(true);
        }
      });
      it('pass for valid commit messages with both body and footer', async () => {
        for (const message of messages.withJira.valid.withBodyAndFooter) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(true);
        }
      });
    });
    describe('Invalid Commits', () => {
      it('fail for commit messages without JIRA reference', async () => {
        for (const message of messages.withJira.invalid.invalidJiraReference) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(false);
        }
      });
      it('fail for commit messages with invalid JIRA prefix', async () => {
        for (const message of messages.withJira.invalid.invalidJiraPrefix) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(false);
        }
      });
      it('fail for commit messages with invalid JIRA format', async () => {
        for (const message of messages.withJira.invalid.invalidJiraFormat) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(false);
        }
      });
      it('fail for commit messages with uppercase subject after JIRA reference', async () => {
        for (const message of messages.withJira.invalid.invalidSubjectCase) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(false);
        }
      });
      it('fail for commit messages with invalid body format', async () => {
        for (const message of messages.withJira.invalid
          .invalidBodyLeadingBlank) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(false);
        }
      });

      it('fail for body ending with period with JIRA reference', async () => {
        const message = messages.withJira.invalid.invalidBodyFullStop[0];
        const result = await commitLint(message, {requireJira: true});
        expect(result.valid).toBe(false);
      });

      it('fail for commit messages with mixed issue prefixes', async () => {
        for (const message of messages.withJira.invalid.invalidMixedPrefixes) {
          const result = await commitLint(message, {requireJira: true});
          expect(result.valid).toBe(false);
        }
      });
    });
  });
});
