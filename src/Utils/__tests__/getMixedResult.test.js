import assert from 'assert';
import { getMixedResult } from '../';

describe('getMixedResult', function () {
  const valuesPromise = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['alpha_dash']);
  }));

  const valuesOptionsPromise = (options) => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['string|alpha_dash', ...options.inject]);
  }));

  it('A simple list of values can be passed and returned', () => {
    const values = ['required|email', 'min:18'];
    return getMixedResult(values)
      .then(builtValues => {
        assert.deepEqual(builtValues, values);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('A mixed list of values can be passed and returned built', () => {
    const values = ['required|email', 'min:18', valuesPromise];
    const expectedValues = ['required|email', 'min:18', 'alpha_dash'];
    return getMixedResult(values)
      .then(builtValues => {
        assert.deepEqual(builtValues, expectedValues);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('A mixed list of values with options can be passed and returned built', () => {
    const values = ['required|email', 'min:18', valuesOptionsPromise];
    const expectedValues = ['required|email', 'min:18', 'string|alpha_dash', 'alpha_num'];
    return getMixedResult(values, { inject: ['alpha_num'] })
      .then(builtValues => {
        assert.deepEqual(builtValues, expectedValues);
      }).catch((msg) => { throw new Error(msg); });
  });
});
