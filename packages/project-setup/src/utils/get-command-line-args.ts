import {Command} from 'commander';

import {PackageManager} from '../types';

export interface CommandLineArgs {
  packageManager: PackageManager;
  bitbucket: boolean;
  currentDir: string;
}

export function getCommandLineArgs(): CommandLineArgs {
  const program = new Command();

  program
    .option('--pm, --package-manager <type>', 'Package manager to use', 'npm')
    .option('-b, --bitbucket', 'Use Bitbucket configuration', false)
    .option(
      '--dir, --current-dir <path>',
      'Path to the project directory',
      process.cwd(),
    );

  program.parse(process.argv);

  const options = program.opts();

  return {
    packageManager: options.packageManager,
    bitbucket: options.bitbucket,
    currentDir: options.currentDir,
  };
}
