const EventEmitter = require('events')
const isString = require('lodash/isString')
const every = require('lodash/every')
const isFunction = require('lodash/isFunction')
const isObject = require('lodash/isObject')

const ConfigSymbol = Symbol('Configs')
const EventSymbol = Symbol('Events')
const VALUES = Symbol('values')

class Model {
  constructor () {
    Object.defineProperties(this,{
      [ConfigSymbol]: {
        writable: false,
        enumerable: false,
        value: this[ConfigSymbol] || new Map()
      },
      [EventSymbol]: {
        writable: false,
        enumerable: false,
        value: new EventEmitter()
      },
      [Symbol.toStringTag]: {
        writable: false,
        enumerable: false,
        value: this.constructor.name
      },
      [VALUES]:{
        writable: false,
        enumerable: false,
        value: {}
      }
    })
    this.installProperties()
  }

  on () { return this[EventSymbol].on.apply(this[EventSymbol], arguments) }
  once () { return this[EventSymbol].once.apply(this[EventSymbol], arguments) }
  emit () { return this[EventSymbol].emit.apply(this[EventSymbol], arguments) }
  removeAllListeners () { return this[EventSymbol].removeAllListeners.apply(this[EventSymbol], arguments) }
  removeListener () { return this[EventSymbol].removeListener.apply(this[EventSymbol], arguments) }

  isValid () {
    const validations = []
    const configs = this[ConfigSymbol].entries()

    for (let config = configs.next(); config.done !== true; config = configs.next()) {
      const [propertyName, description] = config.value

      if (isFunction(description.validation)) {
        const result = description.validation(this[propertyName])
        validations.push(result)
      }
    }

    return every(validations, Boolean)
  }

  installProperties () {
    const configs = this[ConfigSymbol].entries()

    for (let config = configs.next(); config.done !== true; config = configs.next()) {
      const [propertyName, description] = config.value

      Object.defineProperty(this, propertyName, {
        enumerable: true,
        set: (value) => {
          if (description.persistentValidation === true) {
            if (!description.validation(value)) {
              throw new TypeError(`Value to "${propertyName}" is not valid.`)
            }
          }

          this[VALUES][propertyName] = description.transform ? description.transform.apply(this, [value]) : value
        },
        get: () => {
          if (!(propertyName in this[VALUES])) return description.default
          return this[VALUES][propertyName]
        }
      })
    }
  }

  toString () {
    return Object.prototype.toString.apply(this)
  }

  delete (propertyName) {
    delete this[VALUES][propertyName]
  }

  static defineProperties (properties) {
    Object.entries(properties).forEach(([propertyName, description]) => {
      this.defineProperty(propertyName, description)
    })
  }

  static defineProperty (propertyName, description) {
    if (!isString(propertyName)) throw new TypeError(`defineProperty: propertyName parameter is not a string.`)
    if (!isObject(description)) throw new TypeError(`defineProperty: description parameter is not an object.`)

    if (!(ConfigSymbol in this.prototype)) this.prototype[ConfigSymbol] = new Map()

    this.prototype[ConfigSymbol].set(propertyName, description)
  }
}

Object.defineProperties(Model, {
  'toString': {
    enumerable: false,
    writable: true,
    value: function () {return this.name||'Model'}
  }
})

exports = module.exports
exports.default = Model
exports.Model = Model
