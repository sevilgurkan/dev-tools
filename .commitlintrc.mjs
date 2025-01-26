import {createConfig} from '@fmss/commitlint-config';

export default createConfig({
  additionalScopes: ['commitlint-config'],
  ignores: [(commit) => commit.includes('Version Packages')],
});
