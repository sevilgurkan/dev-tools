import prettier from 'prettier';
import {execa} from 'execa';

import type {PackageManager} from '../types';

export async function generateCommitlintConfig({
  useBitbucket = false,
  pm,
}: {
  useBitbucket?: boolean;
  pm: PackageManager;
}) {
  const installCommand = pm === 'yarn' ? 'add' : 'install';
  const devFlag = pm === 'yarn' ? '--dev' : '-D';

  await execa(pm, [
    installCommand,
    devFlag,
    '@fmss/commitlint-config',
    '@commitlint/cli',
    '@commitlint/config-conventional',
  ]);

  const template = `
  import { createConfig } from '@fmss/commitlint-config';

  export default createConfig({
    requireJira: ${useBitbucket ? true : false},
    additionalTypes: [],
    additionalScopes: [],
    ignores: []
  })
  `;

  return prettier.format(template, {parser: 'babel', printWidth: 120});
}
