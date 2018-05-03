import assert from 'assert'
import {PolicyGroup} from './PolicyGroup'
import {Allow} from './Allow'
import {Deny} from './Deny'
import {Isotope} from '../'

describe('Policy Group', function () {
  const isotope = new Isotope()

  const policies = [
    new Allow(['user', 'admin'], ['read', 'write']),
    new Deny(['user', 'admin'], ['read', 'write'])
  ]

  it('can be created and have policies added to it', () => {
    const policyGroup = new PolicyGroup(policies)
    assert.deepEqual(policyGroup.policies, policies)
  })

  it('perform a simple pass grant', () => {
    const policyGroup = new PolicyGroup(policies)
    policyGroup.grant(isotope, ['user'], ['write'])
      .then(result => {
        assert.equal(result, true)
      })
  })
})
