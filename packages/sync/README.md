# Schemaly

This library is designed to help work with data objects by providing structure, validation, sanitization and policy driven access control. Situations where you may need this functionality include retrieving data from a database and restricting what the output should contain using user roles and scope. Processing request data from an unknown source and stripping out unexpected or unauthorised values. Creating universal data models to share on your client and server side projects to allow for shared sanitization + validation. A mixture of the previous examples to lock down and regulate data for serving, receiving and storing data.

Pretty much you can use this library to provide client side model and validation functionality and/or as a middleware to your node api REST or GraphQL endpoints.


## Installation
Install by using npm

```javascript
npm install --save @schemaly/sync
```

or by using yarn
```javascript
yarn add @schemaly/sync
```

## Quick Start

```javascript
import { Schema, Fields, Field, STRING, Collision } from '@schemaly/sync';

// Create your data schema
// This is a simple example with only one STRING field
// You can create complex fields with child fields (CONTAINER) or multiple groups of child fields (COLLECTION)
const profile = Schema({
    machine: "profile",
    // Outline allowed scopes
    scope: ["r", "w"],
    // Outline allowed roles
    roles: ["guest", "user"],
    // Outline schema blueprints
    // In this case we are adding directly but best to create externally and import
    blueprints: Fields([
        Field({
            machine: 'first_name',
            label: 'First Name',
            context: STRING
        })
    ])
});

// Create a collider to handle applying data to the schema
const collider = Collision({
    // Add the profile we are colliding with
    model: profile,
    // Add the scope for this collide
    scope: ["r"],
    // Add the roles for this collide
    roles: ["guest"]
});

// Apply the data to the schema and dump the values
collider
    .with({
        first_name: "Johnny",
        surname: "Smith"
    })
    .collide()
    .then(collider.dump)
    .then(values => {
        // Returns { first_name: 'Johnny' }
        console.log(values);
});

```

## Concepts
Schemaly has a few concepts for handling schema structure and application of data to schema. There are a number of native classes which implement these concepts such as Field, Fields, Hydrate, Hydrated etc however you have the ability to create your own extensions.

The process basically has two parts. First, the outlining of schemas which describe data structure relationships, allowed values and permissions. The second, allows from external data to be injected into the schema to product a hydrated set of objects that have additional information such as sanitized values, validation results and policy driven stripped out data.

The act of applying data to the schema is called a collide and is handled by Interact classes.

- Model: Contains the schema structure in the form of Model instances and contains allowed roles and scope. You would typically have one Model representing one thing ie. User, Order etc
- Blueprint: Contains data about an individual field (ie a name, date of birth etc) and contains validation, sanitization and policy rules governing the field.
- Interact: Handles applying data objects to an Model schema and produces Effects.
- Effect: Created for each Blueprint that passes policy checks. An effect contains a hydrated value with the ability to view sanitized values and validation results.

## Blueprint

```javascript
Field({
    // machine: A safe blueprint name with alpha and underscores
    machine: 'first_name',
    // label[OPTIONAL]: A human readable name for the blueprint
    label: 'First Name',
    // context: outlines what data to expect and rules to apply during hydration
    context: STRING,
    // tags[OPTIONAL]: a method of classifying blueprints for your own usage
    tags: ["person", "name"],
    // description[OPTIONAL]: additional field for adding your intention for this blueprint
    description: "Adds a first name field which contains the person's first name",
    // defaultValue[OPTIONAL]: provides a default value or value giving callback if none was provided
    defaultValue: "Johnny",
    // blueprints[OPTIONAL]: add child blueprints if the context permits [OPTIONAL]
    blueprints: Fields([
      // ... child blueprints
    ]),
    // policies[OPTIONAL]: adds scope and role access control to the blueprint [OPTIONAL]
    // if the policies do not return a grant then blueprint will not appear in hydrated set
    policies: GrantOne([
      // ... governing policies
    ]),
    // sanitizers[OPTIONAL]: adds value sanitizers which will automatically be applied during hydration [OPTIONAL]
    sanitizers: SanitizeAll([
      // ... sanitizers
    ]),
    // validators[OPTIONAL]: adds value validation
    validators: ValidateAll([
      // ... validators
    ]),
    // setters[OPTIONAL]: a way to intercept values as they are set into a hydrate and apply any filtering or conversion
    setters: [
      // ... setter callbacks
    ],
    // getters[OPTIONAL]: a way to intercept values as they are get from a hydrate and apply any filtering or conversion
    getters: [
      // ... getter callbacks
    ],
    // options[OPTIONAL]: add any optional data you want passed as options
    options: {}
})
```

## Blueprint Policies

```javascript
// Import on top of earlier dependencies etc
import { GrantOne, DenyPolicy, AllowPolicy } from '@schemaly/sync';

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

const collider = Collision({
    model: profile,
    // Change depending on your user's scope
    // You can specify one or multiple possible scopes
    scope: ["r"],
    // Change depending on your user's role
    // You can specify one or multiple possible roles
    roles: ["guest"]
});

collider
    .with({
        first_name: "Johnny"
    })
    .collide()
    .then(collider.dump)
    .then(values => {
        // Returns { first_name: 'Johnny' } with collider scope "r"
        // Returns { } with collider scope "w"
        console.log(values);
    });

```

## Blueprint Sanitization

```javascript
// Import on top of earlier dependencies etc
import { SanitizeAll, SimpleSanitizer } from '@schemaly/sync';

// ... wrapped in schema
Field({
    machine: 'first_name',
    label: 'First Name',
    context: STRING,
    // You can add sanitizers using the SanitizeAll class
    // Sanitizers should be run after hydration
    // If you want to just format the output and not effect the value you should use getters
    // You can stack sanitizers to apply sanitizing layers
    // Sanitizers can be async so you can sanitize against api endpoints if you like
    sanitizers: SanitizeAll([
        // A simple sanitizer is bundled with schemaly
        // It allows your to do basic sanitization
        // It is probably a good idea to create your own
        SimpleSanitizer({ filters: ['trim|upper_case'] })
    ])
})

// ... Create collider etc

collider
    .with({
        // Add some spaces and make lowercase
        first_name: "johnny  "
    })
    .collide()
    // Sanitizers will automatically be applied during hydration
    .then(collider.dump)
    .then(values => {
        // Removed spaces and converts to uppercase
        // Returns { first_name: 'JOHHNY' }
        console.log(values);
    });
```

## Blueprint Validation

```javascript
// Import on top of earlier dependencies etc
import { ValidateAll, SimpleValidator } from '@schemaly/sync';

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

// ... Create collider etc

collider
    .with({
        first_name: "Johnny",
        surname: "Smith"
    })
    .collide()
    .then(collider.validate)
    .then(({ valid, results }) => {
        // Returns a boolean if validation was successful or not
        console.log(valid);
        // Returns a object containing all field validation results
        console.log(results);
        // What you want to do with validation results is up to you
        // You could throw an exception or let the collider continue
    })
    .then(collider.dump)
    .then(values => {
        console.log(values);
    });
```

## Container Blueprints

```javascript
// Import on top of earlier dependencies etc
import { CONTAINER } from '@schemaly/sync';

// ... wrapped in schema
Field({
    machine: 'name',
    label: 'Name',
    // CONTAINER context allows for child blueprints
    context: CONTAINER,
    // You can now add a blueprints property
    // All blueprints must be wrapped in a Blueprints class
    // In this case we are using the bundled Fields class
    blueprints: Fields([
        // Add your child fields
        // There is no limit to nesting so can add more container and collection fields
        Field({
            machine: 'title',
            label: 'Title',
            context: STRING
        }),
        Field({
            machine: 'first_name',
            label: 'First Name',
            context: STRING
        }),
        Field({
            machine: 'surname',
            label: 'Surname',
            context: STRING
        })
    ])
})

// ... Create collider etc

collider
    .with({
        // Name data can now be passed inside a name property
        name: {
            title: 'Mr',
            first_name: 'Johnny',
            surname: 'Smith'
        }
    })
    .collide()
    .then(collider.dump)
    .then(values => {
        // Returns { name: { title: 'Mr', first_name: 'Johnny', surname: 'Smith' } }
        console.log(values);
    });
```

## Collection Blueprints

```javascript
// Import on top of earlier dependencies etc
import { COLLECTION, BOOLEAN } from '@schemaly/sync';

// ... wrapped in schema
Field({
    machine: 'emails',
    label: 'Emails',
    // COLLECTION context allows for child blueprints
    context: COLLECTION,
    // Like container fields you can now use the blueprints property
    // Collections allow for multiple groups of child fields
    // This is useful for lists of data like emails, addresses etc
    blueprints: Fields([
        Field({
            machine: 'address',
            label: 'Address',
            context: STRING
        }),
        Field({
            machine: 'is_primary',
            label: 'Primary',
            context: BOOLEAN
        })
    ])
})

// ... Create collider etc

collider
    .with({
        // emails needs to pass an array of value groups
        // Each value will be treated as an individual container
        emails: [
            {
                address: 'johnny@example.com',
                is_primary: false
            },
            {
                address: 'johnny@work.com',
                is_primary: true
            }
        ]
    })
    .collide()
    .then(collider.dump)
    .then(values => {
        // { emails:
        //    [ { address: 'johnny@example.com', is_primary: false },
        //        { address: 'johnny@work.com', is_primary: true } ] }
        console.log(values);
    });

```
