import path from 'path';
import {fileURLToPath} from 'url';

import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = path.dirname(__dirname);

export const Logger = {
  success(message: string) {
    console.log(chalk.greenBright(`${message}`));
  },
  error(message: string) {
    console.log(chalk.redBright(`${message}`));
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

export function mapError(error: any) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
