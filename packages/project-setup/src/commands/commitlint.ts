import path from 'path';

import fs from 'fs-extra';

import {Logger, mapError} from '../utils';
import type {SetupOptions} from '../types';
import {generateCommitlintTemplate} from '../templates';

export async function setupCommitlint(options: SetupOptions) {
  try {
    const commitlintConfigFilePath = path.resolve(
      options.cwd,
      '.commitlintrc.js',
    );
    const template = await generateCommitlintTemplate(options);

    await fs.writeFile(commitlintConfigFilePath, template, 'utf-8');
  } catch (error) {
    Logger.error(`❌ Failed to setup Commitlint: ${mapError(error)}`);
    process.exit(1);
  }
}
