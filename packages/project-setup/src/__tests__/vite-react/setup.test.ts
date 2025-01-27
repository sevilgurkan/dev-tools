import fs from 'fs';
import path from 'path';
import os from 'os';

import {execa} from 'execa';
import {describe, expect, it, beforeAll, afterAll} from 'vitest';

const tempDir = fs.realpathSync(os.tmpdir());

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const TEST_DIR = path.join(__dirname, 'temp-vite-react');
// const TEST_DIR = tempDir;

console.log({TEST_DIR, __dirname, cwd: process.cwd()});

describe('Vite React Project Setup', () => {
  beforeAll(async () => {
    // Create a temporary Vite React project
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, {recursive: true});
    }

    await execa({
      cwd: TEST_DIR,
    })`npm create vite@latest . -- --template react-ts`;

    // Install dependencies

    const {stdio} = await execa({cwd: TEST_DIR})`npm install`;
    console.log(stdio);
  });

  // afterAll(() => {
  //   // Cleanup
  //   if (fs.existsSync(TEST_DIR)) {
  //     fs.rmSync(TEST_DIR, {recursive: true, force: true});
  //   }
  // });

  it('setup project with FMSS configurations', async () => {
    const {stdout: stdout1} = await execa({cwd: TEST_DIR})`ls`;
    console.log(stdout1);
    // Run project setup
    const setupProcess = await execa({
      cwd: process.cwd(),
    })`node ./bin/setup.mjs --pm npm --bitbucket`;

    const {stdout: stdout2} = await execa({cwd: TEST_DIR})`ls`;
    console.log(stdout2);

    expect(setupProcess.exitCode).toBe(0);

    // Check if essential files are created/modified
    const essentialFiles = [
      '.eslintrc.js',
      'tsconfig.json',
      'package.json',
      'vite.config.ts',
      'commitlint.config.mjs',
    ];

    for (const file of essentialFiles) {
      expect(fs.existsSync(path.join(TEST_DIR, file))).toBe(true);
    }

    // Check package.json for FMSS dependencies
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(TEST_DIR, 'package.json'), 'utf-8'),
    );
    expect(packageJson.devDependencies).toHaveProperty(
      '@fmss/commitlint-config',
    );
    expect(packageJson.devDependencies).toHaveProperty('@commitlint/cli');
    expect(packageJson.devDependencies).toHaveProperty(
      '@commitlint/config-conventional',
    );
  });
});
