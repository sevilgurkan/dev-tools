import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import ora from 'ora';
import {execa} from 'execa';
import {Command} from 'commander';

import {
  Logger,
  FileUtils,
  mapError,
  getPackageManager,
  getOptions,
  SetupOptions,
  rootDir,
} from '../utils';
import {CONFIG} from '../config';
import {generateCommitlintConfig} from '../templates';

async function installDependencies({pm}: SetupOptions) {
  const dependencies = [
    'husky',
    'lint-staged',
    '@commitlint/cli',
    '@commitlint/config-conventional',
  ];

  Logger.info('📦 Installing required dependencies...');

  try {
    const installCommand = pm === 'yarn' ? 'add' : 'install';
    const devFlag = pm === 'yarn' ? '--dev' : '-D';

    await execa(pm, [installCommand, devFlag, ...dependencies]);

    Logger.success('✅ Dependencies installed successfully!\n');
  } catch (error) {
    Logger.error('❌ Failed to install dependencies:');
    console.log(error);
    process.exit(1);
  }
}

async function setupHusky({pm}: SetupOptions) {
  const packageJsonPath = path.join(rootDir, 'package.json');

  try {
    const packageJson = FileUtils.readJsonFile(packageJsonPath);

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts.prepare = 'husky';

    FileUtils.writeJsonFile(packageJsonPath, packageJson);

    const huskyInitCommand = {
      npm: 'npx',
      yarn: 'yarn',
      pnpm: 'pnpm',
    };

    await execa(huskyInitCommand[pm], ['husky', 'init']);

    const huskyDirPath = path.join(rootDir, '.husky');
    FileUtils.ensureDirectoryExists(huskyDirPath);

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

    hooks.forEach(({name, command}) => {
      const hookFilePath = path.join(huskyDirPath, name);
      FileUtils.writeFile(hookFilePath, command);
    });

    // Make hooks executable on Unix-like systems
    if (process.platform !== 'win32') {
      for (const {name} of hooks) {
        const hookFilePath = path.join(huskyDirPath, name);
        await execa('chmod', ['+x', hookFilePath]);
      }
    }
  } catch (error) {
    Logger.error(`❌ Failed to setup Husky: ${mapError(error)}`);
    process.exit(1);
  }
}

async function setupCommitlint({useBitbucket, pm}: SetupOptions) {
  try {
    const commitlintConfigFilePath = path.join(rootDir, '.commitlintrc.js');
    const template = await generateCommitlintConfig({useBitbucket, pm});

    FileUtils.writeFile(commitlintConfigFilePath, template);
  } catch (error) {
    Logger.error(`❌ Failed to setup Commitlint: ${mapError(error)}`);
    process.exit(1);
  }
}

async function setupLintStaged() {
  const packageJsonPath = path.join(rootDir, 'package.json');

  try {
    if (!fs.existsSync(packageJsonPath)) {
      Logger.error('package.json not found');
      process.exit(1);
    }

    const packageJson = FileUtils.readJsonFile(packageJsonPath);

    packageJson['lint-staged'] = CONFIG.lintStaged;
    FileUtils.writeJsonFile(packageJsonPath, packageJson);
  } catch (error) {
    Logger.error(`❌ Failed to setup lint-staged: ${mapError(error)}`);
    process.exit(1);
  }
}

export async function setup() {
  Logger.info('🚀 Starting @fmss/commit-manager setup...');

  try {
    // checkRequiredFiles();

    const cliArgs = await getCommandLineArgs();

    const options = await getOptions(cliArgs);

    // const options = cliArgs;
    console.log(options);

    await installDependencies(options);

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
      action: () => setupLintStaged(),
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

async function getCommandLineArgs() {
  const program = new Command();

  program
    .option('--pm, --package-manager <type>', 'Package manager to use')
    .option('-b, --bitbucket', 'Use Bitbucket configuration', false);

  program.parse(process.argv);

  const options = program.opts();

  return {
    pm: options.packageManager,
    useBitbucket: options.bitbucket,
  };
}

function checkRequiredFiles() {
  const requiredDeps = ['prettier', 'eslint'];

  const packageJsonPath = path.join(rootDir, 'package.json');

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

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

(async () => {
  if (import.meta.url === `file://${process.argv[1]}`) {
    const pm = await getPackageManager();

    const isNpx = process.env._?.includes('npx');
    const isPnpmDlx =
      process.env._?.includes('pnpm') && process.argv[1].includes('.pnpm');
    const isYarnDlx =
      process.env._?.includes('yarn') && process.argv[1].includes('.yarn');

    if (pm || isNpx || isPnpmDlx || isYarnDlx) {
      setup();
      return;
    }

    Logger.error('❌ Setup failed');
    process.exit(1);
  }
})();

process.on('SIGINT', () => {
  process.exit(0);
});
