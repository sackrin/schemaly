import { expect } from 'chai';
import { Schema } from '../../../Model';
import {
  BOOLEAN,
  COLLECTION,
  CONTAINER,
  Field,
  Fields,
  STRING,
} from '../../../Blueprint';
import getFlattenedValidated from '../getFlattenedValidated';
import { SimpleValidator, ValidateAll } from '../../index';
import { Collision } from '../../../Interact';

describe('Effect/Helpers/getFlattenedEffects', () => {
  const fakeData = {
    _id: '29c2818c-7d7b-11e8-adc0-fa7ae01bbebc',
    title: 'mr',
    first_name: 'john',
    surname: 'smith',
    dob: '16/01/91',
    company: {
      name: 'Acme Company',
      address: '1 Engine Road',
    },
    emails: [
      {
        _id: '29c99123-7d7b-11e8-adc0-fa7ae01bbebc',
        primary: true,
        address: 'default@example.com',
      },
      {
        _id: '29c28402-7d7b-11e8-adc0-fa7ae01bbebc',
        primary: false,
        address: 'john.smith@example.com',
      },
      {
        _id: '29c2854c-7d7b-11e8-adc0-fa7ae01bbebc',
        primary: false,
        address: 'john.smith@hotmail.com',
      },
    ],
  };

  const fakeSchema = Schema({
    machine: 'user',
    label: 'User',
    scope: ['read', 'write'],
    roles: ['owner', 'user', 'guest', 'admin'],
    blueprints: Fields([
      Field({
        context: STRING,
        machine: '_id',
        label: 'ID',
        validators: ValidateAll([SimpleValidator({ rules: ['required'] })]),
      }),
      Field({
        context: STRING,
        machine: 'title',
        label: 'Title',
        validators: ValidateAll([SimpleValidator({ rules: ['required'] })]),
      }),
      Field({
        context: STRING,
        machine: 'first_name',
        label: 'First Name',
        validators: ValidateAll([SimpleValidator({ rules: ['required'] })]),
      }),
      Field({
        context: STRING,
        machine: 'surname',
        label: 'Surname',
        validators: ValidateAll([SimpleValidator({ rules: ['required'] })]),
      }),
      Field({
        context: STRING,
        machine: 'dob',
        label: 'Date Of Birth',
        validators: ValidateAll([SimpleValidator({ rules: ['required'] })]),
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
            validators: ValidateAll([SimpleValidator({ rules: ['required'] })]),
          }),
          Field({
            context: STRING,
            machine: 'address',
            label: 'Company Address',
            validators: ValidateAll([SimpleValidator({ rules: ['required'] })]),
          }),
        ]),
        defaultValue: {
          name: 'Acme Co',
        },
      }),
      Field({
        context: COLLECTION,
        machine: 'emails',
        blueprints: Fields([
          Field({
            context: STRING,
            machine: '_id',
            label: 'ID',
            validators: ValidateAll([SimpleValidator({ rules: ['required'] })]),
          }),
          Field({
            context: BOOLEAN,
            machine: 'primary',
            label: 'Primary',
          }),
          Field({
            context: STRING,
            machine: 'address',
            label: 'Address',
            validators: ValidateAll([SimpleValidator({ rules: ['required'] })]),
          }),
        ]),
      }),
    ]),
  });

  it('can flatten a simple set of fields validations', async () => {
    const collider = Collision({
      model: fakeSchema,
      roles: ['user', 'admin'],
      scope: ['r', 'w'],
    });
    const fakeCollided = await collider
      .with({
        emails: [{}],
      })
      .collide();
    const fakeValidated = await fakeCollided.validate({});
    if (fakeValidated.results) {
      const fakeFlattened = getFlattenedValidated(
        fakeValidated.results,
        '',
        {}
      );
      expect(fakeFlattened).has.property('_id');
      expect(fakeFlattened).has.property('title');
      expect(fakeFlattened).has.property('first_name');
    } else {
      throw new Error('SHOULD HAVE VALIDATED FIELDS');
    }
  });

  it('can flatten a set of fields with a container field validation', async () => {
    const collider = Collision({
      model: fakeSchema,
      roles: ['user', 'admin'],
      scope: ['r', 'w'],
    });
    const fakeCollided = await collider
      .with({
        emails: [{}],
      })
      .collide();
    const fakeValidated = await fakeCollided.validate({});
    if (fakeValidated.results) {
      const fakeFlattened = getFlattenedValidated(
        fakeValidated.results,
        '',
        {}
      );
      expect(fakeFlattened).has.property('company');
      expect(fakeFlattened).has.property('company.name');
      expect(fakeFlattened).has.property('company.address');
    } else {
      throw new Error('SHOULD HAVE VALIDATED FIELDS');
    }
  });

  it('can flatten a set of fields validations with a container field validation', async () => {
    const collider = Collision({
      model: fakeSchema,
      roles: ['user', 'admin'],
      scope: ['r', 'w'],
    });
    const fakeCollided = await collider
      .with({
        emails: [{}, {}, {}],
      })
      .collide();
    const fakeValidated = await fakeCollided.validate({});
    if (fakeValidated.results) {
      const fakeFlattened = getFlattenedValidated(
        fakeValidated.results,
        '',
        {}
      );
      expect(fakeFlattened).has.property('emails');
      expect(fakeFlattened).has.property('emails[0]');
      expect(fakeFlattened).has.property('emails[0]._id');
      expect(fakeFlattened).has.property('emails[0].primary');
      expect(fakeFlattened).has.property('emails[0].address');
      expect(fakeFlattened).has.property('emails[1]');
      expect(fakeFlattened).has.property('emails[1]._id');
      expect(fakeFlattened).has.property('emails[1].primary');
      expect(fakeFlattened).has.property('emails[1].address');
      expect(fakeFlattened).has.property('emails[2]');
      expect(fakeFlattened).has.property('emails[2]._id');
      expect(fakeFlattened).has.property('emails[2].primary');
      expect(fakeFlattened).has.property('emails[2].address');
    } else {
      throw new Error('SHOULD HAVE VALIDATED FIELDS');
    }
  });
});
