import type {Rule} from '@commitlint/types';

import {Messages, SKIP_RULE} from '../constants';

export const scopeEmptyParentheses: Rule = (parsed, _when, _value) => {
  const {scope, header} = parsed;

  if (scope === null && header && /\(\s*\)/.test(header)) {
    return [false, Messages.EMPTY_PARENT_SCOPE];
  }

  return SKIP_RULE;
};
