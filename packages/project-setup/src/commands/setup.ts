import path from 'path';

import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import {execa} from 'execa';

import {Logger, mapError, rootDir} from '../utils';
import type {SetupOptions} from '../types';
import {CONFIG} from '../config';
import {getOptions} from '../utils/get-options';
import {getCommandLineArgs} from '../utils/get-command-line-args';

import {setupHusky} from './husky';
import {setupCommitlint} from './commitlint';
import {setupLintStaged} from './lint-staged';

async function installDependencies({cwd, pm}: SetupOptions) {
  const dependencies = ['husky', 'lint-staged', '@commitlint/cli'];

  Logger.info('📦 Installing required dependencies...');

  try {
    const installCommand = pm === 'yarn' ? 'add' : 'install';
    const devFlag = pm === 'yarn' ? '--dev' : '-D';

    await execa({
      cwd,
    })`${pm} ${installCommand} ${devFlag} ${dependencies.join(' ')}`;

    Logger.success('✅ Dependencies installed successfully!\n');
  } catch (error) {
    Logger.error('❌ Failed to install dependencies:');
    console.log(error);
    process.exit(1);
  }
}

export async function setup(initialOptions?: SetupOptions) {
  Logger.info('🚀 Starting @fmss/commit-manager setup...');

  try {
    // checkRequiredFiles();

    const options = initialOptions
      ? initialOptions
      : await getOptions(getCommandLineArgs());

    // await installDependencies(options);

    await runSetupSteps(options);

    console.log(
      `\n🎉 @fmss/commit-manager has been configured with:\n - Husky hooks for commit-msg and pre-commit\n - Commitlint with conventional commit rules\n - Lint-staged for automated code formatting\n Your repository is now set up with standardized commit messages and pre-commit checks.\n\nFor more information, please visit:\n${chalk.bold(CONFIG.helpUrl)}\n\n`,
    );
  } catch (error) {
    console.log(error);
    Logger.error(`❌ Setup failed: ${mapError(error)}`);
    process.exit(1);
  }
}

async function runSetupSteps(options: SetupOptions) {
  const steps = [
    {
      title: '🐶 Setting up Husky...',
      action: () => setupHusky(options),
      successText: '✅ Husky setup completed',
    },
    {
      title: '📝 Setting up Commitlint...',
      action: () => setupCommitlint(options),
      successText: '✅ Commitlint setup completed',
    },
    {
      title: '🎯 Setting up lint-staged...',
      action: () => setupLintStaged(options),
      successText: '✅ Lint-staged setup completed',
    },
  ];

  try {
    const spinner = ora({
      color: 'cyan',
      spinner: 'dots',
      interval: 50,
      indent: 0,
    });

    for (const step of steps) {
      spinner.start(step.title);
      await step.action();
      spinner.succeed(step.successText);
    }
  } catch (error) {
    Logger.error(`❌ Failed to setup Husky: ${mapError(error)}`);
    process.exit(1);
  }
}

async function checkRequiredFiles() {
  const requiredDeps = ['prettier', 'eslint'];

  const packageJsonPath = path.join(rootDir, 'package.json');

  try {
    const packageJson = await fs.readJSON(packageJsonPath);

    const dependencies = {
      ...packageJson?.dependencies,
      ...packageJson?.devDependencies,
    };

    const missingDeps = requiredDeps.filter((dep) => !dependencies[dep]);

    if (missingDeps.length > 0) {
      Logger.error(
        `❌ The following dependencies are missing: ${missingDeps.join(', ')}`,
      );
      Logger.warning(
        `Please install them first using:\nnpm install -D ${missingDeps.join(' ')}`,
      );
      console.log(
        `Or you can install ${chalk.blueBright('@fmss/eslint-plugin')} and ${chalk.blueBright('@fmss/prettier-config')} packages`,
      );
      process.exit(1);
    }
  } catch (error) {
    Logger.error(`❌ Failed to read package.json: ${mapError(error)}`);
    process.exit(1);
  }
}
