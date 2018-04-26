import assert from 'assert'
import { Allow } from './Allow'

describe('Allow Policy', function () {
  it('can have simple roles and scope added', () => {
    const allowRule = new Allow(['user', 'admin'], ['read', 'write'])
    assert.deepEqual(allowRule.roles, ['user', 'admin'])
    assert.deepEqual(allowRule.scope, ['read', 'write'])
  })

  it('can have promise roles and scope added', () => {
    const rolesPromise = new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user', 'admin'])
    })
    const scopePromise = new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write'])
    })
    const allowRule = new Allow([rolesPromise], [scopePromise])
    assert.deepEqual(allowRule.roles, [rolesPromise])
    assert.deepEqual(allowRule.scope, [scopePromise])
  })

  it('retrieve a list of roles with both static and promise roles', () => {
    const rolesPromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user', 'admin'])
    }))
    const scopePromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write'])
    }))
    const allowRule = new Allow([rolesPromise, 'handler'], [scopePromise, 'blocked'])
    return allowRule.getRoles()
      .then(roles => {
        assert.deepEqual(roles, ['user', 'admin', 'handler'])
      })
      .then(allowRule.getScope)
      .then(scope => {
        assert.deepEqual(scope, ['read', 'write', 'blocked'])
      })
      .catch((msg) => { throw new Error('Was not supposed to fail') })
  })

  it('can perform a grant request and return a pass', () => {
    const rolesPromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user', 'admin'])
    }))
    const scopePromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write'])
    }))

    const allowRule = new Allow(['user', 'admin'], ['read', 'write'])
    return allowRule.grant(['user', rolesPromise], ['read', scopePromise])
      .then((result) => {
        assert.equal(result, true)
      })
      .catch((msg) => { throw new Error('Was not supposed to fail') })
  })
})
