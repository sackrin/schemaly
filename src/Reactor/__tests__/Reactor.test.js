import { expect } from 'chai';
import { Atom } from '../../Atom';
import Reactor from '../Reactor';
import { context, Nuclei, Nucleus } from '../../Nucleus';
import { AllowPolicy, DenyPolicy, GrantSinglePolicy } from '../../Policy';
import { SimpleValidator, Validators } from '../../Validate';

describe('Reactor', () => {
  const fakeAtom = Atom({
    machine: 'user',
    label: 'User',
    scope: ['read', 'write'],
    roles: ['owner', 'user', 'guest', 'admin'],
    nuclei: Nuclei([
      Nucleus({
        type: context.STRING,
        machine: '_id',
        label: 'ID',
        policies: GrantSinglePolicy([
          DenyPolicy({ scope: ['write'], roles: ['*'] })
        ])
      }),
      Nucleus({
        type: context.STRING,
        machine: 'title',
        label: 'Title',
        policies: GrantSinglePolicy([
          DenyPolicy({ scope: ['write'], roles: ['*'] }),
          AllowPolicy({ scope: ['write'], roles: ['owner', 'admin'] })
        ])
      }),
      Nucleus({
        type: context.STRING,
        machine: 'first_name',
        label: 'First Name',
        policies: GrantSinglePolicy([
          DenyPolicy({ scope: ['write'], roles: ['*'] }),
          AllowPolicy({ scope: ['write'], roles: ['owner', 'admin'] })
        ]),
        validators: Validators([
          SimpleValidator({ rules: ['required'] })
        ])
      }),
      Nucleus({
        type: context.STRING,
        machine: 'surname',
        label: 'Surname',
        validators: Validators([
          SimpleValidator({ rules: ['required'] })
        ]),
        policies: GrantSinglePolicy([
          DenyPolicy({ scope: ['*'], roles: ['*'] }),
          AllowPolicy({ scope: ['*'], roles: ['owner'] }),
          AllowPolicy({ scope: ['read'], roles: ['user'] })
        ])
      }),
      Nucleus({
        type: context.STRING,
        machine: 'dob',
        label: 'Date Of Birth',
        validators: Validators([
          SimpleValidator({ rules: ['required'] })
        ]),
        policies: GrantSinglePolicy([
          DenyPolicy({ scope: ['*'], roles: ['*'] }),
          AllowPolicy({ scope: ['*'], roles: ['owner'] })
        ])
      }),
      Nucleus({
        type: context.COLLECTION,
        machine: 'emails',
        policies: GrantSinglePolicy([
          DenyPolicy({ scope: ['*'], roles: ['*'] }),
          AllowPolicy({ scope: ['read'], roles: ['user'] }),
          AllowPolicy({ scope: ['*'], roles: ['owner', 'admin'] })
        ]),
        nuclei: Nuclei([
          Nucleus({
            type: context.STRING,
            machine: '_id',
            label: 'ID',
            policies: GrantSinglePolicy([
              DenyPolicy({ scope: ['write'], roles: ['*'] })
            ])
          }),
          Nucleus({
            type: context.BOOLEAN,
            machine: 'primary',
            label: 'Primary',
            policies: GrantSinglePolicy([
              DenyPolicy({ scope: ['*'], roles: ['*'] }),
              AllowPolicy({ scope: ['*'], roles: ['owner', 'admin'] })
            ])
          }),
          Nucleus({
            type: context.STRING,
            machine: 'address',
            label: 'Address'
          })
        ])
      })
    ])
  });

  const fakeDBRecord = {
    _id: '29c2818c-7d7b-11e8-adc0-fa7ae01bbebc',
    title: 'mr',
    first_name: 'john',
    surname: 'smith',
    dob: '16/01/91',
    emails: [
      {
        _id: '29c99123-7d7b-11e8-adc0-fa7ae01bbebc',
        primary: true,
        address: 'default@example.com'
      },
      {
        _id: '29c28402-7d7b-11e8-adc0-fa7ae01bbebc',
        primary: false,
        address: 'john.smith@example.com'
      },
      {
        _id: '29c2854c-7d7b-11e8-adc0-fa7ae01bbebc',
        primary: false,
        address: 'john.smith@hotmail.com'
      }
    ]
  };

  it('can use with to populate values', () => {
    const fakeReactor = Reactor({
      atom: fakeAtom,
      scope: ['read'],
      roles: ['guest']
    });
    fakeReactor.with({ values: fakeDBRecord });
    expect(fakeReactor.values).to.deep.equal(fakeDBRecord);
  });

  it('can use with plus and to combine two value sets', () => {
    const fakeReactor = Reactor({
      atom: fakeAtom,
      scope: ['read'],
      roles: ['guest']
    });
    fakeReactor
      .with({ values: fakeDBRecord })
      .and({ values: {
        first_name: 'benny',
        emails: [
          {
            _id: '29c28402-7d7b-11e8-adc0-fa7ae01bbebc',
            primary: true
          }
        ]
      },
      ids: ['_id'] });
    expect(fakeReactor.values).to.deep.equal({
      _id: '29c2818c-7d7b-11e8-adc0-fa7ae01bbebc',
      title: 'mr',
      first_name: 'benny',
      surname: 'smith',
      dob: '16/01/91',
      emails: [
        {
          _id: '29c99123-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: true,
          address: 'default@example.com'
        },
        {
          _id: '29c2854c-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: false,
          address: 'john.smith@hotmail.com'
        },
        {
          _id: '29c28402-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: true,
          address: 'john.smith@example.com'
        }
      ]
    });
  });

  it('can use with plus and to combine multiple value sets', () => {
    const fakeReactor = Reactor({
      atom: fakeAtom,
      scope: ['read'],
      roles: ['guest']
    });
    fakeReactor
      .with({ values: fakeDBRecord })
      .and({ values: {
        first_name: 'benny',
        emails: [
          {
            _id: '29c28402-7d7b-11e8-adc0-fa7ae01bbebc',
            primary: true
          }
        ]
      },
      ids: ['_id'] })
      .and({ values: {
        title: 'mrs',
        emails: [
          {
            _id: '29c99123-7d7b-11e8-adc0-fa7ae01bbebc',
            primary: true
          }
        ]
      },
      ids: ['_id'] });
    expect(fakeReactor.values).to.deep.equal({
      _id: '29c2818c-7d7b-11e8-adc0-fa7ae01bbebc',
      title: 'mrs',
      first_name: 'benny',
      surname: 'smith',
      dob: '16/01/91',
      emails: [
        {
          _id: '29c2854c-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: false,
          address: 'john.smith@hotmail.com'
        },
        {
          _id: '29c28402-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: true,
          address: 'john.smith@example.com'
        },
        {
          _id: '29c99123-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: true,
          address: 'default@example.com'
        }
      ]
    });
  });

  it('can use react to create hydrated isotopes', () => {
    const fakeReactor = Reactor({
      atom: fakeAtom,
      scope: ['read'],
      roles: ['guest']
    });
    return fakeReactor
      .with({ values: fakeDBRecord })
      .react()
      .then(() => {
        expect(fakeReactor.isotopes.find({ machine: 'title' })).to.not.be.undefined;
        expect(fakeReactor.isotopes.find({ machine: 'first_name' })).to.not.be.undefined;
        expect(fakeReactor.isotopes.find({ machine: 'surname' })).to.be.undefined;
        expect(fakeReactor.isotopes.find({ machine: 'dob' })).to.be.undefined;
        expect(fakeReactor.isotopes.find({ machine: 'emails' })).to.be.undefined;
      });
  });

  it('can simulate viewing a user as a guest', () => {
    const fakeReactor = Reactor({
      atom: fakeAtom,
      scope: ['read'],
      roles: ['guest']
    });
    return fakeReactor
      .with({ values: fakeDBRecord })
      .react()
      .then(fakeReactor.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({
          _id: '29c2818c-7d7b-11e8-adc0-fa7ae01bbebc',
          title: 'mr',
          first_name: 'john'
        });
      });
  });

  it('can simulate viewing a user as a user', () => {
    const fakeReactor = Reactor({
      atom: fakeAtom,
      scope: ['read'],
      roles: ['user']
    });
    return fakeReactor
      .with({ values: fakeDBRecord })
      .react()
      .then(fakeReactor.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({
          _id: '29c2818c-7d7b-11e8-adc0-fa7ae01bbebc',
          title: 'mr',
          first_name: 'john',
          surname: 'smith',
          emails: [
            {
              _id: '29c99123-7d7b-11e8-adc0-fa7ae01bbebc',
              address: 'default@example.com'
            },
            {
              _id: '29c28402-7d7b-11e8-adc0-fa7ae01bbebc',
              address: 'john.smith@example.com'
            },
            {
              _id: '29c2854c-7d7b-11e8-adc0-fa7ae01bbebc',
              address: 'john.smith@hotmail.com'
            }
          ]
        });
      });
  });

  it('can simulate viewing a user as a owner', () => {
    const fakeReactor = Reactor({
      atom: fakeAtom,
      scope: ['read'],
      roles: ['owner']
    });
    return fakeReactor
      .with({ values: fakeDBRecord })
      .react()
      .then(fakeReactor.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({ ...fakeDBRecord });
      });
  });

  it('can simulate updating a user as a owner', () => {
    const fakeRequest = {
      _id: '29c2818c-7d7b-11e8-adc0-fa7ae01bbebc',
      first_name: 'ben',
      surname: 'smithers',
      emails: [
        {
          _id: '29c28402-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: false
        },
        {
          _id: '29c2854c-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: false,
          address: 'john@hotmail.com'
        },
        {
          _id: '29c2631c-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: false,
          address: 'fake@hotmail.com'
        }
      ]
    };
    const fakeReactor = Reactor({
      atom: fakeAtom,
      scope: ['write'],
      roles: ['owner']
    });
    return fakeReactor
      .with({ values: fakeDBRecord })
      .and({ values: fakeRequest, ids: ['_id'] })
      .react()
      .then(fakeReactor.sanitize)
      .then(fakeReactor.validate)
      .then(validated => {
        expect(validated.valid).to.equal(true);
      })
      .then(fakeReactor.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({
          title: 'mr',
          first_name: 'ben',
          surname: 'smithers',
          dob: '16/01/91',
          emails: [
            {
              primary: true,
              address: 'default@example.com'
            },
            {
              primary: false,
              address: 'john.smith@example.com'
            },
            {
              primary: false,
              address: 'john@hotmail.com'
            },
            {
              primary: false,
              address: 'fake@hotmail.com'
            }
          ]
        });
      });
  });

  it('can simulate updating a user as a guest', () => {
    const fakeRequest = {
      _id: '29c2818c-7d7b-11e8-adc0-fa7ae01bbebc',
      first_name: 'ben',
      surname: 'smithers',
      emails: [
        {
          _id: '29c28402-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: false
        },
        {
          _id: '29c2854c-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: false,
          address: 'john@hotmail.com'
        },
        {
          _id: '29c2631c-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: false,
          address: 'fake@hotmail.com'
        }
      ]
    };
    const fakeReactor = Reactor({
      atom: fakeAtom,
      scope: ['write'],
      roles: ['guest']
    });
    return fakeReactor
      .with({ values: fakeDBRecord })
      .and({ values: fakeRequest, ids: ['_id'] })
      .react()
      .then(fakeReactor.sanitize)
      .then(fakeReactor.validate)
      .then(validated => {
        expect(validated.valid).to.equal(true);
      })
      .then(fakeReactor.dump)
      .then(dumped => {
        expect(dumped).to.deep.equal({});
      });
  });
});
