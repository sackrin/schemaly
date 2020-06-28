import { expect } from 'chai';
import { getMixedResult } from '../index';

describe('Utils/getMixedResult', (): void => {
  it('A simple list of values can be passed and returned', () => {
    const values: string[] = ['required|email', 'min:18'];
    const builtValues = getMixedResult(values);
    expect(builtValues).to.deep.equal(values);
  });
});
