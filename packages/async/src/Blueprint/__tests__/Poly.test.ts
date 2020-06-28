import { expect } from "chai";
import Poly from "../Poly";
import {Fields, Field, STRING } from "../index";

describe('Blueprint/Poly', () => {
  const fakeEmailFields = (options: any = {}) => ({
    blueprints: Fields([
      Field({ machine: "email", context: STRING }),
      Field({ machine: "label", context: STRING }),
    ]),
    matchers: [
      ["email"]
    ],
    ...options
  });

  const fakeAddressFields = (options: any = {}) => ({
    blueprints: Fields([
      Field({ machine: "street", context: STRING }),
      Field({ machine: "suburb", context: STRING }),
      Field({ machine: "country", context: STRING }),
    ]),
    matchers: [
      ["street"]
    ],
    ...options
  });

  it('can create a Polyr with variations', () => {
    const fakerPoly = Poly()
    .type(fakeAddressFields())
    .type(fakeEmailFields());
    expect(fakerPoly.types).to.have.length(2);
    expect(fakerPoly.types[0]).to.have.property('blueprints');
    expect(fakerPoly.types[0]).to.have.property('matchers');
    expect(fakerPoly.types[1]).to.have.property('blueprints');
    expect(fakerPoly.types[1]).to.have.property('matchers');
  });

  it('can make the correct decision when provided with simple property matchers', () => {
    const fakerPoly = Poly()
    .type(fakeAddressFields())
    .type(fakeEmailFields());
    const decision = fakerPoly.resolve({
      street: '20 Example Street',
      suburb: 'Exampleville',
      country: 'Not Existastan'
    });
    expect(decision).to.equal(fakerPoly.types[0].blueprints);
  });

  it('can make the correct decision when provided with property and value matchers', () => {
    const fakerPoly = Poly()
    .type(fakeAddressFields({
      matchers: [
        ["street", "20 Example Street"]
      ]
    }))
    .type(fakeEmailFields({
      matchers: [
        ["email", "example@blah.com"]
      ]
    }));
    const decision = fakerPoly.resolve({
      street: '20 Example Street',
      suburb: 'Exampleville',
      country: 'Not Existastan'
    });
    expect(decision).to.equal(fakerPoly.types[0].blueprints);
  });

  it('can make the correct decision when provided with callback matchers', () => {
    const fakerPoly = Poly()
    .type(fakeAddressFields({
      matchers: (values: any) => {
        return values.street && values.street === '20 Example Street'
      }
    }))
    .type(fakeEmailFields({
      matchers: (values: any) => {
        return values.email && values.email === 'example@blah.com'
      }
    }));
    const decision = fakerPoly.resolve({
      street: '20 Example Street',
      suburb: 'Exampleville',
      country: 'Not Existastan'
    });
    expect(decision).to.equal(fakerPoly.types[0].blueprints);
  });

  it('can make the correct decision when provided with no matching simple property matchers', () => {
    const fakerPoly = Poly()
    .type(fakeAddressFields())
    .type(fakeEmailFields());
    const decision = fakerPoly.resolve({
      first_name: 'Johnny',
      surname: 'Smith'
    });
    expect(decision.all()).to.deep.equal([]);
  });

  it('can make the correct decision when provided with no matching property and value matchers', () => {
    const fakerPoly = Poly()
    .type(fakeAddressFields({
      matchers: [
        ["street", "18 Example Street"]
      ]
    }))
    .type(fakeEmailFields({
      matchers: [
        ["email", "example@blah.com"]
      ]
    }));
    const decision = fakerPoly.resolve({
      street: '20 Example Street',
      suburb: 'Exampleville',
      country: 'Not Existastan'
    });
    expect(decision.all()).to.deep.equal([]);
  });

  it('can make the correct decision when provided with no matching callback matchers', () => {
    const fakerPoly = Poly()
    .type(fakeAddressFields({
      matchers: (values: any) => {
        return values.street && values.street === '12 Example Street'
      }
    }))
    .type(fakeEmailFields({
      matchers: (values: any) => {
        return values.email && values.email === 'example@blah.com'
      }
    }));
    const decision = fakerPoly.resolve({
      street: '20 Example Street',
      suburb: 'Exampleville',
      country: 'Not Existastan'
    });
    expect(decision.all()).to.deep.equal([]);
  });
});
