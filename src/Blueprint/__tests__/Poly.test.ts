import { expect } from "chai";
import Poly from "../Poly";
import {Fields, Field, STRING } from "../index";

describe.only('Blueprint/Poly', () => {
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
    .variation(fakeAddressFields())
    .variation(fakeEmailFields());
    expect(fakerPoly.variations).to.have.length(2);
    expect(fakerPoly.variations[0]).to.have.property('blueprints');
    expect(fakerPoly.variations[0]).to.have.property('matchers');
    expect(fakerPoly.variations[1]).to.have.property('blueprints');
    expect(fakerPoly.variations[1]).to.have.property('matchers');
  });

  it('can make the correct decision when provided with simple property matchers', () => {
    const fakerPoly = Poly()
    .variation(fakeAddressFields())
    .variation(fakeEmailFields());
    const decision = fakerPoly.resolve({
      street: '20 Example Street',
      suburb: 'Exampleville',
      country: 'Not Existastan'
    });
    expect(decision).to.equal(fakerPoly.variations[0].blueprints);
  });

  it('can make the correct decision when provided with property and value matchers', () => {
    const fakerPoly = Poly()
    .variation(fakeAddressFields({
      matchers: [
        ["street", "20 Example Street"]
      ]
    }))
    .variation(fakeEmailFields({
      matchers: [
        ["email", "example@blah.com"]
      ]
    }));
    const decision = fakerPoly.resolve({
      street: '20 Example Street',
      suburb: 'Exampleville',
      country: 'Not Existastan'
    });
    expect(decision).to.equal(fakerPoly.variations[0].blueprints);
  });

  it('can make the correct decision when provided with callback matchers', () => {
    const fakerPoly = Poly()
    .variation(fakeAddressFields({
      matchers: (values: any) => {
        return values.street && values.street === '20 Example Street'
      }
    }))
    .variation(fakeEmailFields({
      matchers: (values: any) => {
        return values.email && values.email === 'example@blah.com'
      }
    }));
    const decision = fakerPoly.resolve({
      street: '20 Example Street',
      suburb: 'Exampleville',
      country: 'Not Existastan'
    });
    expect(decision).to.equal(fakerPoly.variations[0].blueprints);
  });

  it('can make the correct decision when provided with no matching simple property matchers', () => {
    const fakerPoly = Poly()
    .variation(fakeAddressFields())
    .variation(fakeEmailFields());
    const decision = fakerPoly.resolve({
      first_name: 'Johnny',
      surname: 'Smith'
    });
    expect(decision).to.be.undefined;
  });

  it('can make the correct decision when provided with no matching property and value matchers', () => {
    const fakerPoly = Poly()
    .variation(fakeAddressFields({
      matchers: [
        ["street", "18 Example Street"]
      ]
    }))
    .variation(fakeEmailFields({
      matchers: [
        ["email", "example@blah.com"]
      ]
    }));
    const decision = fakerPoly.resolve({
      street: '20 Example Street',
      suburb: 'Exampleville',
      country: 'Not Existastan'
    });
    expect(decision).to.be.undefined;
  });

  it('can make the correct decision when provided with no matching callback matchers', () => {
    const fakerPoly = Poly()
    .variation(fakeAddressFields({
      matchers: (values: any) => {
        return values.street && values.street === '12 Example Street'
      }
    }))
    .variation(fakeEmailFields({
      matchers: (values: any) => {
        return values.email && values.email === 'example@blah.com'
      }
    }));
    const decision = fakerPoly.resolve({
      street: '20 Example Street',
      suburb: 'Exampleville',
      country: 'Not Existastan'
    });
    expect(decision).to.be.undefined;
  });
});
