import { expect } from 'chai';
import { Atom } from '../../';
import { context, Nuclei, Nucleus } from '../Nucleus';
import { Reactor } from '../Reactor';
import { SimpleValidator, Validators } from '../Validate';
import { AllowPolicy, DenyPolicy, GrantSinglePolicy } from '../Policy';

describe.only('Simple Functional Test One', () => {
  const fakeAtom = Atom({
    machine: 'user',
    label: 'User',
    scope: ['read', 'write'],
    roles: ['owner', 'user', 'guest', 'admin'],
    nuclei: Nuclei([
      Nucleus({
        type: context.STRING,
        machine: 'title',
        label: 'Title'
      }),
      Nucleus({
        type: context.STRING,
        machine: 'first_name',
        label: 'First Name',
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
          AllowPolicy({ scope: ['*'], roles: ['owner'] })
        ]),
        nuclei: Nuclei([
          Nucleus({
            type: context.BOOLEAN,
            machine: 'primary',
            label: 'Primary'
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
        _id: '29c28402-7d7b-11e8-adc0-fa7ae01bbebc',
        primary: true,
        address: 'john.smith@example.com'
      },
      {
        _id: '29c2854c-7d7b-11e8-adc0-fa7ae01bbebc',
        primary: false,
        address: 'john.smith@hotmail.com'
      }
    ]
  };

  it('can simulate updating a user', () => {
    const fakeRequest = {
      _id: '29c2818c-7d7b-11e8-adc0-fa7ae01bbebc',
      first_name: 'ben',
      surname: 'smithers',
      emails: [
        {
          _id: '29c2854c-7d7b-11e8-adc0-fa7ae01bbebc',
          primary: false,
          address: 'john.blah@hotmail.com'
        }
      ]
    };
    const fakeReactor = Reactor({
      atom: fakeAtom,
      scope: ['write'],
      roles: ['owner']
    });
    return fakeReactor
      .with(fakeDBRecord)
      .and(fakeRequest)
      .execute()
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
              _id: '29c28402-7d7b-11e8-adc0-fa7ae01bbebc',
              primary: true,
              address: 'john.smith@example.com'
            },
            {
              _id: '29c2854c-7d7b-11e8-adc0-fa7ae01bbebc',
              primary: false,
              address: 'john.blah@hotmail.com'
            }
          ]
        });
      });
  });
});
