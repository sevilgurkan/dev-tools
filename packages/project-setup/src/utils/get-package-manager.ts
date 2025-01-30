import {detect} from 'detect-package-manager';

import {PackageManager} from '../types';

import {Logger} from '.';

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
