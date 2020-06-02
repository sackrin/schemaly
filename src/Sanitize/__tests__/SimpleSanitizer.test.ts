import { expect } from 'chai';
import SimpleSanitizer from '../SimpleSanitizer';
import { Hydrate, Effect } from '../../Effect';
import { Schema } from '../../Model';
import { Collision } from '../../Interact';
import { Field, Fields, STRING } from '../../Blueprint';

describe('Santize/SimpleSanitizer', () => {
  const simplePromiseRule = () =>
    new Promise((resolve) => {
      setTimeout(resolve, 100, ['sanitize_string']);
    });

  const mockPromiseValue = () =>
    new Promise((resolve) => {
      setTimeout(resolve, 100, '  johnny ');
    });

  const fakeModel = Schema({
    machine: 'test',
    roles: ['user', 'admin'],
    scope: ['read', 'write'],
    blueprints: Fields([Field({ machine: 'first_name', context: STRING })]),
  });

  const fakeEffect = (options: any = {}) =>
    Hydrate({
      collider: Collision({
        model: fakeModel,
        roles: ['user', 'admin'],
        scope: ['read', 'write'],
      }),
      blueprint: fakeModel.blueprints.blueprints[0],
      value: 'John',
      ...options,
    });

  it('can create a simple filters santizer', () => {
    const filters = ['trim|sanitize_string'];
    const sanitizer = SimpleSanitizer({ filters, options: { test: true } });
    expect(sanitizer.filters).to.deep.equal(filters);
    expect(sanitizer.options.test).to.equal(true);
  });

  it('can create a mixed rule santizer', () => {
    const filters = ['trim', simplePromiseRule];
    const sanitizer = SimpleSanitizer({ filters });
    expect(sanitizer.filters).to.deep.equal(filters);
  });

  it('get filters produces a usable santizer string', () => {
    const filters = ['trim', simplePromiseRule];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer.getFilters().then((built) => {
      expect(built).to.equal('trim|sanitize_string');
    });
  });

  it('sanitize a string using a single trim and upper_case filters', () => {
    const filters = ['trim|upper_case'];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer
      .apply({
        value: ' johnny ',
        effect: fakeEffect(),
      })
      .then((sanitized) => {
        expect(sanitized).to.equal('JOHNNY');
      });
  });

  it('sanitize a promise value using a single trim and upper_case filters', () => {
    const filters = ['trim|upper_case'];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer
      .apply({ value: mockPromiseValue, effect: fakeEffect() })
      .then((sanitized) => {
        expect(sanitized).to.equal('JOHNNY');
      });
  });

  it('sanitize a string using the trim filter', () => {
    const filters = ['trim'];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer
      .apply({ value: ' johnny ', effect: fakeEffect() })
      .then((sanitized) => {
        expect(sanitized).to.equal('johnny');
      });
  });

  it('sanitize a string using the upper_case filter', () => {
    const filters = ['upper_case'];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer
      .apply({ value: 'johnny', effect: fakeEffect() })
      .then((sanitized) => {
        expect(sanitized).to.equal('JOHNNY');
      });
  });

  it('sanitize a string using the lower_case filter', () => {
    const filters = ['lower_case'];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer
      .apply({ value: 'JOHNNY', effect: fakeEffect() })
      .then((sanitized) => {
        expect(sanitized).to.equal('johnny');
      });
  });

  it('sanitize a string using an invalid sanitizer filter', () => {
    const filters = ['invalidSanitizer'];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer
      .apply({ value: 'johnny', effect: fakeEffect() })
      .then((sanitized) => {
        expect(sanitized).to.equal('johnny');
      });
  });

  it('sanitize a string using stringArray filter', () => {
    const filters = ['string_array'];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer
      .apply({ value: 'johnny', effect: fakeEffect() })
      .then((sanitized) => {
        expect(sanitized).to.equal(undefined);
      });
  });

  it('sanitize an empty array using stringArray filter', () => {
    const filters = ['string_array'];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer
      .apply({ value: [], effect: fakeEffect() })
      .then((sanitized) => {
        expect(sanitized).to.deep.equal([]);
      });
  });

  it('sanitize a string array using stringArray filter', () => {
    const filters = ['string_array'];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer
      .apply({ value: ['johnny'], effect: fakeEffect() })
      .then((sanitized) => {
        expect(sanitized).to.deep.equal(['johnny']);
      });
  });

  it('sanitize a number array using stringArray filter', () => {
    const filters = ['string_array'];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer
      .apply({ value: [42], effect: fakeEffect() })
      .then((sanitized) => {
        expect(sanitized).to.deep.equal(['42']);
      });
  });

  it('sanitize a mixture of numbers and strings using stringArray filter', () => {
    const filters = ['string_array'];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer
      .apply({ value: [42, '43'], effect: fakeEffect() })
      .then((sanitized) => {
        expect(sanitized).to.deep.equal(['42', '43']);
      });
  });
});
