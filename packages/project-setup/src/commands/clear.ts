import path from 'path';
import {fileURLToPath} from 'url';
import {execSync} from 'child_process';

import fs from 'fs-extra';
import {execa} from 'execa';
import {rimraf} from 'rimraf';
import inquirer from 'inquirer';

import {getPackageManager} from '../utils/get-package-manager';

(async () => {
  console.log('Clearing...');

  const pm = await getPackageManager();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const dependencies = [
    'husky',
    'lint-staged',
    '@commitlint/cli',
    '@commitlint/config-conventional',
  ];

  const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
  const packageJson = await fs.readJSON(packageJsonPath);

  delete packageJson.scripts.prepare;
  delete packageJson['lint-staged'];

  if (pm === 'yarn') {
    delete packageJson.scripts.postinstall;
    delete packageJson.scripts.prepack;
    delete packageJson.scripts.postpack;
  }

  await fs.writeFile(packageJsonPath, packageJson);

  const uninstallCommand = pm === 'yarn' ? 'remove' : 'uninstall';

  if (pm === 'yarn') {
    for (const dependency of dependencies) {
      try {
        await execa(pm, [uninstallCommand, dependency]);
      } catch (error) {
        console.log(
          `${dependency} package could not be removed, it may not be installed.`,
        );
      }
    }
  } else {
    try {
      await execa(pm, [uninstallCommand, ...dependencies]);
    } catch (error) {
      console.log(
        `Some packages could not be removed, it may not be installed.`,
      );
    }
  }

  const lockFiles = {
    npm: 'package-lock.json',
    yarn: 'yarn.lock',
    pnpm: 'pnpm-lock.yaml',
  };

  await Promise.all([
    rimraf(path.resolve(__dirname, '..', '.git/hooks/*')),
    rimraf(path.resolve(__dirname, '..', '.cache')),
    rimraf(path.resolve(__dirname, '..', 'dist')),
    rimraf(path.resolve(__dirname, '..', lockFiles[pm])),
    rimraf(path.resolve(__dirname, '..', '.husky')),
    rimraf(path.resolve(__dirname, '..', '.commitlintrc.js')),
  ]);

  const cleanCacheCommand = {
    npm: 'npm cache clean --force',
    yarn: 'yarn cache clean',
    pnpm: 'pnpm store prune',
  };

  execSync(cleanCacheCommand[pm]);

  console.log('Cleared successfully');

  const {newPm} = await inquirer.prompt([
    {
      type: 'list',
      name: 'newPm',
      message: 'Which package manager do you want to use?',
      choices: ['npm', 'yarn', 'pnpm'],
    },
  ]);

  if (newPm) {
    try {
      const {all} = await execa({all: true})`${newPm} install`;
      console.log(all);
      console.log('Installed successfully');
    } catch (error) {
      console.log('Failed to install');
    }
  }
})();
