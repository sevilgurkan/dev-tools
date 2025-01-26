const {readdirSync, existsSync} = require('fs');
const path = require('path');

const jsPackageNames = getPackageNames('js');

/**
 * @param {import('plop').NodePlopAPI} plop
 */
module.exports = function plopfile(plop) {
  plop.setGenerator('package', {
    description: 'Create a new package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the package? Ex. prettier-config',
      },
      {
        type: 'input',
        name: 'description',
        message: 'What is the description of the package?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/package.json',
        templateFile: 'templates/package.hbs.json',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/README.md',
        templateFile: 'templates/PACKAGE_README.hbs.md',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/CHANGELOG.md',
        templateFile: 'templates/CHANGELOG.hbs.md',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/src/index.js',
        templateFile: 'templates/index.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/src/{{properCase name}}.js',
        templateFile: 'templates/my-package.hbs.js',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/src/tests/{{properCase name}}.test.js',
        templateFile: 'templates/test.hbs.js',
      },
    ],
  });

  plop.setGenerator('docs', {
    description: 'Generate root repo documentation',
    prompts: [],
    actions: [
      {
        type: 'add',
        path: 'README.md',
        templateFile: 'templates/README.hbs.md',
        force: true,
        data: {jsPackageNames},
      },
    ],
  });
};

function getPackageNames() {
  const packagesPath = path.join(__dirname, 'packages');
  return readdirSync(packagesPath).filter(hasPackageJson);

  function hasPackageJson(packageName) {
    const packageJsonPath = path.join(
      packagesPath,
      packageName,
      'package.json',
    );
    return existsSync(packageJsonPath);
  }
}
