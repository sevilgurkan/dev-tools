[comment]: # 'NOTE: This file is generated and should not be modify directly. Update `templates/ROOT_README.hbs.md` instead'

# FMSS Dev Tools

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

This repository serves as a centralized hub for FMSS's development ecosystem, providing tools and reusable solutions to streamline development workflows across all web projects.

## Usage

This repo is managed as a monorepo that is composed of many npm packages, where each package has its own `README` and documentation describing usage.

### Packages

<table>
  <thead>
    <tr>
      <th align="left">Package</th>
      <th align="left">Version</th>
      <th align="left">Size</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="left"><a href="packages/commitlint-config"><strong>commitlint-config</strong></a></td>
      <td align="left"><a href="https://badge.fury.io/js/%40fmss%2Fcommitlint-config"><img src="https://badge.fury.io/js/%40fmss%2Fcommitlint-config.svg" alt="npm version"></a></td>
      <td align="left"><a href="https://img.shields.io/bundlephobia/minzip/@fmss/commitlint-config.svg"><img src="https://img.shields.io/bundlephobia/minzip/@fmss/commitlint-config.svg" alt="npm bundle size"></a></td>
    </tr>
  </tbody>
</table>

### Contributing

- Filing [bug reports](https://github.com/sevilgurkan/dev-tools/issues/new?template=BUG_REPORT.md)
- Requesting new features or packages via [an issue](https://github.com/sevilgurkan/dev-tools/issues/new/choose)
- Improving the existing codebase by picking up an issue, improving tests, or furthering documentation

#### Documentation

If your change affects the public API of any packages within this repository (i.e. changing function parameters or adding new features, etc), please ensure the documentation is updated, and a changelog is added to reflect this. Documentation is in the `README.md` files of each package.

### Releasing

The release process involves the following steps:

1. Submit all your changes via a Pull Request to the main branch
2. Once your PR is approved and merged, a new release can be created
3. Version numbers are managed automatically - do not manually modify versions in `package.json` files

**Note:** Version numbers are updated automatically through scripts as part of the release process.

## License

see [LICENSE.md](LICENSE.md) for details.
