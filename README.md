# FissionJS

```javascript
npm install fissionjs
```
or
```javascript
yarn add fissionjs
```

## Quick Start

Define your schema using the Atom. Atom is a reusable schema object.

```javascript
import { Atom, Nuclei, Nucleus, DenyPolicy, AllowPolicy } from 'fissionjs';

const schema = Atom({
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

```

Some values to apply the schema too

```javascript
const data = {
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
```

Apply to the schema, validate, sanitize and dump the result

```javascript
import { Reactor } from 'fissionjs';

const fakeReactor = Reactor({
      atom: schema,
      scope: ['write'],
      roles: ['user']
    });
    return fakeReactor
      .with({ values: data })
      .react()
      .then(fakeReactor.sanitize)
      .then(fakeReactor.validate)
      .then(validated => {
        // Output the validation result
        // You may want to throw or handle errors here
        console.log(validated);
      })
      .then(fakeReactor.dump)
      .then(dumped => {
        // Output the resulting JS object
        console.log(dumped);
      });
```
