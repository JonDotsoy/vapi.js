# ![vapi](https://goo.gl/DH4cJW)
A javascript library that helps you create models in your applications.

> ### Await a second!
> Okay, this is my problem. Are there API generators in the backend but in the frontend?
>
> I want an easy library like any very similar to express.js or loopback. But this does not exist. Or if? Well, this repository contains a project that tries to solve it.
>
> — [@JonDotsoy][]

## Quick Start

    $ npm install --save vapi

```javascript
// MyFile.js
const {Model} = require('vapi')

class MyModel extends Model {}
```

## Development goals

1. [Adapter to models](docs/models.md)
    1. Validation by attributes
    2. Validation with `isValid()`
    2. Virtual attributes
2. ~~middlewares~~
3. plugins?
4. ~~data sources~~
5. validations
6. ~~querys~~
7. ~~routing~~
8. ~~Allow Make a SKD~~
9. ~~Offline Mode~~
    - ~~Pipe update~~
    - ~~Sync collection~~

## Brand Vapi
Vapi (Virtual API) is an open brand whereby this not have a restriction in you use. However it is suggested to use this with the following specifications.

* Use the name Vapi:
    * `Vapi`: The first letter uppercase.
    * `vapi`: all letters on lowercase.
    * `vapi.js`: Specific the javascript extension.


## License
This project is under a [MIT License](./LICENSE).

[@JonDotsoy]: https://github.com/JonDotsoy

