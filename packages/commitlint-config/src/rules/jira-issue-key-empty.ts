import type {Rule} from '@commitlint/types';

import {SKIP_RULE} from '../constants';
// import rules from '@commitlint/rules';
// import {SKIP_RULE} from '../constants';

// const JIRA_PATTERN = /^JIRA-\d+(\s+JIRA-\d+)*\s+/;

export const jiraIssueKeyEmpty: Rule = (parsed, _when, _value) => {
  // const {header, scope, type, references} = parsed;

  // if (!references || references.length === 0) {
  //   return SKIP_RULE;
  // }

  // if (!type || !header) {
  //   return SKIP_RULE;
  // }

  // const firstColonIndex = header.indexOf(':');
  // const subject = header.slice(firstColonIndex + 1);
  // const isValid = JIRA_PATTERN.test(subject);

  // return [
  //   isValid,
  //   `JIRA issue key(s) must be at the beginning of the subject. Example: "type: JIRA-123 message" or "type: JIRA-123 JIRA-456 message"`,
  // ];
  return parsed.references.length < 1
    ? [false, 'Message must contain one or more JIRA issue keys']
    : SKIP_RULE;
};
