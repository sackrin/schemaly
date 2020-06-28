# Schemaly

This library is designed to help work with data objects by providing structure, validation, sanitization and policy driven access control. Situations where you may need this functionality include retrieving data from a database and restricting what the output should contain using user roles and scope. Processing request data from an unknown source and stripping out unexpected or unauthorised values. Creating universal data models to share on your client and server side projects to allow for shared sanitization + validation. A mixture of the previous examples to lock down and regulate data for serving, receiving and storing data.

Pretty much you can use this library to provide client side model and validation functionality and/or as a middleware to your node api REST or GraphQL endpoints.


## Installation
Install by using npm

```javascript
npm install --save @schemaly/async
npm install --save @schemaly/sync
```

or by using yarn
```javascript
yarn add @schemaly/async
yarn add @schemaly/sync
```
