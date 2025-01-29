import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {RuleConfigSeverity} from '@commitlint/types';

import {testCase} from '../src/tests/test-cases';
import {createConfig} from '../src';
import type {PluginRulesConfig} from '../src/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

generateTestDocs();

function generateTestDocs() {
  let markdown = `[comment]: # 'NOTE: This file is generated and should not be modify directly. Use \`pnpm run generate:test-docs\` instead'\n\n`;

  markdown += `# Commit Message Test Cases\n\n`;
  markdown += `This document contains test cases for commit message validation rules.\n\n`;
  markdown += `It is automatically generated using [generate-test-docs.ts](https://github.com/sevilgurkan/dev-tools/blob/main/packages/commitlint-config/scripts/generate-test-docs.ts).\n\n`;

  const codeBlock = (text: string, language = 'json') => {
    return `\`\`\`${language}\n${text}\n\`\`\``;
  };

  for (const [ruleName, values] of Object.entries(testCase)) {
    const {valid, invalid, options} = values;

    const config = createConfig(options);
    const [severity, when, value] = getConfigRuleDetail(config.rules, ruleName);

    markdown += `## ${ruleName}\n\n`;

    markdown += `| Severity | When     | Value    |\n`;
    markdown += `|:---------|:---------|:---------|\n`;
    markdown += `|${RuleConfigSeverity[severity] || '-'}|${when || '-'}|${value || '-'}|\n`;

    if (options) {
      markdown += `### Options\n${codeBlock(JSON.stringify(options, null, 2))}\n\n`;
    }

    markdown += `### Messages\n\n`;

    let messages = valid.map((msg) => `✅ ${msg}\n\n`).join('');
    messages += invalid.map((msg) => `❌ ${msg}`).join('\n\n');

    markdown += codeBlock(messages, 'shell');
    markdown += `\n\n`;
  }

  fs.writeFileSync(
    path.join(__dirname, '../docs/TEST-CASES.md'),
    markdown,
    'utf-8',
  );
}

function getConfigRuleDetail(rules: PluginRulesConfig, ruleName: string) {
  const ruleDetail = rules[ruleName as keyof typeof rules];

  let severity = null;
  let when = null;
  let value = null;

  if (!ruleDetail) {
    return [severity, when, value];
  }

  if (!Array.isArray(ruleDetail)) {
    return [severity, when, value];
  }

  [severity, when, value] = ruleDetail;

  return ruleDetail;
}
