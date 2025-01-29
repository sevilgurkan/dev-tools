import type {Rule} from '@commitlint/types';

import {SKIP_RULE} from '../../constants';

export const testRule: Rule = (parsed, _when, _value) => {
  console.log('*** test rule ***');
  console.dir({parsed}, {depth: Infinity});

  return SKIP_RULE;
};
