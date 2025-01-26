import {createConfig} from '../utils.mjs';
import {
  SEVERITY,
  baseConfig,
  baseRules,
  jiraRulesWithOverrides,
  fmssCommitlintPlugin,
} from '../config.mjs';

describe('createConfig utility', () => {
  describe('default configuration', () => {
    it('return default configuration when no options are provided', () => {
      const config = createConfig();

      expect(config).toStrictEqual({
        ...baseConfig,
        rules: {...baseRules},
        plugins: [],
        ignores: [],
      });
    });
  });

  describe('requireJira option', () => {
    it('include JIRA rules and plugin when requireJira is true', () => {
      const config = createConfig({requireJira: true});

      expect(config.rules).toStrictEqual({
        ...baseRules,
        ...jiraRulesWithOverrides,
      });
      expect(config.plugins).toStrictEqual([fmssCommitlintPlugin]);
    });

    it('not include JIRA rules and plugin when requireJira is false', () => {
      const config = createConfig({requireJira: false});

      expect(config.rules).toStrictEqual({...baseRules});
      expect(config.plugins).toStrictEqual([]);
    });
  });

  describe('additionalTypes option', () => {
    it('add custom types to type-enum rule', () => {
      const customTypes = ['custom', 'test'];
      const config = createConfig({additionalTypes: customTypes});

      const [severity, condition, types] = config.rules['type-enum'];
      expect(severity).toBe(SEVERITY.Error);
      expect(condition).toBe('always');
      expect(types).toStrictEqual(expect.arrayContaining(customTypes));
    });

    it('preserve existing types when adding custom types', () => {
      const customTypes = ['custom'];
      const config = createConfig({additionalTypes: customTypes});

      const [_severity, _condition, types] = config.rules['type-enum'];
      const originalTypes = baseRules['type-enum'][2];
      expect(types).toStrictEqual(
        expect.arrayContaining([...originalTypes, ...customTypes]),
      );
    });

    it('throw an error when additionalTypes is not an array', () => {
      expect(() => createConfig({additionalTypes: 'not an array'})).toThrow(
        'additionalTypes must be an array',
      );
    });

    it('throw an error when additionalTypes is not an array of strings', () => {
      expect(() => createConfig({additionalTypes: [1, 2, 3]})).toThrow(
        'additionalTypes must be an array of strings',
      );
    });
  });

  describe('additionalScopes option', () => {
    it('add custom scopes to scope-enum rule', () => {
      const customScopes = ['app', 'config'];
      const config = createConfig({additionalScopes: customScopes});

      const [severity, condition, scopes] = config.rules['scope-enum'];
      expect(severity).toBe(SEVERITY.Error);
      expect(condition).toBe('always');
      expect(scopes).toStrictEqual(expect.arrayContaining(customScopes));
    });

    it('not modify scope-enum rule when additionalScopes is empty', () => {
      const config = createConfig({additionalScopes: []});
      const originalScopeRule = baseRules['scope-enum'];

      expect(config.rules['scope-enum']).toStrictEqual(originalScopeRule);
    });

    it('throw an error when additionalScopes is not an array', () => {
      expect(() => createConfig({additionalScopes: 'not an array'})).toThrow(
        'additionalScopes must be an array',
      );
    });

    it('throw an error when additionalScopes is not an array of strings', () => {
      expect(() => createConfig({additionalScopes: [1, 2, 3]})).toThrow(
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

      expect(config.rules).toStrictEqual(
        expect.objectContaining({...baseRules, ...jiraRulesWithOverrides}),
      );
      expect(config.plugins).toStrictEqual([fmssCommitlintPlugin]);

      const [_typeSeverity, _typeCondition, types] = config.rules['type-enum'];
      expect(types).toStrictEqual(
        expect.arrayContaining([...baseRules['type-enum'][2], 'custom']),
      );

      const [_scopeSeverity, _scopeCondition, scopes] =
        config.rules['scope-enum'];
      expect(scopes).toStrictEqual(expect.arrayContaining(['app']));
    });
  });

  describe('ignores option', () => {
    it('accept valid ignore functions', () => {
      const validIgnores = [
        (message) => message.includes('WIP'),
        (message) => message.startsWith('temp:'),
        (message) => message.includes('version changes'),
      ];

      const config = createConfig({ignores: validIgnores});

      expect(config.ignores).toStrictEqual(validIgnores);
    });

    it('return empty array when ignores is not provided', () => {
      const config = createConfig();
      expect(config.ignores).toStrictEqual([]);
    });

    it('throw error when ignores is not an array', () => {
      expect(() => createConfig({ignores: 'not an array'})).toThrow(
        'ignores must be an array',
      );
    });

    it('throw error when ignore items are not functions', () => {
      const invalidIgnores = ['not a function'];

      expect(() => createConfig({ignores: invalidIgnores})).toThrow(
        'All ignore functions must take a string parameter and return a boolean',
      );
    });

    it('throw error when ignore functions do not return boolean', () => {
      const invalidIgnores = [
        (message) => message,
        (message) => 1,
        (message) => {
          return {};
        },
        (message) => undefined,
        (message) => null,
        (message) => [],
      ];

      expect(() => createConfig({ignores: invalidIgnores})).toThrow(
        'All ignore functions must take a string parameter and return a boolean',
      );
    });
  });
});
