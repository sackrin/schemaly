# FissionJS

## Terminology
FissionJS has a few concepts for handling schema structure and application of data to schema. There are a number of native classes which implement these concepts such as Field, Fields, Hydrate, Hydrated etc however you have the ability to create your own extensions.

The process basically has two parts. First, the outlining of schemas which describe data structure relationships, allowed values and permissions. The second, allows from external data to be injected into the schema to product a hydrated set of objects that have additional information such as sanitized values, validation results and policy driven stripped out data.

The act of applying data to the schema is called a reaction and is handled by Reactor classes.

- Atom: Contains the schema structure in the form of Atom instances and contains allowed roles and scope. You would typically have one Atom representing one thing ie. User, Order etc
- Nucleus: Contains data about an individual field (ie a name, date of birth etc) and contains validation, sanitization and policy rules governing the field.
- Reactor: Handles applying data objects to an Atom schema and produces Isotopes.
- Isotope: Created for each Nucleus that passes policy checks. An isotope contains a hydrated value with the ability to view sanitized values and validation results.

