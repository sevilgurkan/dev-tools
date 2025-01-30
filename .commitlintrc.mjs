import {createConfig} from '@fmss/commitlint-config';

export default createConfig({
  additionalScopes: ['commitlint-config', 'project-setup'],
  ignores: [(commit) => commit.includes('Version Packages')],
});
