const { series, rimraf } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps standards',
    standards: {
      default: series('npx nps standards.lint', 'npx nps standards.unit'),
      lint: "tslint -c tslint.json 'src/**/*.ts'",
      unit: 'npx mocha -r ts-node/register ./src/**/*.test.ts',
    },
    examples: {
      default: 'npx nps examples.simple',
      simple: "npx babel-node ./examples/examples/simple.js",
      arrays: "npx babel-node ./examples/examples/arrays.js",
      conditions: "npx babel-node ./examples/examples/conditions.js",
      container: "npx babel-node ./examples/examples/container.js",
      flatten: "npx babel-node ./examples/examples/flatten.js",
      collection: "npx babel-node ./examples/examples/collection.js",
      policy: "npx babel-node ./examples/examples/policy.js",
      validation: "npx babel-node ./examples/examples/validation.js",
      sanitization: "npx babel-node ./examples/examples/sanitization.js",
    },
    build: {
      description: 'Builds library for deployment',
      default: series('npx nps clean', 'npx nps build.library'),
      library: `npx tsc`
    },
    clean: {
      description: 'Deletes the various generated folders',
      script: series(rimraf('./lib')),
    },
  },
};
