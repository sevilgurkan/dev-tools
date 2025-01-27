const kanvilEslintPlugin = require('@fmss/eslint-plugin');
const {default: plugin} = require('@vitest/eslint-plugin');
const vitest = require('@vitest/eslint-plugin');

module.exports = [
  {
    ignores: ['eslint.config.js', 'node_modules', '/coverage'],
  },
  ...kanvilEslintPlugin.configs.typescript,
  ...kanvilEslintPlugin.configs.prettier,
  ...kanvilEslintPlugin.configs.node,
  ...kanvilEslintPlugin.configs.jest,
  {
    rules: {
      'import/extensions': [
        'error',
        {
          mjs: 'always',
        },
      ],
    },
  },
  // {
  //   files: ['**/*.spec.ts*', '**/*.test.ts*', '**/*.test-d.ts*'],
  //   plugins: {
  //     vitest,
  //   },
  //   rules: {
  //     ...vitest.configs.recommended.rules,
  //     'vitest/expect-expect': 'warn',
  //   },

  //   settings: {vitest: {typecheck: true}},
  // },
];
