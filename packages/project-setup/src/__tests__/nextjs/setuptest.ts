import fs from 'fs';
import path from 'path';

import {describe, expect, it, beforeAll, afterAll} from 'vitest';
import {execa} from 'execa';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const TEST_DIR = path.join(__dirname, 'temp-nextjs');

describe('Next.js Project Setup', () => {
  beforeAll(async () => {
    // Create a temporary Next.js project
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, {recursive: true});
    }

    await execa({
      cwd: TEST_DIR,
    })`npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias @/*`;
  });

  afterAll(() => {
    // Cleanup
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, {recursive: true, force: true});
    }
  });

  it('setup project with FMSS configurations', async () => {
    // Run project setup
    const {stdout} = await execa({cwd: TEST_DIR})`ls`;
    console.log(stdout);
    const setupProcess = await execa({cwd: TEST_DIR})`node ./bin/setup.mjs`;

    expect(setupProcess.exitCode).toBe(0);

    // Check if essential files are created/modified
    const essentialFiles = ['.eslintrc.js', 'tsconfig.json', 'package.json'];

    for (const file of essentialFiles) {
      expect(fs.existsSync(path.join(TEST_DIR, file))).toBe(true);
    }

    // Check package.json for FMSS dependencies
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(TEST_DIR, 'package.json'), 'utf-8'),
    );
    expect(packageJson.devDependencies).toHaveProperty('@fmss/eslint-config');
    expect(packageJson.devDependencies).toHaveProperty(
      '@fmss/typescript-config',
    );
  });
});
