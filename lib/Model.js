const EventEmitter = require('events')
const isString = require('lodash/isString')
const every = require('lodash/every')
const isFunction = require('lodash/isFunction')
const isObject = require('lodash/isObject')

const ConfigSymbol = Symbol('Configs')
const EventSymbol = Symbol('Events')

class Model {
  constructor () {
    this[ConfigSymbol] = this[ConfigSymbol] || new Map()
    this[EventSymbol] = new EventEmitter()

    this[Symbol.toStringTag] = this.constructor.name

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
        set: (value) => {
          if (description.persistentValidation === true) {
            if (!description.validation(value)) {
              throw new TypeError(`Value to "${propertyName}" is not valid.`)
            }
          }

          this[Symbol.for(propertyName)] = description.transform ? description.transform(value) : value
        },
        get: () => {
          if (!(Symbol.for(propertyName) in this)) return description.default
          return this[Symbol.for(propertyName)]
        }
      })
    }
  }

  valueOf () {
    const e = {}
    const configs = this[ConfigSymbol].entries()

    for (let config = configs.next(); config.done !== true; config = configs.next()) {
      const [propertyName] = config.value

      // if (!isUndefined(this[propertyName])) e[propertyName] = this[propertyName]
      e[propertyName] = this[propertyName]
    }

    return e
  }

  toJSON () {
    return this.valueOf()
  }

  toString () {
    return Object.prototype.toString.apply(this)
  }

  delete (propertyName) {
    delete this[Symbol.for(propertyName)]
  }

  static defineProperties (props) {
    Object.entries(props).forEach(([propertyName, description]) => {
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

exports = module.exports
exports.default = Model
exports.Model = Model
