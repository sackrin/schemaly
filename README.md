# FissionJS

This library is designed to help work with data objects by providing structure, validation, sanitization and policy driven access control. Situations where you may need this functionality include retrieving data from a database and restricting what the output should contain using user roles and scope. Processing request data from an unknown source and stripping out unexpected or unauthorised values. Creating universal data models to share on your client and server side projects to allow for shared sanitization + validation. A mixture of the previous examples to lock down and regulate data for serving, receiving and storing data. 

Pretty much you can use this library to provide client side model and validation functionality and/or as a middleware to your node api REST or GraphQL endpoints.


## Installation
Install by using npm 

```javascript
npm install --save fissionjs
```

or by using yarn
```javascript
yarn add fissionjs
```

## Quick Start

```javascript
import { Schema, Fields, Field, STRING, Reaction } from 'fissionjs';

// Create your data schema
// This is a simple example with only one STRING field
// You can create complex fields with child fields (CONTAINER) or multiple groups of child fields (COLLECTION)
const profile = Schema({
    machine: "profile",
    // Outline allowed scopes
    scope: ["r", "w"],
    // Outline allowed roles
    roles: ["guest", "user"],
    // Outline schema nuclei
    // In this case we are adding directly but best to create externally and import
    nuclei: Fields([
        Field({
            machine: 'first_name',
            label: 'First Name',
            context: STRING
        })
    ])
});

// Create a reactor to handle applying data to the schema
const reactor = Reaction({
    // Add the profile we are reacting with
    atom: profile,
    // Add the scope for this reaction
    scope: ["r"],
    // Add the roles for this reaction
    roles: ["guest"]
});

// Apply the data to the schema and dump the values
reactor
    .with({
        first_name: "Johnny",
        surname: "Smith"
    })
    .react()
    .then(reactor.dump)
    .then(values => {
        // Returns { first_name: 'Johnny' }
        console.log(values);
});

```

## Concepts
FissionJS has a few concepts for handling schema structure and application of data to schema. There are a number of native classes which implement these concepts such as Field, Fields, Hydrate, Hydrated etc however you have the ability to create your own extensions.

The process basically has two parts. First, the outlining of schemas which describe data structure relationships, allowed values and permissions. The second, allows from external data to be injected into the schema to product a hydrated set of objects that have additional information such as sanitized values, validation results and policy driven stripped out data.

The act of applying data to the schema is called a reaction and is handled by Reactor classes.

- Atom: Contains the schema structure in the form of Atom instances and contains allowed roles and scope. You would typically have one Atom representing one thing ie. User, Order etc
- Nucleus: Contains data about an individual field (ie a name, date of birth etc) and contains validation, sanitization and policy rules governing the field.
- Reactor: Handles applying data objects to an Atom schema and produces Isotopes.
- Isotope: Created for each Nucleus that passes policy checks. An isotope contains a hydrated value with the ability to view sanitized values and validation results.

## Field Policies

```javascript
import { GrantOne, DenyPolicy, AllowPolicy } from 'fissionjs';

// ... wrapped in schema
Field({
    machine: 'first_name',
    label: 'First Name',
    // GrantOne checks for a single policy to return grant
    // Typically you only need one policy to grant
    // You can use GrantAll to enforce an all policies grant
    policies: GrantOne([
        // Deny all roles and scope by default
        // This ensures that only the rules below can grant and nothing slips through
        DenyPolicy({ roles: ["*"], scope: ["*"]}),
        // We want both guest and user to be able to "r" this field
        AllowPolicy({ roles: ["guest", "user"], scope: ["r"] }),
        // We want only the user to be able to "w" this field
        AllowPolicy({ roles: ["user"], scope: ["w"] })
    ]),
    context: STRING
})

const reactor = Reaction({
    atom: profile,
    // Change depending on your user's scope
    // You can specify one or multiple possible scopes
    scope: ["r"],
    // Change depending on your user's role
    // You can specify one or multiple possible roles
    roles: ["guest"]
});

reactor
    .with({
        first_name: "Johnny"
    })
    .react()
    .then(reactor.dump)
    .then(values => {
        // Returns { first_name: 'Johnny' } with reactor scope "r"
        // Returns { } with reactor scope "w"
        console.log(values);
    });

```

## Field Validation

```javascript
import { ValidateAll, SimpleValidator } from 'fissionjs';

// ... wrapped in schema
Field({
    machine: 'first_name',
    label: 'First Name',
    context: STRING,
    // ValidateAll will check to ensure all validators return valid
    // You can create your own Validators container if you like
    validators: ValidateAll([
        // SimpleValidator uses the skaterdav85/validatorjs library
        // You can create your own or stack multiple validators here
        SimpleValidator({ rules: ['required|alpha'] })
    ])
})

// ... Create reactor etc

reactor
    .with({
        first_name: "Johnny",
        surname: "Smith"
    })
    .react()
    .then(reactor.validate)
    .then(({ valid, results }) => {
        // Returns a boolean if validation was successful or not
        console.log(valid);
        // Returns a object containing all field validation results
        console.log(results);
        // What you want to do with validation results is up to you
        // You could throw an exception or let the reactor continue
    })
    .then(reactor.dump)
    .then(values => {
        console.log(values);
    });
```

## Notable ToDos
Progress of development can be viewed on the project trello board. https://trello.com/b/SskmstkA/fissionjs

- Create better documentation and examples
- Adding strict mode (strict = true / false) option at Atom and Nucleus level to enforce known fields but allow non defined fields as well
- Add ANY context to permit any value within a field
- Create JSON Schema parser to allow FissionJS to work with JSON schema projects.
