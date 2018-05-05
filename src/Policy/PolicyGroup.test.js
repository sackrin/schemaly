import assert from 'assert';
import { PolicyGroup } from './PolicyGroup';
import { Allow } from './Allow';
import { Deny } from './Deny';
import { Isotope } from '../';

describe('Policy Group', function () {
  const isotope = new Isotope();

  const simplePolicies = [
    new Deny(['member'], ['read', 'write']),
    new Allow(['user', 'admin'], ['read', 'write'])
  ];

  const complexPolicies = [
    new Deny([() => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['*']);
    }))], [() => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['*']);
    }))]),
    new Allow(['member', () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user', 'admin']);
    }))], ['read', 'write', () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write']);
    }))])
  ];

  it('can be created and have policies added to it', () => {
    const policyGroup = new PolicyGroup(simplePolicies);
    assert.deepEqual(policyGroup.policies, simplePolicies);
  });

  it('perform a pass grant test with no policies', () => {
    const policyGroup = new PolicyGroup([]);
    return policyGroup.grant(isotope, ['user'], ['write'])
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error('Was not supposed to fail'); });
  });

  it('perform a simple pass grant', () => {
    const policyGroup = new PolicyGroup(simplePolicies);
    return policyGroup.grant(isotope, ['user'], ['write'])
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error('Was not supposed to fail'); });
  });

  it('perform a mixed pass grant', () => {
    const policyGroup = new PolicyGroup(complexPolicies);
    return policyGroup.grant(isotope, ['user'], ['write'])
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error('Was not supposed to fail'); });
  });

  it('perform a simple denied grant', () => {
    const policyGroup = new PolicyGroup(simplePolicies);
    return policyGroup.grant(isotope, ['member'], ['write'])
      .then(result => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error('Was not supposed to pass'); });
  });

  it('perform a mixed denied grant', () => {
    const policyGroup = new PolicyGroup(complexPolicies);
    return policyGroup.grant(isotope, ['guest'], ['write'])
      .then(result => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error('Was not supposed to fail'); });
  });
});
