import inquirer from 'inquirer';

import {SetupOptions} from '../types';
import {DEPENDENCIES} from '../config';

import {CommandLineArgs} from './get-command-line-args';
import {getPackageManager} from './get-package-manager';
import {validateSetupDepsNames} from './validate-setup-dep-names';

export async function getOptions(
  cliArgs: CommandLineArgs,
): Promise<SetupOptions> {
  const {useBitbucket} = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useBitbucket',
      message:
        'Would you like to enable Bitbucket integration with JIRA task numbers in commit messages?',
      default: false,
      when: Boolean(cliArgs.bitbucket) === false,
    },
  ]);

  let pm;
  if (!cliArgs?.packageManager) {
    pm = await getPackageManager();
  } else {
    pm = cliArgs.packageManager;
  }

  validateSetupDepsNames(DEPENDENCIES);

  return {
    useBitbucket,
    pm,
    cwd: cliArgs.currentDir,
  };
}
