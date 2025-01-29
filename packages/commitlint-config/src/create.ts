import {RuleConfigSeverity} from '@commitlint/types';

import type {PluginRulesConfig} from './types/index.js';
import {
  baseConfig,
  mergedRules,
  jiraRulesWithOverrides,
  plugin,
} from './config.js';
import {DefaultRules} from './types/index.js';

type IgnoreFn = (message: string) => boolean;

const getValidatedArrayOfStrings = (array: string[], fieldName: string) => {
  if (!Array.isArray(array)) {
    throw new Error(`${fieldName} must be an array`);
  }

  if (!array.every((item) => typeof item === 'string')) {
    throw new Error(`${fieldName} must be an array of strings`);
  }

  return array;
};

const createTypeEnumRule = (
  baseItems: string[],
  additionalItems: string[] = [],
) => {
  if (additionalItems.length === 0) return baseItems;

  return [
    ...baseItems,
    ...getValidatedArrayOfStrings(additionalItems, 'additionalTypes'),
  ];
};

const extendRules = (
  rules: any,
  createOptions: CreateConfigOptions,
): PluginRulesConfig => {
  const newRules = {...rules};

  const {requireJira, additionalTypes, additionalScopes} = createOptions;

  if (additionalTypes && newRules[DefaultRules.TypeEnum]) {
    const typeRule = newRules[DefaultRules.TypeEnum];
    typeRule[2] = createTypeEnumRule(typeRule[2], additionalTypes);
  }

  if (additionalScopes && additionalScopes.length > 0) {
    newRules[DefaultRules.ScopeEnum] = [
      RuleConfigSeverity.Error,
      'always',
      getValidatedArrayOfStrings(additionalScopes, 'additionalScopes'),
    ];
  }

  return requireJira ? {...newRules, ...jiraRulesWithOverrides} : {...newRules};
};

const checkAllIgnoreFnsValid = (ignores: IgnoreFn[]) => {
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

export interface CreateConfigOptions {
  requireJira?: boolean;
  additionalTypes?: string[];
  additionalScopes?: string[];
  ignores?: IgnoreFn[];
}

export const createConfig = ({
  requireJira = false,
  additionalTypes = [],
  additionalScopes = [],
  ignores,
}: CreateConfigOptions = {}) => {
  const plugins = [plugin];

  const extendedRules = extendRules(mergedRules, {
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
