const Model = require('./Model').Model

exports = module.exports = {}

const descriptionCirculaVapi = { enumerable: false, writable: false, value: exports }

Object.defineProperties(exports, {
  "Model": {
    enumerable: true,
    writable: false,
    value: Model
  },
  "Vapi": descriptionCirculaVapi,
  "vapi": descriptionCirculaVapi,
  [Symbol.toStringTag]: {
    enumerable: false,
    writable: false,
    value: "Vapi"
  },
  "toString": {
    enumerable: false,
    writable: false,
    value: () => "Vapi"
  },
  "toJSON": {
    enumerable: false,
    writable: false,
    value: () => undefined,
  }
})

