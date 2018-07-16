import { expect } from "chai";
import {
  COLLECTION,
  CONTAINER,
  Field,
  Fields,
  Nuclei,
  STRING
} from "../../Nucleus";
import { Hydrates } from "../index";
import { SimpleValidator, ValidateAll } from "../../Validate";
import { SanitizeAll, SimpleSanitizer } from "../../Sanitize";
import { AllowPolicy, DenyPolicy, GrantOne } from "../../Policy";
import { Schema } from "../../Atom";
import { Reaction } from "../../Reactor";

describe("Isotope/Hydrates", () => {
  const fakeValues = {
    first_name: "Thomas",
    last_name: "Tank Engine",
    company: {
      name: "Acme Company",
      address: "1 Engine Road"
    },
    emails: [
      {
        label: "Home Email",
        address: "example@home.com"
      },
      {
        label: "Work Email",
        address: "example@work.com"
      }
    ]
  };

  const getAtom = (options: any = {}) =>
    Schema({
      machine: "test",
      roles: ["user", "admin", "owner"],
      scope: ["r", "w"],
      nuclei: Fields([]),
      ...options
    });

  const getHydrates = ({
    nuclei,
    value,
    reaction,
    options = {}
  }: {
    nuclei: Nuclei;
    value?: any;
    reaction?: any;
    options?: any;
  }) => {
    const reactor = Reaction({
      atom: getAtom({ nuclei }),
      roles: ["user", "admin"],
      scope: ["r", "w"],
      ...reaction
    });
    return Hydrates({
      reactor,
      nuclei,
      parent: reactor,
      values: value ? value : fakeValues,
      options
    });
  };

  it("can create an Hydrates group with standard arguments", () => {
    const fakeHydrates = getHydrates({
      nuclei: Fields([]),
      options: { test: true }
    });
    expect(fakeHydrates.options).to.deep.equal({ test: true });
  });

  it("can hydrate against a set of nuclei, provided values and generate isotopes", () => {
    const fakeHydrates = getHydrates({
      nuclei: Fields([
        Field({ context: STRING, machine: "first_name", label: "First Name" }),
        Field({ context: STRING, machine: "last_name", label: "Last Name" }),
        Field({
          context: CONTAINER,
          machine: "company",
          label: "Company",
          nuclei: Fields([
            Field({ context: STRING, machine: "name", label: "Company Name" })
          ])
        }),
        Field({
          context: COLLECTION,
          machine: "emails",
          label: "Emails",
          nuclei: Fields([
            Field({ context: STRING, machine: "label", label: "Label" }),
            Field({ context: STRING, machine: "address", label: "Address" })
          ])
        })
      ])
    });
    return fakeHydrates
      .hydrate()
      .then(() => {
        expect(fakeHydrates.find({ machine: "first_name" })).to.not.be
          .undefined;
        expect(fakeHydrates.find({ machine: "last_name" })).to.not.be.undefined;
        expect(
          fakeHydrates.find({ machine: "company" }).find({ machine: "name" })
        ).to.not.be.undefined;
        expect(
          fakeHydrates.find({ machine: "emails" }).find({ machine: "address" })
        ).to.not.be.undefined;
        expect(
          fakeHydrates
            .find({ machine: "emails" })
            .filter({ machine: "address" })
        ).to.have.length(2);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can not error when a child bearing nucleus has no children", () => {
    const fakeHydrates = getHydrates({
      nuclei: Fields([
        Field({ context: STRING, machine: "first_name", label: "First Name" }),
        Field({ context: STRING, machine: "last_name", label: "Last Name" }),
        Field({
          context: CONTAINER,
          machine: "company",
          label: "Company"
        })
      ])
    });
    return fakeHydrates
      .hydrate()
      .then(() => {
        expect(fakeHydrates.find({ machine: "first_name" })).to.not.be
          .undefined;
        expect(fakeHydrates.find({ machine: "last_name" })).to.not.be.undefined;
        expect(fakeHydrates.find({ machine: "company" })).to.not.be.undefined;
      })
      .catch(error => {
        throw new Error(error);
      });
  });

  it("can not create isotopes for nuclei failing policy checks", () => {
    const fakeHydrates = getHydrates({
      nuclei: Fields([
        Field({
          context: STRING,
          machine: "first_name",
          label: "First Name",
          policies: GrantOne([
            DenyPolicy({ roles: ["*"], scope: ["r", "w"] }),
            AllowPolicy({ roles: ["user"], scope: ["r", "w"] })
          ])
        }),
        Field({
          context: STRING,
          machine: "last_name",
          label: "Last Name",
          policies: GrantOne([
            DenyPolicy({ roles: ["*"], scope: ["r", "w"] }),
            AllowPolicy({ roles: ["owner"], scope: ["r", "w"] })
          ])
        }),
        Field({
          context: CONTAINER,
          machine: "company",
          label: "Company",
          nuclei: Fields([
            Field({ context: STRING, machine: "name", label: "Company Name" })
          ]),
          policies: GrantOne([
            DenyPolicy({ roles: ["*"], scope: ["r", "w"] }),
            AllowPolicy({ roles: ["owner"], scope: ["r", "w"] })
          ])
        }),
        Field({
          context: COLLECTION,
          machine: "emails",
          label: "Emails",
          nuclei: Fields([
            Field({
              context: STRING,
              machine: "label",
              label: "Label",
              policies: GrantOne([
                DenyPolicy({ roles: ["*"], scope: ["r", "w"] }),
                AllowPolicy({ roles: ["user"], scope: ["r", "w"] })
              ])
            }),
            Field({
              context: STRING,
              machine: "address",
              label: "Address",
              policies: GrantOne([
                DenyPolicy({ roles: ["*"], scope: ["r", "w"] }),
                AllowPolicy({ roles: ["owner"], scope: ["r", "w"] })
              ])
            })
          ]),
          policies: GrantOne([
            DenyPolicy({ roles: ["*"], scope: ["r", "w"] }),
            AllowPolicy({ roles: ["user"], scope: ["r", "w"] })
          ])
        })
      ])
    });
    return fakeHydrates
      .hydrate()
      .then(() => {
        expect(fakeHydrates.find({ machine: "first_name" })).to.not.be
          .undefined;
        expect(fakeHydrates.find({ machine: "last_name" })).to.be.undefined;
        expect(fakeHydrates.find({ machine: "company" })).to.be.undefined;
        expect(fakeHydrates.find({ machine: "emails" })).to.not.be.undefined;
        expect(
          fakeHydrates.find({ machine: "emails" }).filter({ machine: "label" })
        ).to.have.length(2);
        expect(
          fakeHydrates
            .find({ machine: "emails" })
            .filter({ machine: "address" })
        ).to.have.length(0);
        expect(fakeHydrates.isotopes).to.have.length(2);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform sanitization against hydrated isotopes", () => {
    const fakeHydrates = getHydrates({
      nuclei: Fields([
        Field({
          context: STRING,
          machine: "first_name",
          label: "First Name",
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ["trim"] }),
            SimpleSanitizer({ filters: ["upper_case"] })
          ])
        }),
        Field({
          context: STRING,
          machine: "last_name",
          label: "Last Name",
          sanitizers: SanitizeAll([
            SimpleSanitizer({ filters: ["trim"] }),
            SimpleSanitizer({ filters: ["upper_case"] })
          ])
        }),
        Field({
          context: CONTAINER,
          machine: "company",
          label: "Company",
          nuclei: Fields([
            Field({
              context: STRING,
              machine: "name",
              label: "Company Name",
              sanitizers: SanitizeAll([
                SimpleSanitizer({ filters: ["trim"] }),
                SimpleSanitizer({ filters: ["upper_case"] })
              ])
            })
          ])
        }),
        Field({
          context: COLLECTION,
          machine: "emails",
          label: "Emails",
          nuclei: Fields([
            Field({
              context: STRING,
              machine: "label",
              label: "Label",
              sanitizers: SanitizeAll([
                SimpleSanitizer({ filters: ["trim"] }),
                SimpleSanitizer({ filters: ["upper_case"] })
              ])
            }),
            Field({
              context: STRING,
              machine: "address",
              label: "Address",
              sanitizers: SanitizeAll([
                SimpleSanitizer({ filters: ["trim"] }),
                SimpleSanitizer({ filters: ["upper_case"] })
              ])
            })
          ])
        })
      ])
    });
    return fakeHydrates
      .hydrate()
      .then(fakeHydrates.sanitize)
      .then(fakeHydrates.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({
          first_name: "THOMAS",
          last_name: "TANK ENGINE",
          company: {
            name: "ACME COMPANY"
          },
          emails: [
            {
              label: "HOME EMAIL",
              address: "EXAMPLE@HOME.COM"
            },
            {
              label: "WORK EMAIL",
              address: "EXAMPLE@WORK.COM"
            }
          ]
        });
      });
  });

  it("can perform validation against hydrated isotopes and PASS", () => {
    const fakeHydrates = getHydrates({
      nuclei: Fields([
        Field({
          context: STRING,
          machine: "first_name",
          label: "First Name",
          validators: ValidateAll([
            SimpleValidator({ rules: ["required", "min:5"] })
          ])
        }),
        Field({
          context: STRING,
          machine: "last_name",
          label: "Last Name",
          validators: ValidateAll([
            SimpleValidator({ rules: ["required", "min:5"] })
          ])
        }),
        Field({
          context: CONTAINER,
          machine: "company",
          label: "Company",
          nuclei: Fields([
            Field({
              context: STRING,
              machine: "name",
              label: "Company Name",
              validators: ValidateAll([
                SimpleValidator({ rules: ["required", "min:5"] })
              ])
            })
          ])
        }),
        Field({
          context: COLLECTION,
          machine: "emails",
          label: "Emails",
          nuclei: Fields([
            Field({
              context: STRING,
              machine: "label",
              label: "Label",
              validators: ValidateAll([
                SimpleValidator({ rules: ["required", "min:5"] })
              ])
            }),
            Field({
              context: STRING,
              machine: "address",
              label: "Address",
              validators: ValidateAll([
                SimpleValidator({ rules: ["required", "min:5"] })
              ])
            })
          ])
        })
      ])
    });
    return fakeHydrates
      .hydrate()
      .then(fakeHydrates.validate)
      .then(result => {
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
  });

  it("can perform validation against hydrated isotopes and FAIL", () => {
    const fakeHydrates = getHydrates({
      nuclei: Fields([
        Field({
          context: STRING,
          machine: "first_name",
          label: "First Name",
          validators: ValidateAll([
            SimpleValidator({ rules: ["required", "min:5"] })
          ])
        }),
        Field({
          context: STRING,
          machine: "last_name",
          label: "Last Name",
          validators: ValidateAll([
            SimpleValidator({ rules: ["required", "min:5"] })
          ])
        }),
        Field({
          context: CONTAINER,
          machine: "company",
          label: "Company",
          nuclei: Fields([
            Field({
              context: STRING,
              machine: "name",
              label: "Company Name",
              validators: ValidateAll([
                SimpleValidator({ rules: ["required", "min:25"] })
              ])
            })
          ])
        }),
        Field({
          context: COLLECTION,
          machine: "emails",
          label: "Emails",
          nuclei: Fields([
            Field({
              context: STRING,
              machine: "label",
              label: "Label",
              validators: ValidateAll([
                SimpleValidator({ rules: ["required", "min:5"] })
              ])
            }),
            Field({
              context: STRING,
              machine: "address",
              label: "Address",
              validators: ValidateAll([
                SimpleValidator({ rules: ["required", "min:25"] })
              ])
            })
          ])
        })
      ])
    });
    return fakeHydrates
      .hydrate()
      .then(fakeHydrates.validate)
      .then(result => {
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
  });

  it("can generate a value object with policies", () => {
    const fakeHydrates = getHydrates({
      nuclei: Fields([
        Field({
          context: STRING,
          machine: "first_name",
          label: "First Name"
        }),
        Field({
          context: STRING,
          machine: "last_name",
          label: "Last Name"
        }),
        Field({
          context: CONTAINER,
          machine: "company",
          label: "Company",
          nuclei: Fields([
            Field({
              context: STRING,
              machine: "name",
              label: "Company Name"
            })
          ])
        }),
        Field({
          context: COLLECTION,
          machine: "emails",
          label: "Emails",
          nuclei: Fields([
            Field({
              context: STRING,
              machine: "label",
              label: "Label"
            }),
            Field({
              context: STRING,
              machine: "address",
              label: "Address"
            })
          ])
        })
      ])
    });
    return fakeHydrates
      .hydrate()
      .then(fakeHydrates.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({
          first_name: "Thomas",
          last_name: "Tank Engine",
          company: {
            name: "Acme Company"
          },
          emails: [
            {
              label: "Home Email",
              address: "example@home.com"
            },
            {
              label: "Work Email",
              address: "example@work.com"
            }
          ]
        });
      });
  });
});
