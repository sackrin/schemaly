import { expect } from "chai";
import { Reaction } from "../../Reactor";
import {
  COLLECTION,
  CONTAINER,
  Field,
  Fields,
  Nucleus,
  STRING
} from "../../Nucleus";
import { AllowPolicy, DenyPolicy, GrantOne } from "../../Policy";
import { SanitizeAll, SimpleSanitizer } from "../../Sanitize";
import { SimpleValidator, ValidateAll } from "../../Validate";
import { Isotope } from "../Types";
import { Hydrate } from "../index";
import { Schema } from "../../Atom";

describe("Isotope/Hydrate", (): void => {
  const getAtom = (options: any = {}) =>
    Schema({
      machine: "test",
      roles: ["user", "admin"],
      scope: ["read", "write"],
      nuclei: Fields([]),
      ...options
    });

  const getHydrate = ({
    reaction,
    nucleus,
    value,
    options = {}
  }: {
    reaction: any;
    nucleus: Nucleus;
    value: any;
    options?: any;
  }) =>
    Hydrate({
      reactor: Reaction({
        atom: getAtom({
          nuclei: Fields([nucleus])
        }),
        ...reaction
      }),
      nucleus,
      value,
      options
    });

  const mockSingleParams = {
    reaction: {
      scope: ["read"],
      roles: ["user"]
    },
    nucleus: Field({
      context: STRING,
      machine: "first_name",
      label: "First Name",
      policies: GrantOne([
        DenyPolicy({ roles: ["member"], scope: ["read", "write"] }),
        AllowPolicy({ roles: ["user", "admin"], scope: ["read", "write"] })
      ]),
      sanitizers: SanitizeAll([
        SimpleSanitizer({ filters: ["trim"] }),
        SimpleSanitizer({ filters: ["upper_case"] })
      ]),
      validators: ValidateAll([
        SimpleValidator({ rules: ["required"] }),
        SimpleValidator({ rules: ["min:5"] })
      ]),
      setters: [
        ({ isotope, value }: { isotope: Isotope; value: any }) =>
          value.toString().toUpperCase()
      ],
      getters: [
        ({ isotope, value }: { isotope: Isotope; value: any }) =>
          value.toString().toUpperCase()
      ]
    }),
    value: "johnny"
  };

  const mockGroupParams = {
    reaction: {
      scope: ["read"],
      roles: ["user"]
    },
    nucleus: Field({
      context: CONTAINER,
      machine: "profile",
      label: "Profile",
      policies: GrantOne([
        DenyPolicy({ roles: ["member"], scope: ["read", "write"] }),
        AllowPolicy({ roles: ["user", "admin"], scope: ["read", "write"] })
      ]),
      nuclei: Fields([
        Field({
          context: STRING,
          machine: "first_name",
          label: "First Name",
          policies: GrantOne([
            DenyPolicy({ roles: ["member"], scope: ["read", "write"] }),
            AllowPolicy({ roles: ["user", "admin"], scope: ["read", "write"] })
          ]),
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ["trim"] }),
            SimpleSanitizer({ filters: ["upper_case"] })
          ]),
          validators: ValidateAll([
            SimpleValidator({ rules: ["required"] }),
            SimpleValidator({ rules: ["min:3"] })
          ])
        }),
        Field({
          context: STRING,
          machine: "surname",
          label: "Surname",
          policies: GrantOne([
            DenyPolicy({ roles: ["member"], scope: ["read", "write"] }),
            AllowPolicy({ roles: ["user", "admin"], scope: ["read", "write"] })
          ]),
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ["trim"] }),
            SimpleSanitizer({ filters: ["upper_case"] })
          ]),
          validators: ValidateAll([
            SimpleValidator({ rules: ["required"] }),
            SimpleValidator({ rules: ["min:3"] })
          ])
        }),
        Field({
          context: STRING,
          machine: "secret",
          label: "Admin Notes",
          policies: GrantOne([
            DenyPolicy({ roles: ["*"], scope: ["*"] }),
            AllowPolicy({ roles: ["admin"], scope: ["*"] })
          ])
        })
      ])
    }),
    value: {
      first_name: "Toby",
      surname: "Smith",
      secret: "notseethis"
    }
  };

  const mockCollectParams = {
    reaction: {
      scope: ["read"],
      roles: ["user"]
    },
    nucleus: Field({
      context: COLLECTION,
      machine: "emails",
      label: "Emails",
      policies: GrantOne([
        DenyPolicy({ roles: ["member"], scope: ["read", "write"] }),
        AllowPolicy({ roles: ["user", "admin"], scope: ["read", "write"] })
      ]),
      nuclei: Fields([
        Field({
          context: STRING,
          machine: "label",
          label: "Label",
          policies: GrantOne([
            DenyPolicy({ roles: ["member"], scope: ["read", "write"] }),
            AllowPolicy({ roles: ["user", "admin"], scope: ["read", "write"] })
          ]),
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ["trim"] }),
            SimpleSanitizer({ filters: ["upper_case"] })
          ]),
          validators: ValidateAll([
            SimpleValidator({ rules: ["required"] }),
            SimpleValidator({ rules: ["min:5"] })
          ])
        }),
        Field({
          context: STRING,
          machine: "address",
          label: "Address",
          policies: GrantOne([
            DenyPolicy({ roles: ["member"], scope: ["read", "write"] }),
            AllowPolicy({ roles: ["user", "admin"], scope: ["read", "write"] })
          ]),
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ["trim"] }),
            SimpleSanitizer({ filters: ["upper_case"] })
          ]),
          validators: ValidateAll([
            SimpleValidator({ rules: ["required"] }),
            SimpleValidator({ rules: ["min:5"] })
          ])
        }),
        Field({
          context: STRING,
          machine: "secret",
          label: "Admin Notes",
          policies: GrantOne([
            DenyPolicy({ roles: ["*"], scope: ["*"] }),
            AllowPolicy({ roles: ["admin"], scope: ["*"] })
          ])
        })
      ])
    }),
    value: [
      {
        label: "Home Address",
        address: "test1@example.com",
        secret: "notseethis"
      },
      {
        label: "Home Address",
        address: "test1@example.com",
        secret: "notseethis"
      }
    ]
  };

  it("can create an isotope instance from a nucleus", () => {
    const isotope = getHydrate({
      ...mockSingleParams,
      options: { testing: true }
    });
    expect(isotope.nucleus).to.deep.equal(mockSingleParams.nucleus);
    expect(isotope.value).to.equal("johnny");
    expect(isotope.options).to.deep.equal({ testing: true });
  });

  it("can use getters to retrieve a correctly formatted nucleus value", () => {
    const fakeIsotope = getHydrate({ ...mockSingleParams });
    return fakeIsotope.getValue().then(value => {
      expect(fakeIsotope.value).to.equal("johnny");
      expect(value).to.equal("JOHNNY");
    });
  });

  it("can create an isotope with no value setters", () => {
    const fakeIsotope = getHydrate({ ...mockSingleParams });
    return fakeIsotope.setValue({ value: "richard" }).then(value => {
      expect(value).to.equal("RICHARD");
      expect(fakeIsotope.value).to.equal("RICHARD");
    });
  });

  it("can hydrate an isotope against a single value set", () => {
    const fakeIsotope = getHydrate({ ...mockSingleParams });
    return fakeIsotope.hydrate().then(() => {
      expect(fakeIsotope.value).to.equal("johnny");
    });
  });

  it("can hydrate an isotope against a container set", () => {
    const fakeIsotope = getHydrate({ ...mockGroupParams });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.find({ machine: "secret" })).to.be.undefined;
        expect(fakeIsotope.find({ machine: "first_name" })).to.have.property(
          "value",
          "Toby"
        );
        expect(fakeIsotope.find({ machine: "surname" })).to.have.property(
          "value",
          "Smith"
        );
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can hydrate an isotope against a repeater set", () => {
    const fakeIsotope = getHydrate({ ...mockCollectParams });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.filter({ machine: "label" })).to.have.length(2);
        expect(fakeIsotope.filter({ machine: "address" })).to.have.length(2);
        expect(fakeIsotope.filter({ machine: "secret" })).to.have.length(0);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can use the find method on a container", () => {
    const fakeIsotope = getHydrate({ ...mockGroupParams });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.find({ machine: "first_name" })).to.not.be.undefined;
        expect(fakeIsotope.find({ machine: "first_name" })).to.have.property(
          "value",
          "Toby"
        );
        expect(fakeIsotope.find({ machine: "surname" })).to.not.be.undefined;
        expect(fakeIsotope.find({ machine: "surname" })).to.have.property(
          "value",
          "Smith"
        );
        expect(fakeIsotope.find({ machine: "secret" })).to.be.undefined;
        expect(fakeIsotope.find({ machine: "notexists" })).to.be.undefined;
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can use the find method on a repeater", () => {
    const fakeIsotope = getHydrate({ ...mockCollectParams });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.find({ machine: "label" })).to.not.be.undefined;
        expect(fakeIsotope.find({ machine: "label" })).to.have.property(
          "value",
          "Home Address"
        );
        expect(fakeIsotope.find({ machine: "address" })).to.not.be.undefined;
        expect(fakeIsotope.find({ machine: "address" })).to.have.property(
          "value",
          "test1@example.com"
        );
        expect(fakeIsotope.find({ machine: "secret" })).to.be.undefined;
        expect(fakeIsotope.find({ machine: "notexists" })).to.be.undefined;
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can use the filter method on a container", () => {
    const fakeIsotope = getHydrate({ ...mockGroupParams });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.filter({ machine: "first_name" })).to.have.length(1);
        expect(
          fakeIsotope.filter({ machine: "first_name" })[0]
        ).to.have.property("value", "Toby");
        expect(fakeIsotope.filter({ machine: "surname" })).to.have.length(1);
        expect(fakeIsotope.filter({ machine: "surname" })[0]).to.have.property(
          "value",
          "Smith"
        );
        expect(fakeIsotope.filter({ machine: "secret" })).to.have.length(0);
        expect(fakeIsotope.filter({ machine: "notexists" })).to.have.length(0);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can use the filter method on a collection", () => {
    const fakeIsotope = getHydrate({ ...mockCollectParams });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.filter({ machine: "label" })).to.have.length(2);
        expect(fakeIsotope.filter({ machine: "label" })[0]).to.have.property(
          "value",
          "Home Address"
        );
        expect(fakeIsotope.filter({ machine: "address" })).to.have.length(2);
        expect(fakeIsotope.filter({ machine: "address" })[0]).to.have.property(
          "value",
          "test1@example.com"
        );
        expect(fakeIsotope.filter({ machine: "secret" })).to.have.length(0);
        expect(fakeIsotope.filter({ machine: "notexists" })).to.have.length(0);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can sanitize a simple isotope", () => {
    const fakeIsotope = getHydrate({
      ...mockSingleParams,
      value: "  johNSton "
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.sanitize)
      .then(() => {
        expect(fakeIsotope.value, "JOHNSTON");
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can sanitize a container isotope", () => {
    const fakeIsotope = getHydrate({
      ...mockGroupParams,
      value: {
        first_name: "  JessIca ",
        surname: " Smitherson "
      }
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.sanitize)
      .then(() => {
        expect(fakeIsotope.find({ machine: "first_name" })).to.have.property(
          "value",
          "JESSICA"
        );
        expect(fakeIsotope.find({ machine: "surname" })).to.have.property(
          "value",
          "SMITHERSON"
        );
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can sanitize a repeater isotope", () => {
    const fakeIsotope = getHydrate({
      ...mockCollectParams,
      value: [
        {
          label: "Home Address",
          address: "bill@example.com  "
        },
        {
          label: " Work Address   ",
          address: "  john@example.com"
        }
      ]
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.sanitize)
      .then(() => {
        expect(fakeIsotope.filter({ machine: "label" })[0]).to.have.property(
          "value",
          "HOME ADDRESS"
        );
        expect(fakeIsotope.filter({ machine: "address" })[0]).to.have.property(
          "value",
          "BILL@EXAMPLE.COM"
        );
        expect(fakeIsotope.filter({ machine: "label" })[1]).to.have.property(
          "value",
          "WORK ADDRESS"
        );
        expect(fakeIsotope.filter({ machine: "address" })[1]).to.have.property(
          "value",
          "JOHN@EXAMPLE.COM"
        );
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can validate against a simple and PASS", () => {
    const fakeIsotope = getHydrate({ ...mockSingleParams });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        expect(valid).to.equal(true);
        expect(messages).to.deep.equal([]);
        expect(children).to.deep.equal([]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can validate against a simple and FAIL", () => {
    const fakeIsotope = getHydrate({
      ...mockSingleParams,
      value: "bill"
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal([
          "The value must be at least 5 characters."
        ]);
        expect(children).to.deep.equal([]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can validate against a container and PASS", () => {
    const fakeIsotope = getHydrate({ ...mockGroupParams });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        expect(valid).to.equal(true);
        expect(messages).to.have.length(0);
        expect(children).to.have.length(1);
        expect(children[0].first_name).to.have.property("valid", true);
        expect(children[0].surname).to.have.property("valid", true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can validate against a container and FAIL", () => {
    const fakeIsotope = getHydrate({
      ...mockGroupParams,
      value: {
        first_name: "Yi",
        surname: "Gi",
        secret: "notseethis"
      }
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        expect(valid).to.equal(false);
        expect(messages).to.have.length(0);
        expect(children).to.have.length(1);
        expect(children[0].first_name.valid).to.equal(false);
        expect(children[0].first_name.messages).to.have.length(1);
        expect(children[0].surname.valid).to.equal(false);
        expect(children[0].surname.messages).to.have.length(1);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can validate against a repeater and PASS", () => {
    const fakeIsotope = getHydrate({ ...mockCollectParams });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        expect(valid).to.equal(true);
        expect(messages).to.have.length(0);
        expect(children).to.have.length(2);
        expect(children[0].address.valid).to.equal(true);
        expect(children[0].label.valid).to.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can validate against a repeater value and FAIL", () => {
    const fakeIsotope = getHydrate({
      ...mockCollectParams,
      value: [
        {
          label: "Fail",
          address: "Fail",
          secret: "notseethis"
        },
        {
          label: "Fail",
          address: "Fail",
          secret: "notseethis"
        }
      ]
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        expect(valid).to.equal(false);
        expect(messages).to.have.length(0);
        expect(children).to.have.length(2);
        expect(children[0].address.valid).to.equal(false);
        expect(children[0].address.messages).to.have.length(1);
        expect(children[0].label.valid).to.equal(false);
        expect(children[0].label.messages).to.have.length(1);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can generate a simple values object", () => {
    const fakeIsotope = getHydrate({ ...mockSingleParams });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.dump)
      .then(dumped => {
        expect(dumped).to.equal("JOHNNY");
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can generate a container values object", () => {
    const fakeIsotope = getHydrate({ ...mockGroupParams });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({
          first_name: "Toby",
          surname: "Smith"
        });
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can generate a collection values object", () => {
    const fakeIsotope = getHydrate({ ...mockCollectParams });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal([
          {
            label: "Home Address",
            address: "test1@example.com"
          },
          {
            label: "Home Address",
            address: "test1@example.com"
          }
        ]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });
});
