import path from 'node:path';

import {describe, expect, test, it, vi, beforeEach, beforeAll} from 'vitest';
import {execa} from 'execa';
import fs from 'fs-extra';

import {setup} from '../commands/setup';
import {generateCommitlintTemplate} from '../templates';
import {SetupOptions} from '../types';

import {checkFilesExist} from './utils';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const TEMPLATE_DIR = path.join(__dirname, 'templates', 'react-vite');
const TEST_DIR = path.join(__dirname, 'temp', 'react-vite-test');

const expectedScripts = {
  prepare: 'husky',
};

beforeEach(async () => {
  const templateDirExists = await fs.exists(TEMPLATE_DIR);
  if (!templateDirExists) {
    await execa({
      cwd: TEMPLATE_DIR,
    })`npm create vite@latest my-vue-app -- --template react-ts`;
  }

  const testDirExists = await fs.exists(TEST_DIR);
  if (testDirExists) {
    await fs.remove(TEST_DIR);
  }

  await fs.copy(TEMPLATE_DIR, TEST_DIR, {
    filter: (src) => !src.includes('node_modules'),
  });
});

describe('Vite React Project Setup', () => {
  const options: SetupOptions = {
    cwd: TEST_DIR,
    pm: 'yarn',
    useBitbucket: true,
  };

  const files = ['.husky/commit-msg', '.husky/pre-commit', '.commitlintrc.js'];
  const packageManagers = ['npm', 'yarn', 'pnpm'] as const;

  test('setup', async () => {
    await expect(setup(options)).resolves.not.toThrow();
  });
});
