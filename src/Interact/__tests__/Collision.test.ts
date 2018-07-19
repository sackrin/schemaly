import { expect } from "chai";
import { Schema } from "../../Model";
import { BOOLEAN, COLLECTION, Field, Fields, STRING } from "../../Blueprint";
import { AllowPolicy, DenyPolicy, GrantOne } from "../../Policy";
import { SimpleValidator, ValidateAll } from "../../Validate";
import { Collision } from "../index";

describe("Collider/Collision", () => {
  const fakeSchema = Schema({
    machine: "user",
    label: "User",
    scope: ["read", "write"],
    roles: ["owner", "user", "guest", "admin"],
    blueprints: Fields([
      Field({
        context: STRING,
        machine: "_id",
        label: "ID",
        policies: GrantOne([DenyPolicy({ scope: ["write"], roles: ["*"] })])
      }),
      Field({
        context: STRING,
        machine: "title",
        label: "Title",
        policies: GrantOne([
          DenyPolicy({ scope: ["write"], roles: ["*"] }),
          AllowPolicy({ scope: ["write"], roles: ["owner", "admin"] })
        ])
      }),
      Field({
        context: STRING,
        machine: "first_name",
        label: "First Name",
        policies: GrantOne([
          DenyPolicy({ scope: ["write"], roles: ["*"] }),
          AllowPolicy({ scope: ["write"], roles: ["owner", "admin"] })
        ]),
        validators: ValidateAll([SimpleValidator({ rules: ["required"] })])
      }),
      Field({
        context: STRING,
        machine: "surname",
        label: "Surname",
        validators: ValidateAll([SimpleValidator({ rules: ["required"] })]),
        policies: GrantOne([
          DenyPolicy({ scope: ["*"], roles: ["*"] }),
          AllowPolicy({ scope: ["*"], roles: ["owner"] }),
          AllowPolicy({ scope: ["read"], roles: ["user"] })
        ])
      }),
      Field({
        context: STRING,
        machine: "dob",
        label: "Date Of Birth",
        validators: ValidateAll([SimpleValidator({ rules: ["required"] })]),
        policies: GrantOne([
          DenyPolicy({ scope: ["*"], roles: ["*"] }),
          AllowPolicy({ scope: ["*"], roles: ["owner"] })
        ])
      }),
      Field({
        context: COLLECTION,
        machine: "emails",
        policies: GrantOne([
          DenyPolicy({ scope: ["*"], roles: ["*"] }),
          AllowPolicy({ scope: ["read"], roles: ["user"] }),
          AllowPolicy({ scope: ["*"], roles: ["owner", "admin"] })
        ]),
        blueprints: Fields([
          Field({
            context: STRING,
            machine: "_id",
            label: "ID",
            policies: GrantOne([DenyPolicy({ scope: ["write"], roles: ["*"] })])
          }),
          Field({
            context: BOOLEAN,
            machine: "primary",
            label: "Primary",
            policies: GrantOne([
              DenyPolicy({ scope: ["*"], roles: ["*"] }),
              AllowPolicy({ scope: ["*"], roles: ["owner", "admin"] })
            ])
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

  const fakeDBRecord = {
    _id: "29c2818c-7d7b-11e8-adc0-fa7ae01bbebc",
    title: "mr",
    first_name: "john",
    surname: "smith",
    dob: "16/01/91",
    emails: [
      {
        _id: "29c99123-7d7b-11e8-adc0-fa7ae01bbebc",
        primary: true,
        address: "default@example.com"
      },
      {
        _id: "29c28402-7d7b-11e8-adc0-fa7ae01bbebc",
        primary: false,
        address: "john.smith@example.com"
      },
      {
        _id: "29c2854c-7d7b-11e8-adc0-fa7ae01bbebc",
        primary: false,
        address: "john.smith@hotmail.com"
      }
    ]
  };

  it("can use with to populate values", () => {
    const fakeCollision = Collision({
      model: fakeSchema,
      scope: ["read"],
      roles: ["guest"]
    });
    fakeCollision.with(fakeDBRecord);
    expect(fakeCollision.values).to.deep.equal(fakeDBRecord);
  });

  it("can use with plus and to combine two value sets", () => {
    const fakeCollision = Collision({
      model: fakeSchema,
      scope: ["read"],
      roles: ["guest"]
    });
    fakeCollision.with(fakeDBRecord).and({
      values: {
        first_name: "benny",
        emails: [
          {
            _id: "29c28402-7d7b-11e8-adc0-fa7ae01bbebc",
            primary: true
          }
        ]
      },
      ids: ["_id"]
    });
    expect(fakeCollision.values).to.deep.equal({
      _id: "29c2818c-7d7b-11e8-adc0-fa7ae01bbebc",
      title: "mr",
      first_name: "benny",
      surname: "smith",
      dob: "16/01/91",
      emails: [
        {
          _id: "29c99123-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: true,
          address: "default@example.com"
        },
        {
          _id: "29c2854c-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: false,
          address: "john.smith@hotmail.com"
        },
        {
          _id: "29c28402-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: true,
          address: "john.smith@example.com"
        }
      ]
    });
  });

  it("can use with plus and to combine multiple value sets", () => {
    const fakeCollision = Collision({
      model: fakeSchema,
      scope: ["read"],
      roles: ["guest"]
    });
    fakeCollision
      .with(fakeDBRecord)
      .and({
        values: {
          first_name: "benny",
          emails: [
            {
              _id: "29c28402-7d7b-11e8-adc0-fa7ae01bbebc",
              primary: true
            }
          ]
        },
        ids: ["_id"]
      })
      .and({
        values: {
          title: "mrs",
          emails: [
            {
              _id: "29c99123-7d7b-11e8-adc0-fa7ae01bbebc",
              primary: true
            }
          ]
        },
        ids: ["_id"]
      });
    expect(fakeCollision.values).to.deep.equal({
      _id: "29c2818c-7d7b-11e8-adc0-fa7ae01bbebc",
      title: "mrs",
      first_name: "benny",
      surname: "smith",
      dob: "16/01/91",
      emails: [
        {
          _id: "29c2854c-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: false,
          address: "john.smith@hotmail.com"
        },
        {
          _id: "29c28402-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: true,
          address: "john.smith@example.com"
        },
        {
          _id: "29c99123-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: true,
          address: "default@example.com"
        }
      ]
    });
  });

  it("can use collide to create hydrated effects", () => {
    const fakeCollision = Collision({
      model: fakeSchema,
      scope: ["read"],
      roles: ["guest"]
    });
    return fakeCollision
      .with(fakeDBRecord)
      .collide()
      .then(() => {
        expect(fakeCollision.effects!.find({ machine: "title" })).to.not.be
          .undefined;
        expect(fakeCollision.effects!.find({ machine: "first_name" })).to.not.be
          .undefined;
        expect(fakeCollision.effects!.find({ machine: "surname" })).to.be
          .undefined;
        expect(fakeCollision.effects!.find({ machine: "dob" })).to.be.undefined;
        expect(fakeCollision.effects!.find({ machine: "emails" })).to.be
          .undefined;
      });
  });

  it("can simulate viewing a user as a guest", () => {
    const fakeCollision = Collision({
      model: fakeSchema,
      scope: ["read"],
      roles: ["guest"]
    });
    return fakeCollision
      .with(fakeDBRecord)
      .collide()
      .then(fakeCollision.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({
          _id: "29c2818c-7d7b-11e8-adc0-fa7ae01bbebc",
          title: "mr",
          first_name: "john"
        });
      });
  });

  it("can simulate viewing a user as a user", () => {
    const fakeCollision = Collision({
      model: fakeSchema,
      scope: ["read"],
      roles: ["user"]
    });
    return fakeCollision
      .with(fakeDBRecord)
      .collide()
      .then(fakeCollision.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({
          _id: "29c2818c-7d7b-11e8-adc0-fa7ae01bbebc",
          title: "mr",
          first_name: "john",
          surname: "smith",
          emails: [
            {
              _id: "29c99123-7d7b-11e8-adc0-fa7ae01bbebc",
              address: "default@example.com"
            },
            {
              _id: "29c28402-7d7b-11e8-adc0-fa7ae01bbebc",
              address: "john.smith@example.com"
            },
            {
              _id: "29c2854c-7d7b-11e8-adc0-fa7ae01bbebc",
              address: "john.smith@hotmail.com"
            }
          ]
        });
      });
  });

  it("can simulate viewing a user as a owner", () => {
    const fakeCollision = Collision({
      model: fakeSchema,
      scope: ["read"],
      roles: ["owner"]
    });
    return fakeCollision
      .with(fakeDBRecord)
      .collide()
      .then(fakeCollision.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({ ...fakeDBRecord });
      });
  });

  it("can simulate updating a user as a owner", () => {
    const fakeRequest = {
      _id: "29c2818c-7d7b-11e8-adc0-fa7ae01bbebc",
      first_name: "ben",
      surname: "smithers",
      emails: [
        {
          _id: "29c28402-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: false
        },
        {
          _id: "29c2854c-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: false,
          address: "john@hotmail.com"
        },
        {
          _id: "29c2631c-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: false,
          address: "fake@hotmail.com"
        }
      ]
    };
    const fakeCollision = Collision({
      model: fakeSchema,
      scope: ["write"],
      roles: ["owner"]
    });
    return fakeCollision
      .with(fakeDBRecord)
      .and({ values: fakeRequest, ids: ["_id"] })
      .collide()
      .then(fakeCollision.sanitize)
      .then(fakeCollision.validate)
      .then(validated => {
        expect(validated.valid).to.equal(true);
      })
      .then(fakeCollision.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({
          title: "mr",
          first_name: "ben",
          surname: "smithers",
          dob: "16/01/91",
          emails: [
            {
              primary: true,
              address: "default@example.com"
            },
            {
              primary: false,
              address: "john.smith@example.com"
            },
            {
              primary: false,
              address: "john@hotmail.com"
            },
            {
              primary: false,
              address: "fake@hotmail.com"
            }
          ]
        });
      });
  });

  it("can simulate updating a user as a guest", () => {
    const fakeRequest = {
      _id: "29c2818c-7d7b-11e8-adc0-fa7ae01bbebc",
      first_name: "ben",
      surname: "smithers",
      emails: [
        {
          _id: "29c28402-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: false
        },
        {
          _id: "29c2854c-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: false,
          address: "john@hotmail.com"
        },
        {
          _id: "29c2631c-7d7b-11e8-adc0-fa7ae01bbebc",
          primary: false,
          address: "fake@hotmail.com"
        }
      ]
    };
    const fakeCollision = Collision({
      model: fakeSchema,
      scope: ["write"],
      roles: ["guest"]
    });
    return fakeCollision
      .with(fakeDBRecord)
      .and({ values: fakeRequest, ids: ["_id"] })
      .collide()
      .then(fakeCollision.sanitize)
      .then(fakeCollision.validate)
      .then(validated => {
        expect(validated.valid).to.equal(true);
      })
      .then(fakeCollision.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({});
      });
  });
});
