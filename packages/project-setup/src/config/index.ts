import {generateCommitlintConfig} from '../templates';

export const CONFIG = {
  dependencies: {
    required: [
      'husky',
      'lint-staged',
      '@commitlint/cli',
      '@commitlint/config-conventional',
    ],
    development: ['prettier', 'eslint'],
  },
  helpUrl:
    'https://github.com/sevilgurkan/web-configs/blob/main/packages/commit-manager/README.md',
  hooks: [
    {
      name: 'commit-msg',
      command: 'npx --no -- commitlint --edit $1',
    },
    {
      name: 'pre-commit',
      command: 'npx lint-staged',
    },
  ],
  lintStaged: {
    '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
    '*.{json,md,yml,yaml}': ['prettier --write'],
  },
};

export const PM_COMMANDS = {
  npm: {
    add: 'npm install',
    dev: '-D',
    execute: 'npx',
  },
  yarn: {
    add: 'yarn add',
    dev: '--dev',
    execute: 'yarn',
  },
  pnpm: {
    add: 'pnpm add',
    dev: '-D',
    execute: 'pnpm dlx',
  },
};

const PLUGIN_PACKAGE_NAME = '@fmss/commitlint-plugin';

export const DEPENDENCIES = [
  'husky',
  'lint-staged',
  '@commitlint/cli',
  '@commitlint/config-conventional',
  PLUGIN_PACKAGE_NAME,
];
