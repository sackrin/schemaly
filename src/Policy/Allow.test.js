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

  it('can perform a simple grant request and pass', () => {
    const allowRule = new Allow(['user'], ['read'])
    return allowRule.grant(['user'], ['read'])
      .then((result) => {
        assert.equal(result, true)
      })
      .catch((msg) => { throw new Error('Was not supposed to fail') })
  })

  it('can perform a simple grant request and fail for mismatch role', () => {
    const allowRule = new Allow(['user'], ['read'])
    return allowRule.grant(['admin'], ['read'])
      .then((result) => {
        assert.equal(result, false)
      })
      .catch((msg) => { throw new Error('Was not supposed to fail') })
  })

  it('can perform a simple grant request and fail for mismatch scope', () => {
    const allowRule = new Allow(['user'], ['read'])
    return allowRule.grant(['user'], ['write'])
      .then((result) => {
        assert.equal(result, false)
      })
      .catch((msg) => { throw new Error('Was not supposed to fail') })
  })

  it('can perform a grant request with valid and invalid scope/roles and pass', () => {
    const allowRule = new Allow(['user'], ['read'])
    return allowRule.grant(['user', 'admin'], ['read', 'write'])
      .then((result) => {
        assert.equal(result, true)
      })
      .catch((msg) => { throw new Error('Was not supposed to fail') })
  })

  it('can perform a grant with wildcard scope and role rules', () => {
    const allowRule = new Allow(['*'], ['*'])
    return allowRule.grant(['user'], ['read'])
      .then((result) => {
        assert.equal(result, true)
      })
      .catch((msg) => { throw new Error('Was not supposed to fail') })
  })

  it('can perform a grant request with promise and simple scope/rules', () => {
    const rolesPromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user'])
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
