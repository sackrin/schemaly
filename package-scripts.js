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
      simple: "npx babel-node ./examples/simple.js",
      conditions: "npx babel-node ./examples/conditions.js",
      container: "npx babel-node ./examples/container.js",
      collection: "npx babel-node ./examples/collection.js",
      policy: "npx babel-node ./examples/policy.js",
      validation: "npx babel-node ./examples/validation.js",
      sanitization: "npx babel-node ./examples/sanitization.js",
    },
    build: {
      description: 'Builds library for deployment',
      default: series('npx nps clean', 'npx nps build.library', 'npx nps build.docs'),
      library: `npx tsc`,
      docs: `npx typedoc --options ./typedoc.js ./src`,
    },
    clean: {
      description: 'Deletes the various generated folders',
      script: series(rimraf('./lib'), rimraf('./docs')),
    },
  },
};
