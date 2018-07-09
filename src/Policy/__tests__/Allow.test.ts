import { expect } from 'chai';
import Allow from '../Allow';

describe('Policy/Allow', function(): void {
  it('can have simple roles and scope added', () => {
    const allowRule = Allow({ roles: ['user', 'admin'], scope: ['read', 'write'], options: { test: true } });
    expect(allowRule.roles).to.deep.equal(['user', 'admin']);
    expect(allowRule.scope).to.deep.equal(['read', 'write']);
    expect(allowRule.options).to.deep.equal({ test: true });
  });
});
