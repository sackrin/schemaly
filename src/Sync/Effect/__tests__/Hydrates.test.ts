import { expect } from 'chai';
import {
  COLLECTION,
  CONTAINER,
  Field,
  Fields,
  Blueprints,
  STRING,
} from '../../Blueprint';
import { Hydrates } from '../index';
import { SimpleValidator, ValidateAll } from '../../Validate';
import { SanitizeAll, SimpleSanitizer } from '../../Sanitize';
import { AllowPolicy, DenyPolicy, GrantOne } from '../../Policy';
import { Schema } from '../../Model';
import { Collision } from '../../Interact';

describe('Effect/Hydrates', () => {
  const fakeValues = {
    first_name: 'Thomas',
    last_name: 'Tank Engine',
    company: {
      name: 'Acme Company',
      address: '1 Engine Road',
    },
    emails: [
      {
        label: 'Home Email',
        address: 'example@home.com',
      },
      {
        label: 'Work Email',
        address: 'example@work.com',
      },
    ],
  };

  const getModel = (options: any = {}) =>
    Schema({
      machine: 'test',
      roles: ['user', 'admin', 'owner'],
      scope: ['r', 'w'],
      blueprints: Fields([]),
      ...options,
    });

  const getHydrates = ({
    blueprints,
    value,
    collide,
    options = {},
  }: {
    blueprints: Blueprints;
    value?: any;
    collide?: any;
    options?: any;
  }) => {
    const collider = Collision({
      model: getModel({ blueprints }),
      roles: ['user', 'admin'],
      scope: ['r', 'w'],
      ...collide,
    });
    return Hydrates({
      collider,
      blueprints,
      parent: collider,
      values: value ? value : fakeValues,
      options,
    });
  };

  it('can create an Hydrates group with standard arguments', () => {
    const fakeHydrates = getHydrates({
      blueprints: Fields([]),
      options: { test: true },
    });
    expect(fakeHydrates.options).to.deep.equal({ test: true });
  });

  it('can hydrate against a set of blueprints, provided values and generate effects', () => {
    const fakeHydrates = getHydrates({
      blueprints: Fields([
        Field({ context: STRING, machine: 'first_name', label: 'First Name' }),
        Field({ context: STRING, machine: 'last_name', label: 'Last Name' }),
        Field({
          context: CONTAINER,
          machine: 'company',
          label: 'Company',
          blueprints: Fields([
            Field({ context: STRING, machine: 'name', label: 'Company Name' }),
          ]),
        }),
        Field({
          context: COLLECTION,
          machine: 'emails',
          label: 'Emails',
          blueprints: Fields([
            Field({ context: STRING, machine: 'label', label: 'Label' }),
            Field({ context: STRING, machine: 'address', label: 'Address' }),
          ]),
        }),
      ]),
    });
    fakeHydrates.hydrate();
    expect(fakeHydrates.find({ machine: 'first_name' })).to.not.be.undefined;
    expect(fakeHydrates.find({ machine: 'last_name' })).to.not.be.undefined;
    expect(fakeHydrates.find({ machine: 'company' }).find({ machine: 'name' }))
      .to.not.be.undefined;
    expect(
      fakeHydrates.find({ machine: 'emails' }).find({ machine: 'address' })
    ).to.not.be.undefined;
    expect(
      fakeHydrates.find({ machine: 'emails' }).filter({ machine: 'address' })
    ).to.have.length(2);
  });

  it('can hydrate using default values', () => {
    const fakeHydrates = getHydrates({
      blueprints: Fields([
        Field({
          context: STRING,
          machine: 'first_name',
          label: 'First Name',
          defaultValue: 'Andrew',
        }),
        Field({
          context: STRING,
          machine: 'last_name',
          label: 'Last Name',
          defaultValue: 'Richards',
        }),
        Field({
          context: CONTAINER,
          machine: 'company',
          label: 'Company',
          blueprints: Fields([
            Field({ context: STRING, machine: 'name', label: 'Company Name' }),
          ]),
          defaultValue: {
            name: 'Acme Co',
          },
        }),
        Field({
          context: COLLECTION,
          machine: 'emails',
          label: 'Emails',
          blueprints: Fields([
            Field({ context: STRING, machine: 'label', label: 'Label' }),
            Field({ context: STRING, machine: 'address', label: 'Address' }),
          ]),
          defaultValue: () => [
            {
              label: 'Test Email',
              address: 'example@default.com',
            },
          ],
        }),
      ]),
      value: {},
    });
    fakeHydrates.hydrate();
    expect(fakeHydrates.find({ machine: 'first_name' })).to.not.be.undefined;
    expect(fakeHydrates.find({ machine: 'last_name' })).to.not.be.undefined;
    expect(fakeHydrates.find({ machine: 'company' }).find({ machine: 'name' }))
      .to.not.be.undefined;
    expect(
      fakeHydrates.find({ machine: 'emails' }).find({ machine: 'address' })
    ).to.not.be.undefined;
    expect(
      fakeHydrates.find({ machine: 'emails' }).filter({ machine: 'address' })
    ).to.have.length(1);
  });

  it('can not error when a child bearing blueprint has no children', () => {
    const fakeHydrates = getHydrates({
      blueprints: Fields([
        Field({ context: STRING, machine: 'first_name', label: 'First Name' }),
        Field({ context: STRING, machine: 'last_name', label: 'Last Name' }),
        Field({
          context: CONTAINER,
          machine: 'company',
          label: 'Company',
        }),
      ]),
    });
    fakeHydrates.hydrate();
    expect(fakeHydrates.find({ machine: 'first_name' })).to.not.be.undefined;
    expect(fakeHydrates.find({ machine: 'last_name' })).to.not.be.undefined;
    expect(fakeHydrates.find({ machine: 'company' })).to.not.be.undefined;
  });

  it('can not create effects for blueprints failing policy checks', () => {
    const fakeHydrates = getHydrates({
      blueprints: Fields([
        Field({
          context: STRING,
          machine: 'first_name',
          label: 'First Name',
          policies: GrantOne([
            DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
            AllowPolicy({ roles: ['user'], scope: ['r', 'w'] }),
          ]),
        }),
        Field({
          context: STRING,
          machine: 'last_name',
          label: 'Last Name',
          policies: GrantOne([
            DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
            AllowPolicy({ roles: ['owner'], scope: ['r', 'w'] }),
          ]),
        }),
        Field({
          context: CONTAINER,
          machine: 'company',
          label: 'Company',
          blueprints: Fields([
            Field({ context: STRING, machine: 'name', label: 'Company Name' }),
          ]),
          policies: GrantOne([
            DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
            AllowPolicy({ roles: ['owner'], scope: ['r', 'w'] }),
          ]),
        }),
        Field({
          context: COLLECTION,
          machine: 'emails',
          label: 'Emails',
          blueprints: Fields([
            Field({
              context: STRING,
              machine: 'label',
              label: 'Label',
              policies: GrantOne([
                DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
                AllowPolicy({ roles: ['user'], scope: ['r', 'w'] }),
              ]),
            }),
            Field({
              context: STRING,
              machine: 'address',
              label: 'Address',
              policies: GrantOne([
                DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
                AllowPolicy({ roles: ['owner'], scope: ['r', 'w'] }),
              ]),
            }),
          ]),
          policies: GrantOne([
            DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
            AllowPolicy({ roles: ['user'], scope: ['r', 'w'] }),
          ]),
        }),
      ]),
    });
    fakeHydrates.hydrate();
    expect(fakeHydrates.find({ machine: 'first_name' })).to.not.be.undefined;
    expect(fakeHydrates.find({ machine: 'last_name' })).to.be.undefined;
    expect(fakeHydrates.find({ machine: 'company' })).to.be.undefined;
    expect(fakeHydrates.find({ machine: 'emails' })).to.not.be.undefined;
    expect(
      fakeHydrates.find({ machine: 'emails' }).filter({ machine: 'label' })
    ).to.have.length(2);
    expect(
      fakeHydrates.find({ machine: 'emails' }).filter({ machine: 'address' })
    ).to.have.length(0);
    expect(fakeHydrates.effects).to.have.length(2);
  });

  it('can perform sanitization against hydrated effects', () => {
    const fakeHydrates = getHydrates({
      blueprints: Fields([
        Field({
          context: STRING,
          machine: 'first_name',
          label: 'First Name',
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ['trim'] }),
            SimpleSanitizer({ filters: ['upper_case'] }),
          ]),
        }),
        Field({
          context: STRING,
          machine: 'last_name',
          label: 'Last Name',
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ['trim'] }),
            SimpleSanitizer({ filters: ['upper_case'] }),
          ]),
        }),
        Field({
          context: CONTAINER,
          machine: 'company',
          label: 'Company',
          blueprints: Fields([
            Field({
              context: STRING,
              machine: 'name',
              label: 'Company Name',
              sanitizers: SanitizeAll([
                SimpleSanitizer({ filters: ['trim'] }),
                SimpleSanitizer({ filters: ['upper_case'] }),
              ]),
            }),
          ]),
        }),
        Field({
          context: COLLECTION,
          machine: 'emails',
          label: 'Emails',
          blueprints: Fields([
            Field({
              context: STRING,
              machine: 'label',
              label: 'Label',
              sanitizers: SanitizeAll([
                SimpleSanitizer({ filters: ['trim'] }),
                SimpleSanitizer({ filters: ['upper_case'] }),
              ]),
            }),
            Field({
              context: STRING,
              machine: 'address',
              label: 'Address',
              sanitizers: SanitizeAll([
                SimpleSanitizer({ filters: ['trim'] }),
                SimpleSanitizer({ filters: ['upper_case'] }),
              ]),
            }),
          ]),
        }),
      ]),
    });
    fakeHydrates.hydrate();
    fakeHydrates.sanitize();
    const dumped = fakeHydrates.dump();
    expect(dumped).to.deep.equal({
      first_name: 'THOMAS',
      last_name: 'TANK ENGINE',
      company: {
        name: 'ACME COMPANY',
      },
      emails: [
        {
          label: 'HOME EMAIL',
          address: 'EXAMPLE@HOME.COM',
        },
        {
          label: 'WORK EMAIL',
          address: 'EXAMPLE@WORK.COM',
        },
      ],
    });
  });

  it('can perform validation against hydrated effects and PASS', () => {
    const fakeHydrates = getHydrates({
      blueprints: Fields([
        Field({
          context: STRING,
          machine: 'first_name',
          label: 'First Name',
          validators: ValidateAll([
            SimpleValidator({ rules: ['required', 'min:5'] }),
          ]),
        }),
        Field({
          context: STRING,
          machine: 'last_name',
          label: 'Last Name',
          validators: ValidateAll([
            SimpleValidator({ rules: ['required', 'min:5'] }),
          ]),
        }),
        Field({
          context: CONTAINER,
          machine: 'company',
          label: 'Company',
          blueprints: Fields([
            Field({
              context: STRING,
              machine: 'name',
              label: 'Company Name',
              validators: ValidateAll([
                SimpleValidator({ rules: ['required', 'min:5'] }),
              ]),
            }),
          ]),
        }),
        Field({
          context: COLLECTION,
          machine: 'emails',
          label: 'Emails',
          blueprints: Fields([
            Field({
              context: STRING,
              machine: 'label',
              label: 'Label',
              validators: ValidateAll([
                SimpleValidator({ rules: ['required', 'min:5'] }),
              ]),
            }),
            Field({
              context: STRING,
              machine: 'address',
              label: 'Address',
              validators: ValidateAll([
                SimpleValidator({ rules: ['required', 'min:5'] }),
              ]),
            }),
          ]),
        }),
      ]),
    });
    fakeHydrates.hydrate();
    const result = fakeHydrates.validate();
    expect(result.first_name.valid).to.equal(true);
    expect(result.last_name.valid).to.equal(true);
    expect(result.company.valid).to.equal(true);
    expect(result.company.children[0].name.valid).to.equal(true);
    expect(result.emails.valid).to.equal(true);
    expect(result.emails.children[0].label.valid).to.equal(true);
    expect(result.emails.children[0].address.valid).to.equal(true);
    expect(result.emails.children[1].label.valid).to.equal(true);
    expect(result.emails.children[1].address.valid).to.equal(true);
  });

  it('can perform validation against hydrated effects and FAIL', () => {
    const fakeHydrates = getHydrates({
      blueprints: Fields([
        Field({
          context: STRING,
          machine: 'first_name',
          label: 'First Name',
          validators: ValidateAll([
            SimpleValidator({ rules: ['required', 'min:5'] }),
          ]),
        }),
        Field({
          context: STRING,
          machine: 'last_name',
          label: 'Last Name',
          validators: ValidateAll([
            SimpleValidator({ rules: ['required', 'min:5'] }),
          ]),
        }),
        Field({
          context: CONTAINER,
          machine: 'company',
          label: 'Company',
          blueprints: Fields([
            Field({
              context: STRING,
              machine: 'name',
              label: 'Company Name',
              validators: ValidateAll([
                SimpleValidator({ rules: ['required', 'min:25'] }),
              ]),
            }),
          ]),
        }),
        Field({
          context: COLLECTION,
          machine: 'emails',
          label: 'Emails',
          blueprints: Fields([
            Field({
              context: STRING,
              machine: 'label',
              label: 'Label',
              validators: ValidateAll([
                SimpleValidator({ rules: ['required', 'min:5'] }),
              ]),
            }),
            Field({
              context: STRING,
              machine: 'address',
              label: 'Address',
              validators: ValidateAll([
                SimpleValidator({ rules: ['required', 'min:25'] }),
              ]),
            }),
          ]),
        }),
      ]),
    });
    fakeHydrates.hydrate();
    const result = fakeHydrates.validate();
    expect(result.first_name.valid).to.equal(true);
    expect(result.last_name.valid).to.equal(true);
    expect(result.company.valid).to.equal(false);
    expect(result.company.children[0].name.valid).to.equal(false);
    expect(result.emails.valid).to.equal(false);
    expect(result.emails.children[0].label.valid).to.equal(true);
    expect(result.emails.children[0].address.valid).to.equal(false);
    expect(result.emails.children[1].label.valid).to.equal(true);
    expect(result.emails.children[1].address.valid).to.equal(false);
  });

  it('can generate a value object with policies', () => {
    const fakeHydrates = getHydrates({
      blueprints: Fields([
        Field({
          context: STRING,
          machine: 'first_name',
          label: 'First Name',
        }),
        Field({
          context: STRING,
          machine: 'last_name',
          label: 'Last Name',
        }),
        Field({
          context: CONTAINER,
          machine: 'company',
          label: 'Company',
          blueprints: Fields([
            Field({
              context: STRING,
              machine: 'name',
              label: 'Company Name',
            }),
          ]),
        }),
        Field({
          context: COLLECTION,
          machine: 'emails',
          label: 'Emails',
          blueprints: Fields([
            Field({
              context: STRING,
              machine: 'label',
              label: 'Label',
            }),
            Field({
              context: STRING,
              machine: 'address',
              label: 'Address',
            }),
          ]),
        }),
      ]),
    });
    fakeHydrates.hydrate();
    const dumped = fakeHydrates.dump();
    expect(dumped).to.deep.equal({
      first_name: 'Thomas',
      last_name: 'Tank Engine',
      company: {
        name: 'Acme Company',
      },
      emails: [
        {
          label: 'Home Email',
          address: 'example@home.com',
        },
        {
          label: 'Work Email',
          address: 'example@work.com',
        },
      ],
    });
  });
});
