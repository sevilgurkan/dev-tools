import path from 'path';

import {execa} from 'execa';
import fs from 'fs-extra';

import {Logger, mapError} from '../utils';
import type {SetupOptions} from '../types';

export async function setupHusky({pm, cwd}: SetupOptions) {
  const packageJsonPath = path.resolve(cwd, 'package.json');

  try {
    let packageJson;

    try {
      packageJson = await fs.readJSON(packageJsonPath);
    } catch (error) {
      packageJson = {};
    }

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts.prepare = 'husky';

    await fs.writeJSON(packageJsonPath, packageJson, {spaces: 2});

    const huskyInitCommand = {
      npm: 'npx',
      yarn: 'yarn',
      pnpm: 'pnpm',
    };

    await execa({cwd})`${huskyInitCommand[pm]} husky init`;

    const huskyDirPath = path.resolve(cwd, '.husky');

    await fs.ensureDir(huskyDirPath);

    const pmExecCommand = {
      npm: 'npx',
      pnpm: 'pnpm dlx',
      yarn: 'yarn',
    };

    const hooks = [
      {
        name: 'commit-msg',
        command: [
          pmExecCommand[pm],
          pm === 'npm' ? '--no --' : '',
          'commitlint --edit $1',
        ]
          .filter(Boolean)
          .join(' '),
      },
      {
        name: 'pre-commit',
        command: [pmExecCommand[pm], 'lint-staged'].filter(Boolean).join(' '),
      },
    ];

    const hookFilePromises = hooks.map(({name, command}) => {
      const hookFilePath = path.resolve(huskyDirPath, name);
      return fs.writeFile(hookFilePath, command);
    });

    await Promise.all(hookFilePromises);

    // Make hooks executable on Unix-like systems
    if (process.platform !== 'win32') {
      for (const {name} of hooks) {
        const hookFilePath = path.join(huskyDirPath, name);
        await execa({cwd})`chmod +x ${hookFilePath}`;
      }
    }
  } catch (error) {
    Logger.error(`❌ Failed to setup Husky: ${mapError(error)}`);
    process.exit(1);
  }
}
