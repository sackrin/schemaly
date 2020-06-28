import { expect } from 'chai';
import { Collision } from '../../Interact';
import {
  COLLECTION,
  CONTAINER,
  Field,
  Fields,
  Poly,
  Blueprint,
  STRING,
} from '../../Blueprint';
import { AllowPolicy, DenyPolicy, GrantOne } from '../../Policy';
import { SanitizeAll, SimpleSanitizer } from '../../Sanitize';
import { SimpleValidator, ValidateAll } from '../../Validate';
import { Effect } from '../Types';
import { Hydrate } from '../index';
import { Schema } from '../../Model';

describe('Effect/Hydrate', (): void => {
  const getModel = (options: any = {}) =>
    Schema({
      machine: 'test',
      roles: ['user', 'admin'],
      scope: ['read', 'write'],
      blueprints: Fields([]),
      ...options,
    });

  const getHydrate = ({
    collide,
    blueprint,
    value,
    options = {},
  }: {
    collide: any;
    blueprint: Blueprint;
    value: any;
    options?: any;
  }) =>
    Hydrate({
      collider: Collision({
        model: getModel({
          blueprints: Fields([blueprint]),
        }),
        ...collide,
      }),
      blueprint,
      value,
      options,
    });

  const mockSingleParams = {
    collide: {
      scope: ['read'],
      roles: ['user'],
    },
    blueprint: Field({
      context: STRING,
      machine: 'first_name',
      label: 'First Name',
      description: 'The first name of a user',
      tags: ['person', 'profile', 'name'],
      policies: GrantOne([
        DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
        AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] }),
      ]),
      sanitizers: SanitizeAll([
        SimpleSanitizer({ filters: ['trim'] }),
        SimpleSanitizer({ filters: ['upper_case'] }),
      ]),
      validators: ValidateAll([
        SimpleValidator({ rules: ['required'] }),
        SimpleValidator({ rules: ['min:5'] }),
      ]),
      setters: [
        ({ effect, value }: { effect: Effect; value: any }) =>
          value.toString().toUpperCase(),
      ],
      getters: [
        ({ effect, value }: { effect: Effect; value: any }) =>
          value.toString().toUpperCase(),
      ],
    }),
    value: 'johnny',
  };

  const mockGroupParams = {
    collide: {
      scope: ['read'],
      roles: ['user'],
    },
    blueprint: Field({
      context: CONTAINER,
      machine: 'profile',
      label: 'Profile',
      policies: GrantOne([
        DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
        AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] }),
      ]),
      blueprints: Fields([
        Field({
          context: STRING,
          machine: 'first_name',
          label: 'First Name',
          policies: GrantOne([
            DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
            AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] }),
          ]),
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ['trim'] }),
            SimpleSanitizer({ filters: ['upper_case'] }),
          ]),
          validators: ValidateAll([
            SimpleValidator({ rules: ['required'] }),
            SimpleValidator({ rules: ['min:3'] }),
          ]),
        }),
        Field({
          context: STRING,
          machine: 'surname',
          label: 'Surname',
          policies: GrantOne([
            DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
            AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] }),
          ]),
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ['trim'] }),
            SimpleSanitizer({ filters: ['upper_case'] }),
          ]),
          validators: ValidateAll([
            SimpleValidator({ rules: ['required'] }),
            SimpleValidator({ rules: ['min:3'] }),
          ]),
        }),
        Field({
          context: STRING,
          machine: 'secret',
          label: 'Admin Notes',
          policies: GrantOne([
            DenyPolicy({ roles: ['*'], scope: ['*'] }),
            AllowPolicy({ roles: ['admin'], scope: ['*'] }),
          ]),
        }),
      ]),
    }),
    value: {
      first_name: 'Toby',
      surname: 'Smith',
      secret: 'notseethis',
    },
  };

  const mockCollectParams = {
    collide: {
      scope: ['read'],
      roles: ['user'],
    },
    blueprint: Field({
      context: COLLECTION,
      machine: 'emails',
      label: 'Emails',
      policies: GrantOne([
        DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
        AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] }),
      ]),
      blueprints: Fields([
        Field({
          context: STRING,
          machine: 'label',
          label: 'Label',
          policies: GrantOne([
            DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
            AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] }),
          ]),
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ['trim'] }),
            SimpleSanitizer({ filters: ['upper_case'] }),
          ]),
          validators: ValidateAll([
            SimpleValidator({ rules: ['required'] }),
            SimpleValidator({ rules: ['min:5'] }),
          ]),
        }),
        Field({
          context: STRING,
          machine: 'address',
          label: 'Address',
          policies: GrantOne([
            DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
            AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] }),
          ]),
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ['trim'] }),
            SimpleSanitizer({ filters: ['upper_case'] }),
          ]),
          validators: ValidateAll([
            SimpleValidator({ rules: ['required'] }),
            SimpleValidator({ rules: ['min:5'] }),
          ]),
        }),
        Field({
          context: STRING,
          machine: 'secret',
          label: 'Admin Notes',
          policies: GrantOne([
            DenyPolicy({ roles: ['*'], scope: ['*'] }),
            AllowPolicy({ roles: ['admin'], scope: ['*'] }),
          ]),
        }),
      ]),
    }),
    value: [
      {
        label: 'Home Address',
        address: 'test1@example.com',
        secret: 'notseethis',
      },
      {
        label: 'Home Address',
        address: 'test1@example.com',
        secret: 'notseethis',
      },
    ],
  };

  const mockPolyParams = {
    collide: {
      scope: ['read'],
      roles: ['user'],
    },
    blueprint: Field({
      context: COLLECTION,
      machine: 'emails',
      label: 'Emails',
      policies: GrantOne([
        DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
        AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] }),
      ]),
      blueprints: Poly()
        .type({
          machine: 'email',
          blueprints: Fields([
            Field({
              machine: 'label',
              context: STRING,
              label: 'Email Label',
            }),
            Field({
              machine: 'address',
              context: STRING,
              label: 'Email Address',
            }),
          ]),
          matchers: [['address']],
        })
        .type({
          machine: 'physical',
          blueprints: Fields([
            Field({
              machine: 'label',
              context: STRING,
              label: 'Location Label',
            }),
            Field({
              machine: 'street',
              context: STRING,
              label: 'Location Street',
            }),
            Field({
              machine: 'suburb',
              context: STRING,
              label: 'Location Suburb',
            }),
            Field({
              machine: 'country',
              context: STRING,
              label: 'Location Country',
            }),
          ]),
          matchers: [['street']],
        }),
    }),
    value: [
      {
        label: 'Home Address',
        address: 'test1@example.com',
      },
      {
        label: 'Street Address',
        street: '18 Example Street',
        suburb: 'Exampleville',
        country: 'Example-a-stan',
      },
    ],
  };

  it('can create an effect instance from a blueprint', () => {
    const effect = getHydrate({
      ...mockSingleParams,
      options: { testing: true },
    });
    expect(effect.machine).to.equal('first_name');
    expect(effect.context).to.equal(STRING);
    expect(effect.description).to.equal('The first name of a user');
    expect(effect.tags).to.deep.equal(['person', 'profile', 'name']);
    expect(effect.blueprint).to.deep.equal(mockSingleParams.blueprint);
    expect(effect.value).to.equal('johnny');
    expect(effect.options).to.deep.equal({ testing: true });
  });

  it('can use getters to retrieve a correctly formatted blueprint value', () => {
    const fakeEffect = getHydrate({ ...mockSingleParams });
    const value = fakeEffect.getValue();
    expect(fakeEffect.value).to.equal('johnny');
    expect(value).to.equal('JOHNNY');
  });

  it('can create an effect with no value setters', () => {
    const fakeEffect = getHydrate({ ...mockSingleParams });
    const value = fakeEffect.setValue({ value: 'richard' });
    expect(value).to.equal('RICHARD');
    expect(fakeEffect.value).to.equal('RICHARD');
  });

  it('can hydrate an effect against a single value set', () => {
    const fakeEffect = getHydrate({ ...mockSingleParams });
    fakeEffect.hydrate();
    expect(fakeEffect.value).to.equal('johnny');
  });

  it('can hydrate an effect against a container set', () => {
    const fakeEffect = getHydrate({ ...mockGroupParams });
    fakeEffect.hydrate();
    expect(fakeEffect.find({ machine: 'secret' })).to.be.undefined;
    expect(fakeEffect.find({ machine: 'first_name' })).to.have.property(
      'value',
      'TOBY'
    );
    expect(fakeEffect.find({ machine: 'surname' })).to.have.property(
      'value',
      'SMITH'
    );
  });

  it('can hydrate an effect against a repeater set', () => {
    const fakeEffect = getHydrate({ ...mockCollectParams });
    fakeEffect.hydrate();
    expect(fakeEffect.filter({ machine: 'label' })).to.have.length(2);
    expect(fakeEffect.filter({ machine: 'address' })).to.have.length(2);
    expect(fakeEffect.filter({ machine: 'secret' })).to.have.length(0);
  });

  it('can use the find method on a container', () => {
    const fakeEffect = getHydrate({ ...mockGroupParams });
    fakeEffect.hydrate();
    expect(fakeEffect.find({ machine: 'first_name' })).to.not.be.undefined;
    expect(fakeEffect.find({ machine: 'first_name' })).to.have.property(
      'value',
      'TOBY'
    );
    expect(fakeEffect.find({ machine: 'surname' })).to.not.be.undefined;
    expect(fakeEffect.find({ machine: 'surname' })).to.have.property(
      'value',
      'SMITH'
    );
    expect(fakeEffect.find({ machine: 'secret' })).to.be.undefined;
    expect(fakeEffect.find({ machine: 'notexists' })).to.be.undefined;
  });

  it('can use the find method on a repeater', () => {
    const fakeEffect = getHydrate({ ...mockCollectParams });
    fakeEffect.hydrate();
    expect(fakeEffect.find({ machine: 'label' })).to.not.be.undefined;
    expect(fakeEffect.find({ machine: 'label' })).to.have.property(
      'value',
      'HOME ADDRESS'
    );
    expect(fakeEffect.find({ machine: 'address' })).to.not.be.undefined;
    expect(fakeEffect.find({ machine: 'address' })).to.have.property(
      'value',
      'TEST1@EXAMPLE.COM'
    );
    expect(fakeEffect.find({ machine: 'secret' })).to.be.undefined;
    expect(fakeEffect.find({ machine: 'notexists' })).to.be.undefined;
  });

  it('can use the filter method on a container', () => {
    const fakeEffect = getHydrate({ ...mockGroupParams });
    fakeEffect.hydrate();
    expect(fakeEffect.filter({ machine: 'first_name' })).to.have.length(1);
    expect(fakeEffect.filter({ machine: 'first_name' })[0]).to.have.property(
      'value',
      'TOBY'
    );
    expect(fakeEffect.filter({ machine: 'surname' })).to.have.length(1);
    expect(fakeEffect.filter({ machine: 'surname' })[0]).to.have.property(
      'value',
      'SMITH'
    );
    expect(fakeEffect.filter({ machine: 'secret' })).to.have.length(0);
    expect(fakeEffect.filter({ machine: 'notexists' })).to.have.length(0);
  });

  it('can use the filter method on a collection', () => {
    const fakeEffect = getHydrate({ ...mockCollectParams });
    fakeEffect.hydrate();
    expect(fakeEffect.filter({ machine: 'label' })).to.have.length(2);
    expect(fakeEffect.filter({ machine: 'label' })[0]).to.have.property(
      'value',
      'HOME ADDRESS'
    );
    expect(fakeEffect.filter({ machine: 'address' })).to.have.length(2);
    expect(fakeEffect.filter({ machine: 'address' })[0]).to.have.property(
      'value',
      'TEST1@EXAMPLE.COM'
    );
    expect(fakeEffect.filter({ machine: 'secret' })).to.have.length(0);
    expect(fakeEffect.filter({ machine: 'notexists' })).to.have.length(0);
  });

  it('can sanitize a simple effect', () => {
    const fakeEffect = getHydrate({
      ...mockSingleParams,
      value: '  johNSton ',
    });
    fakeEffect.hydrate();
    expect(fakeEffect.value, 'JOHNSTON');
  });

  it('can sanitize a container effect', () => {
    const fakeEffect = getHydrate({
      ...mockGroupParams,
      value: {
        first_name: '  JessIca ',
        surname: ' Smitherson ',
      },
    });
    fakeEffect.hydrate();
    expect(fakeEffect.find({ machine: 'first_name' })).to.have.property(
      'value',
      'JESSICA'
    );
    expect(fakeEffect.find({ machine: 'surname' })).to.have.property(
      'value',
      'SMITHERSON'
    );
  });

  it('can sanitize a repeater effect', () => {
    const fakeEffect = getHydrate({
      ...mockCollectParams,
      value: [
        {
          label: 'Home Address',
          address: 'bill@example.com  ',
        },
        {
          label: ' Work Address   ',
          address: '  john@example.com',
        },
      ],
    });
    fakeEffect.hydrate();
    expect(fakeEffect.filter({ machine: 'label' })[0]).to.have.property(
      'value',
      'HOME ADDRESS'
    );
    expect(fakeEffect.filter({ machine: 'address' })[0]).to.have.property(
      'value',
      'BILL@EXAMPLE.COM'
    );
    expect(fakeEffect.filter({ machine: 'label' })[1]).to.have.property(
      'value',
      'WORK ADDRESS'
    );
    expect(fakeEffect.filter({ machine: 'address' })[1]).to.have.property(
      'value',
      'JOHN@EXAMPLE.COM'
    );
  });

  it('can validate against a simple and PASS', () => {
    const fakeEffect = getHydrate({ ...mockSingleParams });
    fakeEffect.hydrate();
    const { valid, messages, children } = fakeEffect.validate();
    expect(valid).to.equal(true);
    expect(messages).to.deep.equal([]);
    expect(children).to.deep.equal([]);
  });

  it('can validate against a simple and FAIL', () => {
    const fakeEffect = getHydrate({
      ...mockSingleParams,
      value: 'bill',
    });
    fakeEffect.hydrate();
    const { valid, messages, children } = fakeEffect.validate();
    expect(valid).to.equal(false);
    expect(messages).to.deep.equal([
      'The value must be at least 5 characters.',
    ]);
    expect(children).to.deep.equal([]);
  });

  it('can validate against a container and PASS', () => {
    const fakeEffect = getHydrate({ ...mockGroupParams });
    fakeEffect.hydrate();
    const { valid, messages, children } = fakeEffect.validate();
    expect(valid).to.equal(true);
    expect(messages).to.have.length(0);
    expect(children).to.have.length(1);
    expect(children[0].first_name).to.have.property('valid', true);
    expect(children[0].surname).to.have.property('valid', true);
  });

  it('can validate against a container and FAIL', () => {
    const fakeEffect = getHydrate({
      ...mockGroupParams,
      value: {
        first_name: 'Yi',
        surname: 'Gi',
        secret: 'notseethis',
      },
    });
    fakeEffect.hydrate();
    const { valid, messages, children } = fakeEffect.validate();
    expect(valid).to.equal(false);
    expect(messages).to.have.length(0);
    expect(children).to.have.length(1);
    expect(children[0].first_name.valid).to.equal(false);
    expect(children[0].first_name.messages).to.have.length(1);
    expect(children[0].surname.valid).to.equal(false);
    expect(children[0].surname.messages).to.have.length(1);
  });

  it('can validate against a repeater and PASS', () => {
    const fakeEffect = getHydrate({ ...mockCollectParams });
    fakeEffect.hydrate();
    const { valid, messages, children } = fakeEffect.validate();
    expect(valid).to.equal(true);
    expect(messages).to.have.length(0);
    expect(children).to.have.length(2);
    expect(children[0].address.valid).to.equal(true);
    expect(children[0].label.valid).to.equal(true);
  });

  it('can validate against a repeater value and FAIL', () => {
    const fakeEffect = getHydrate({
      ...mockCollectParams,
      value: [
        {
          label: 'Fail',
          address: 'Fail',
          secret: 'notseethis',
        },
        {
          label: 'Fail',
          address: 'Fail',
          secret: 'notseethis',
        },
      ],
    });
    fakeEffect.hydrate();
    const { valid, messages, children } = fakeEffect.validate();
    expect(valid).to.equal(false);
    expect(messages).to.have.length(0);
    expect(children).to.have.length(2);
    expect(children[0].address.valid).to.equal(false);
    expect(children[0].address.messages).to.have.length(1);
    expect(children[0].label.valid).to.equal(false);
    expect(children[0].label.messages).to.have.length(1);
  });

  it('can generate a simple values object', () => {
    const fakeEffect = getHydrate({ ...mockSingleParams });
    fakeEffect.hydrate();
    const dumped = fakeEffect.dump();
    expect(dumped).to.equal('JOHNNY');
  });

  it('can generate a container values object', () => {
    const fakeEffect = getHydrate({ ...mockGroupParams });
    fakeEffect.hydrate();
    const dumped = fakeEffect.dump();
    expect(dumped).to.deep.equal({
      first_name: 'TOBY',
      surname: 'SMITH',
    });
  });

  it('can generate a collection values object', () => {
    const fakeEffect = getHydrate({ ...mockCollectParams });
    fakeEffect.hydrate();
    const dumped = fakeEffect.dump();
    expect(dumped).to.deep.equal([
      {
        label: 'HOME ADDRESS',
        address: 'TEST1@EXAMPLE.COM',
      },
      {
        label: 'HOME ADDRESS',
        address: 'TEST1@EXAMPLE.COM',
      },
    ]);
  });

  it('can hydrate an effect using polymorphic fields', () => {
    const fakeEffect = getHydrate({ ...mockPolyParams });
    fakeEffect.hydrate();
    expect(fakeEffect.filter({ machine: 'address' })).to.have.length(1);
    expect(fakeEffect.filter({ machine: 'street' })).to.have.length(1);
    const dumped = fakeEffect.dump();
    expect(dumped).to.deep.equal([
      {
        label: 'Home Address',
        address: 'test1@example.com',
      },
      {
        label: 'Street Address',
        street: '18 Example Street',
        suburb: 'Exampleville',
        country: 'Example-a-stan',
      },
    ]);
  });
});
