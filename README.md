# ![vapi](https://goo.gl/hhHdbU)
[![Package Quality](http://npm.packagequality.com/shield/vapi.svg)](http://packagequality.com/#?package=vapi)
[![npm](https://img.shields.io/npm/v/vapi.svg)](https://github.com/JonDotsoy/vapi)

A javascript library that helps you create models in your applications.

**Features:**

- [x] Making a class model
- [x] Define Properties
- [x] Data validation
- [ ] Clone data


## Quick Start

Using npm:

    $ npm install --save vapi

In Node.js:

```javascript
// /app/models/MyModel.js
const {Model} = require('vapi')
```

## Documentation
- [Models](./docs/Models.md)
- [API](./docs/API.md)

## Quick Examples
```javascript
class Person extends Model {}
// Define properties to Person model.
Person.defineProperty('first', { alias: 'name' })
Person.defineProperty('name', {
    transform: require('lodash/toLower')
})

class User extends Model {}
// Define properties to User model.
User.defineProperties({
    'username': {
        transform: require('lodash/toLower')
    },
    'password': {
        validation: (v) => /^[a-z|0-9]{9,15}$/.test(v)
    },
    'person': {}
})

// Create an instance of the User model.
const cat = new User({
    username: 'UserA',
    password: '1234', // Bad Password
    person: new Person({
        name: 'Julio'
    })
})

// Validation
if (cat.isValid()) {
    // you code if is valid.
} else {
    // you code of is not valid.
}

// End Cat state
// cat => 
// {
//   "username": "usera",
//   "password": "1234",
//   "person": {
//     "first": "julio",
//     "name": "julio"
//   }
// }
```

## Brand Vapi
Vapi ~~(Virtual API)~~ is an open brand whereby this not have a restriction in you use. However it is suggested to use this with the following specifications.

* Use the name Vapi:
    * `Vapi`: The first letter uppercase.
    * `vapi`: all letters on lowercase.
    * `vapi.js`: Specific the javascript extension.


## License
This project is under a [MIT License](./LICENSE).
