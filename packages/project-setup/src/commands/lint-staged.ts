import path from 'path';

import fs from 'fs-extra';

import {Logger, mapError} from '../utils';
import {CONFIG} from '../config';
import {SetupOptions} from '../types';

export async function setupLintStaged({cwd}: SetupOptions) {
  const packageJsonPath = path.resolve(cwd, 'package.json');

  try {
    if (!fs.existsSync(packageJsonPath)) {
      Logger.error('package.json not found');
      process.exit(1);
    }

    let packageJson;

    try {
      packageJson = await fs.readJSON(packageJsonPath);
    } catch (error) {
      packageJson = {};
    }

    packageJson['lint-staged'] = CONFIG.lintStaged;

    await fs.writeJSON(packageJsonPath, packageJson, {spaces: 2});
  } catch (error) {
    Logger.error(`❌ Failed to setup lint-staged: ${mapError(error)}`);
    process.exit(1);
  }
}
