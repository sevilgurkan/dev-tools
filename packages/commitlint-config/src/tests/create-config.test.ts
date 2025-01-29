import {describe, it, expect} from 'vitest';
import {RuleConfigSeverity} from '@commitlint/types';

import {createConfig, type CreateConfigOptions} from '../create';
import {
  baseConfig,
  mergedRules,
  jiraRulesWithOverrides,
  plugin,
} from '../config';
import {DefaultRules} from '../types';

import {parseRule} from './utils';

function createUnsafeConfig(opts: unknown) {
  return createConfig(opts as CreateConfigOptions);
}

describe('createConfig utility', () => {
  describe('default configuration', () => {
    it('return default configuration when no options are provided', () => {
      const config = createConfig();

      expect(config).toStrictEqual({
        ...baseConfig,
        rules: {...mergedRules},
        plugins: [plugin],
        ignores: [],
      });
    });
  });

  describe('requireJira option', () => {
    it('include JIRA rules and plugin when requireJira is true', () => {
      const config = createConfig({requireJira: true});

      expect(config.rules).toStrictEqual({
        ...mergedRules,
        ...jiraRulesWithOverrides,
      });
      expect(config.plugins).toStrictEqual([plugin]);
    });

    it('not include JIRA rules and plugin when requireJira is false', () => {
      const config = createConfig({requireJira: false});

      expect(config.rules).toStrictEqual({...mergedRules});
      expect(config.plugins).toStrictEqual([plugin]);
    });
  });

  describe('additionalTypes option', () => {
    it('add custom types to type-enum rule', () => {
      const customTypes = ['custom', 'test'];
      const config = createConfig({additionalTypes: customTypes});

      const configTypeRule = parseRule(config.rules['type-enum']);

      expect(configTypeRule.severity).toBe(RuleConfigSeverity.Error);
      expect(configTypeRule.condition).toBe('always');
      expect(configTypeRule.value).toStrictEqual(
        expect.arrayContaining(customTypes),
      );
    });

    it('preserve existing types when adding custom types', () => {
      const customTypes = ['custom'];
      const config = createConfig({additionalTypes: customTypes});

      const configTypeRule = parseRule(config.rules['type-enum']);
      const baseTypeRule = parseRule<string[]>(mergedRules['type-enum']);

      expect(configTypeRule.value).toStrictEqual(
        expect.arrayContaining([...baseTypeRule.value, ...customTypes]),
      );
    });

    it('throw an error when additionalTypes is not an array', () => {
      expect(() =>
        createUnsafeConfig({additionalTypes: 'not an array'}),
      ).toThrow('additionalTypes must be an array');
    });

    it('throw an error when additionalTypes is not an array of strings', () => {
      expect(() => createUnsafeConfig({additionalTypes: [1, 2, 3]})).toThrow(
        'additionalTypes must be an array of strings',
      );
    });
  });

  describe('additionalScopes option', () => {
    it('add custom scopes to scope-enum rule', () => {
      const customScopes = ['app', 'config'];
      const config = createConfig({additionalScopes: customScopes});

      const parsedRule = parseRule(config.rules[DefaultRules.ScopeEnum]);

      expect(parsedRule.severity).toBe(RuleConfigSeverity.Error);
      expect(parsedRule.condition).toBe('always');
      expect(parsedRule.value).toStrictEqual(
        expect.arrayContaining(customScopes),
      );
    });

    it('scope-enum rule is disabled when additionalScopes is not specified', () => {
      const config = createConfig({});

      const originalRule = parseRule(mergedRules[DefaultRules.ScopeEnum], true);
      const configRule = parseRule(config.rules[DefaultRules.ScopeEnum], true);

      expect(originalRule?.severity).toBe(RuleConfigSeverity.Disabled);
      expect(configRule?.severity).toBe(RuleConfigSeverity.Disabled);
      expect(configRule).toStrictEqual(originalRule);
    });

    it('not modify scope-enum rule when additionalScopes is empty', () => {
      const config = createConfig({additionalScopes: []});

      const configScopeRule = parseRule(
        config.rules[DefaultRules.ScopeEnum],
        true,
      );

      const baseScopeRule = parseRule<string[]>(
        mergedRules[DefaultRules.ScopeEnum],
        true,
      );

      expect(configScopeRule?.severity).toBe(RuleConfigSeverity.Disabled);
      expect(baseScopeRule?.severity).toBe(RuleConfigSeverity.Disabled);
      expect(configScopeRule).toStrictEqual(baseScopeRule);
    });

    it('throw an error when additionalScopes is not an array', () => {
      expect(() =>
        createUnsafeConfig({additionalScopes: 'not an array'}),
      ).toThrow('additionalScopes must be an array');
    });

    it('throw an error when additionalScopes is not an array of strings', () => {
      expect(() => createUnsafeConfig({additionalScopes: [1, 2, 3]})).toThrow(
        'additionalScopes must be an array of strings',
      );
    });
  });

  describe('multiple options combination', () => {
    it('correctly combine all options', () => {
      const options = {
        requireJira: true,
        additionalTypes: ['custom'],
        additionalScopes: ['app'],
      };

      const config = createConfig(options);

      expect(config.plugins).toStrictEqual([plugin]);

      const configTypeRule = parseRule(config.rules[DefaultRules.TypeEnum]);

      const baseTypeRule = parseRule<string[]>(
        mergedRules[DefaultRules.TypeEnum],
      );

      expect(configTypeRule.value).toStrictEqual(
        expect.arrayContaining([...baseTypeRule.value, 'custom']),
      );

      const configScopeRule = parseRule(config.rules[DefaultRules.ScopeEnum]);
      expect(configScopeRule.value).toStrictEqual(
        expect.arrayContaining(['app']),
      );
    });
  });

  describe('ignores option', () => {
    it('accept valid ignore functions', () => {
      const validIgnores = [
        (message: string) => message.includes('WIP'),
        (message: string) => message.startsWith('temp:'),
        (message: string) => message.includes('version changes'),
      ];

      const config = createConfig({ignores: validIgnores});

      expect(config.ignores).toStrictEqual(validIgnores);
    });

    it('return empty array when ignores is not provided', () => {
      const config = createConfig();
      expect(config.ignores).toStrictEqual([]);
    });

    it('throw error when ignores is not an array', () => {
      expect(() => createUnsafeConfig({ignores: 'not an array'})).toThrow(
        'ignores must be an array',
      );
    });

    it('throw error when ignore items are not functions', () => {
      const invalidIgnores = ['not a function'];

      expect(() => createUnsafeConfig({ignores: invalidIgnores})).toThrow(
        'All ignore functions must take a string parameter and return a boolean',
      );
    });

    it('throw error when ignore functions do not return boolean', () => {
      const invalidIgnores = [
        (message: string) => message,
        (_: string) => 1,
        (_: string) => {
          return {};
        },
        (_: string) => undefined,
        (_: string) => null,
        (_: string) => [],
      ];

      expect(() => createUnsafeConfig({ignores: invalidIgnores})).toThrow(
        'All ignore functions must take a string parameter and return a boolean',
      );
    });
  });
});
