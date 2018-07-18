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

## Concepts
FissionJS has a few concepts for handling schema structure and application of data to schema. There are a number of native classes which implement these concepts such as Field, Fields, Hydrate, Hydrated etc however you have the ability to create your own extensions.

The process basically has two parts. First, the outlining of schemas which describe data structure relationships, allowed values and permissions. The second, allows from external data to be injected into the schema to product a hydrated set of objects that have additional information such as sanitized values, validation results and policy driven stripped out data.

The act of applying data to the schema is called a reaction and is handled by Reactor classes.

- Atom: Contains the schema structure in the form of Atom instances and contains allowed roles and scope. You would typically have one Atom representing one thing ie. User, Order etc
- Nucleus: Contains data about an individual field (ie a name, date of birth etc) and contains validation, sanitization and policy rules governing the field.
- Reactor: Handles applying data objects to an Atom schema and produces Isotopes.
- Isotope: Created for each Nucleus that passes policy checks. An isotope contains a hydrated value with the ability to view sanitized values and validation results.

## Notable ToDos
Progress of development can be viewed on the project trello board. https://trello.com/b/SskmstkA/fissionjs

- Create better documentation and examples
- Adding strict mode (strict = true / false) option at Atom and Nucleus level to enforce known fields but allow non defined fields as well
- Add ANY context to permit any value within a field
- Create JSON Schema parser to allow FissionJS to work with JSON schema projects.
