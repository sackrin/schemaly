import assert from 'assert';
import { buildRules } from './utils';

describe('Sanitize Utils', function () {
  const rulesPromise = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['trim']);
  }));

  const rulesOptionsPromise = (options) => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['sanitize_string', ...options.inject]);
  }));

  it('A simple list of rules can be passed and returned', () => {
    const rules = ['trim', 'sanitize_string'];
    return buildRules(rules)
      .then(builtRules => {
        assert.deepEqual(builtRules, rules);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('A mixed list of rules can be passed and returned built', () => {
    const rules = ['sanitize_string', rulesPromise];
    const expectedRules = ['sanitize_string', 'trim'];
    return buildRules(rules)
      .then(builtRules => {
        assert.deepEqual(builtRules, expectedRules);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('A mixed list of rules with options can be passed and returned built', () => {
    const rules = ['trim', rulesOptionsPromise];
    const expectedRules = ['trim', 'sanitize_string', 'base64'];
    return buildRules(rules, { inject: ['base64'] })
      .then(builtRules => {
        assert.deepEqual(builtRules, expectedRules);
      }).catch((msg) => { throw new Error(msg); });
  });
});
