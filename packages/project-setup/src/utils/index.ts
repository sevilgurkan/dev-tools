import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import chalk from 'chalk';
import {detect} from 'detect-package-manager';
import inquirer from 'inquirer';
import validatePackageName from 'validate-npm-package-name';

import {PackageManager} from '../types';
import {DEPENDENCIES} from '../config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = path.dirname(__dirname);

export const FileUtils = {
  ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, {recursive: true});
    }
  },
  writeFileIfNotExists(filePath: string, content: string) {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  },
  writeFile(filePath: string, content: any) {
    fs.writeFileSync(filePath, content, 'utf8');
  },
  readJsonFile(filePath: string) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      throw new Error(`Failed to read JSON file ${filePath}: ${message}`);
    }
  },
  writeJsonFile(filePath: string, content: any) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      throw new Error(`Failed to write JSON file ${filePath}: ${message}`);
    }
  },
};

export const Logger = {
  success(message: string) {
    console.log(chalk.greenBright(`${message}`));
  },
  error(message: string) {
    console.error(chalk.redBright(`${message}`));
  },
  info(message: string) {
    console.log(chalk.blue(`${message}`));
  },
  warning(message: string) {
    console.log(chalk.yellow(`${message}`));
  },
};

export const pmCommands = {
  npm: {
    install: 'npm install',
  },
  yarn: {
    install: 'yarn',
  },
  pnpm: {
    install: 'pnpm install',
    add: 'pnpm add',
  },
};

export async function getPackageManager() {
  let pm: string;

  try {
    pm = await detect();

    const allowedPackageManagers = ['npm', 'yarn', 'pnpm'];

    if (!allowedPackageManagers.includes(pm)) {
      Logger.error(`❌ Unsupported package manager: ${pm}`);
      process.exit(1);
    }

    return pm as PackageManager;
  } catch (error) {
    // Fallback detection logic
    const userAgent = process.env.npm_config_user_agent || '';

    if (userAgent.startsWith('yarn')) {
      pm = 'yarn';
    } else if (userAgent.startsWith('pnpm')) {
      pm = 'pnpm';
    } else if (userAgent.startsWith('npm')) {
      pm = 'npm';
    } else {
      Logger.error('❌ Failed to detect package manager');
      process.exit(1);
    }
  }

  return pm as PackageManager;
}

export function mapError(error: any) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export interface SetupOptions {
  useBitbucket: boolean;
  pm: PackageManager;
}

export async function getOptions(cliArgs: SetupOptions): Promise<SetupOptions> {
  const options: SetupOptions = {
    useBitbucket: false,
    pm: 'npm',
  };

  console.log({cliArgs});

  const {useBitbucket} = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useBitbucket',
      message:
        'Would you like to enable Bitbucket integration with JIRA task numbers in commit messages?',
      default: false,
      when: Boolean(cliArgs.useBitbucket) === false,
    },
  ]);

  let pm;
  if (!cliArgs?.pm) {
    pm = await getPackageManager();
  } else {
    pm = cliArgs.pm;
  }

  validateSetupDepsNames(DEPENDENCIES);

  options.useBitbucket = useBitbucket;
  options.pm = pm;
  return options;
}

function validateSetupDepsNames(dependencies: string[]) {
  for (const dependency of dependencies) {
    const {validForNewPackages, errors} = validatePackageName(dependency);

    if (!validForNewPackages) {
      Logger.error(`❌ Invalid package name: ${dependency}`);

      for (const error of errors ?? []) {
        Logger.error(error);
      }

      process.exit(1);
    }
  }
}
