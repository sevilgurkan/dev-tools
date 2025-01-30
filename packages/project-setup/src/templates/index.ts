import prettier from 'prettier';

import {SetupOptions} from '../types';

export async function generateCommitlintTemplate({
  useBitbucket,
  pm,
}: SetupOptions) {
  // const installCommand = pm === 'yarn' ? 'add' : 'install';
  // const devFlag = pm === 'yarn' ? '--dev' : '-D';

  // await execa(pm, [
  //   installCommand,
  //   devFlag,
  //   '@fmss/commitlint-config',
  //   '@commitlint/cli',
  // ]);

  const template = `
  import { createConfig } from '@fmss/commitlint-config';

  export default createConfig({
    requireJira: ${useBitbucket ? true : false},
    additionalTypes: [],
    additionalScopes: [],

    // NOT RECOMMENDED unless needed for a special case
    ignores: []
  })
  `;

  return prettier.format(template, {parser: 'babel', printWidth: 120});
}
