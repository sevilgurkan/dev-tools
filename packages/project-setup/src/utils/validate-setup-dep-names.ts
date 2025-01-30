import validatePackageName from 'validate-npm-package-name';

import {Logger} from '.';

export function validateSetupDepsNames(dependencies: string[]) {
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
