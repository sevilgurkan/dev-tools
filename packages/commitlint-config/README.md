# `@fmss/commitlint-config`

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](../../LICENSE.md) [![npm version](https://badge.fury.io/js/%40fmss%2Fcommitlint-config.svg)](https://badge.fury.io/js/%40fmss%2Fcommitlint-config.svg)

Commitlint config for enforcing consistent commit message conventions and rules

## Installation

```bash
$ npm install @fmss/commitlint-config
```

## Validation Messages

For detailed examples of valid and invalid commit messages, please see [Test Cases Documentation](https://github.com/sevilgurkan/dev-tools/blob/main/packages/commitlint-config/docs/TEST-CASES.md)

## Usage

Create a `.commitlintrc.js` file in your project root and use the configuration utility:

```javascript
import {createConfig} from '@fmss/commitlint-config';

export default createConfig({
  /* Enable JIRA issue reference validation */
  requireJira: true,

  /* Add custom commit types (optional) */
  additionalTypes: ['hotfix', 'config'],

  /* Add custom scopes (optional) */
  additionalScopes: ['auth', 'api', 'ui'],

  /**
   * Add ignores (optional)
   *
   * When you create a commit message, this message is passed as a parameter
   * to the functions given in the ignores array, if any of them returns true,
   * all other rules will be skipped.
   *
   * NOT RECOMMENDED unless needed for a special case
   */
  ignores: [
    (message) => message.startsWith('temp:'),
    (message) => message.includes('version changes'),
  ],
});
```

### Configuration Options

| Option             | Type                               | Default | Description                                                                                                                                                              |
| ------------------ | ---------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `requireJira`      | `boolean`                          | `false` | When enabled, enforces JIRA issue references in commit messages                                                                                                          |
| `additionalTypes`  | `string[]`                         | `[]`    | Additional commit types to allow beyond the defaults                                                                                                                     |
| `additionalScopes` | `string[]`                         | `[]`    | Additional scopes to allow beyond the defaults                                                                                                                           |
| `ignores`          | `((message: string) => boolean)[]` | `[]`    | Array of functions that take a commit message as a parameter and return a boolean. If any function returns true, all other rules will be skipped for that commit message |

### Default Commit Types

- `chore`: Miscellaneous commits
- `build`: Changes affecting build system or dependencies
- `ci`: Changes to CI configuration
- `docs`: Documentation changes
- `feat`: New features
- `fix`: Bug fixes
- `perf`: Performance improvements
- `refactor`: Code changes that neither fix bugs nor add features
- `revert`: Revert previous commits
- `style`: Code style changes
- `test`: Adding or updating tests
- `release`: Release commits
- `ops`: Operational changes
