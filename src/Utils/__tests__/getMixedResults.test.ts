import { expect } from 'chai';
import { getMixedResult } from '../';

describe('getMixedResult', function(): void {
  function valuesPromise(): Promise<void> {
    return new Promise(function (resolve) {
      setTimeout(resolve, 100, ['alpha_dash']);
    });
  }

  function valuesOptionsPromise(options: any = {}): Promise<void> {
    return new Promise(function (resolve) {
      setTimeout(resolve, 100, ['string|alpha_dash', ...options.inject]);
    });
  }

  it('A simple list of values can be passed and returned', () => {
    const values: string[] = ['required|email', 'min:18'];
    return getMixedResult(values)
      .then(builtValues => {
        expect(builtValues).to.deep.equal(values);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('A mixed list of values can be passed and returned built', () => {
    const values: Array<string | Function> = ['required|email', 'min:18', valuesPromise];
    const expectedValues: string[] = ['required|email', 'min:18', 'alpha_dash'];
    return getMixedResult(values)
      .then(builtValues => {
        expect(builtValues).to.deep.equal(expectedValues);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('A mixed list of values with options can be passed and returned built', () => {
    const values: Array<string | Function> = ['required|email', 'min:18', valuesOptionsPromise];
    const expectedValues: string[] = ['required|email', 'min:18', 'string|alpha_dash', 'alpha_num'];
    return getMixedResult(values, { inject: ['alpha_num'] })
      .then(builtValues => {
        expect(builtValues).to.deep.equal(expectedValues);
      }).catch((msg) => { throw new Error(msg); });
  });
});
