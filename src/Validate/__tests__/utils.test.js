import assert from 'assert';
import { buildRules } from '../utils';

describe('Validate Utils', function () {
  const rulesPromise = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['alpha_dash']);
  }));

  const rulesOptionsPromise = (options) => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['string|alpha_dash', ...options.inject]);
  }));

  it('A simple list of rules can be passed and returned', () => {
    const rules = ['required|email', 'min:18'];
    return buildRules(rules)
      .then(builtRules => {
        assert.deepEqual(builtRules, rules);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('A mixed list of rules can be passed and returned built', () => {
    const rules = ['required|email', 'min:18', rulesPromise];
    const expectedRules = ['required|email', 'min:18', 'alpha_dash'];
    return buildRules(rules)
      .then(builtRules => {
        assert.deepEqual(builtRules, expectedRules);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('A mixed list of rules with options can be passed and returned built', () => {
    const rules = ['required|email', 'min:18', rulesOptionsPromise];
    const expectedRules = ['required|email', 'min:18', 'string|alpha_dash', 'alpha_num'];
    return buildRules(rules, { inject: ['alpha_num'] })
      .then(builtRules => {
        assert.deepEqual(builtRules, expectedRules);
      }).catch((msg) => { throw new Error(msg); });
  });
});
