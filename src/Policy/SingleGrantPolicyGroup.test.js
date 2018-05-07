import assert from 'assert';
import { SingleGrantPolicyGroup } from './SingleGrantPolicyGroup';
import { Allow } from './Allow';
import { Deny } from './Deny';
import { Isotope } from '../';

describe('Single Grant Policy Group', function () {
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
    const policyGroup = new SingleGrantPolicyGroup(simplePolicies);
    assert.deepEqual(policyGroup.policies, simplePolicies);
  });

  it('perform a pass grant test with no policies', () => {
    const policyGroup = new SingleGrantPolicyGroup([]);
    return policyGroup.grant(isotope, ['user'], ['write'])
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a simple pass grant', () => {
    const policyGroup = new SingleGrantPolicyGroup(simplePolicies);
    return policyGroup.grant(isotope, ['user'], ['write'])
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a mixed pass grant', () => {
    const policyGroup = new SingleGrantPolicyGroup(complexPolicies);
    return policyGroup.grant(isotope, ['user'], ['write'])
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a simple denied grant', () => {
    const policyGroup = new SingleGrantPolicyGroup(simplePolicies);
    return policyGroup.grant(isotope, ['member'], ['write'])
      .then(result => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a mixed denied grant', () => {
    const policyGroup = new SingleGrantPolicyGroup(complexPolicies);
    return policyGroup.grant(isotope, ['guest'], ['write'])
      .then(result => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });
});
