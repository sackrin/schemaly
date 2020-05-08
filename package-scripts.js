const { series, rimraf } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps standards',
    standards: {
      default: series('npx nps standards.lint', 'npx nps standards.unit'),
      lint: "tslint -c tslint.json 'src/**/*.ts'",
      unit: 'npx mocha -r ts-node/register ./src/**/*.test.ts',
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
