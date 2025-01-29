import {describe, expect, test} from 'vitest';
import {type LintOptions, type QualifiedRules} from '@commitlint/types';
import lint from '@commitlint/lint';

import {plugin} from '../config';
import {DEFAULT_TYPES} from '../constants';
import {createConfig, type CreateConfigOptions} from '../create';

import {testCase} from './test-cases';

const commitLint = async (message: string, opts: CreateConfigOptions = {}) => {
  const config = createConfig(opts);

  const options = {
    parserOpts: config.parserPreset.parserOpts,
    plugins: {
      '@fmss': {
        rules: {
          ...plugin.rules,
          // 'test-rule': testRule,
        },
      },
    },
  } as LintOptions;

  const rules = {...config.rules} as QualifiedRules;

  const result = await lint(
    message,
    {
      ...rules,
      // 'test-rule': [RuleConfigSeverity.Warning, 'always'],
    },
    options,
  );

  return result;
};

describe('Plugin', () => {
  describe('Commit Message', () => {
    const cases = Object.entries(testCase);

    for (const [ruleName, {valid, invalid, options = {}}] of cases) {
      test.each(valid)(`${ruleName} - valid: %s`, async (msg) => {
        const result = await commitLint(msg, options);

        expect(result.valid).toBe(true);
      });

      test.each(invalid)(`${ruleName} - invalid: %s`, async (msg) => {
        const result = await commitLint(msg, options);

        expect(result.valid).toBe(false);
      });
    }
  });

  describe('Type Enum', () => {
    test.each(DEFAULT_TYPES)('type-enum: %s', async (type) => {
      const result = await commitLint(`${type}: message ${'x'.repeat(20)}`);

      expect(result.errors).toHaveLength(0);
    });
  });
});
