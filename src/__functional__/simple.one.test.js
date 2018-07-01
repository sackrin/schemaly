import { Atom } from '../../';
import { context, Nuclei, Nucleus } from '../Nucleus';
import { Reactor } from '../Reactor';
import {SimpleValidator, Validators} from '../Validate';

describe.only('Simple Functional Test One', () => {
  const fakeAtom = Atom({
    machine: 'user',
    label: 'User',
    scope: ['read', 'write'],
    roles: ['user', 'guest', 'admin'],
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
      })
    ])
  });

  it('can simulate creating a user', () => {
    const fakeReactor = Reactor({
      atom: fakeAtom,
      scope: ['write'],
      roles: ['guest']
    });
    return fakeReactor.with({
      title: 'mr',
      first_name: 'john',
      surname: 'smith'
    })
      .then(fakeReactor.sanitize)
      .then(fakeReactor.validate)
      .then(validated => {
        console.log(validated);
      })
      .then(fakeReactor.dump)
      .then(dumped => {
        console.log(dumped);
      });
  });
});
