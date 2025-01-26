import {RuleConfigSeverity} from '@commitlint/types';

import {
  baseConfig,
  baseRules,
  jiraRulesWithOverrides,
  fmssCommitlintPlugin,
} from './config.mjs';

const getValidatedArrayOfStrings = (array, fieldName) => {
  if (!Array.isArray(array)) {
    throw new Error(`${fieldName} must be an array`);
  }

  if (!array.every((item) => typeof item === 'string')) {
    throw new Error(`${fieldName} must be an array of strings`);
  }

  return array;
};

const createTypeEnumRule = (baseItems, additionalItems = []) => {
  if (additionalItems.length === 0) return baseItems;

  return [
    ...baseItems,
    ...getValidatedArrayOfStrings(additionalItems, 'additionalTypes'),
  ];
};

const extendRules = (
  rules,
  {requireJira = false, additionalTypes = [], additionalScopes = []},
) => {
  if (rules['type-enum']) {
    const typeRule = rules['type-enum'];
    typeRule[2] = createTypeEnumRule(typeRule[2], additionalTypes);
  }

  if (additionalScopes.length > 0) {
    rules['scope-enum'] = [
      RuleConfigSeverity.Error,
      'always',
      getValidatedArrayOfStrings(additionalScopes, 'additionalScopes'),
    ];
  }

  return requireJira ? {...rules, ...jiraRulesWithOverrides} : rules;
};

const checkAllIgnoreFnsValid = (ignores) => {
  if (!Array.isArray(ignores)) {
    throw new Error('ignores must be an array');
  }

  const testCommitMessage = 'test commit message';

  const isValid = ignores.every((ignore) => {
    if (typeof ignore !== 'function') {
      return false;
    }

    const result = ignore(testCommitMessage);
    return typeof result === 'boolean';
  });

  if (!isValid) {
    throw new Error(
      'All ignore functions must take a string parameter and return a boolean',
    );
  }

  return ignores;
};

/**
 * Creates a commitlint configuration with customizable options
 *
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.requireJira=false] - When enabled, enforces JIRA issue references in commit messages
 * @param {string[]} [options.additionalTypes=[]] - Additional commit types to allow beyond the defaults
 * @param {string[]} [options.additionalScopes=[]] - Additional scopes to allow beyond the defaults
 * @param {((message: string) => boolean)[]} [options.ignores=[]] - Array of functions that take a commit message as a parameter and return a boolean. If any function returns true, all other rules will be skipped for that commit message
 * @returns {import('@commitlint/types').UserConfig} Commitlint configuration
 */
export const createConfig = ({
  requireJira = false,
  additionalTypes = [],
  additionalScopes = [],
  ignores,
} = {}) => {
  const rules = requireJira
    ? {...baseRules, ...jiraRulesWithOverrides}
    : {...baseRules};
  const plugins = requireJira ? [fmssCommitlintPlugin] : [];

  const extendedRules = extendRules(rules, {
    requireJira,
    additionalTypes,
    additionalScopes,
  });

  const validIgnores = ignores ? checkAllIgnoreFnsValid(ignores) : [];

  return {
    ...baseConfig,
    rules: extendedRules,
    plugins,
    ignores: validIgnores,
  };
};
