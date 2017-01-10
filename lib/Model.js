const EventEmitter = require('events')
const isString = require('lodash/isString')
const some = require('lodash/some')
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
      const [propName, description] = config.value

      if (isFunction(description.validation)) {
        const result = description.validation(this[propName])
        validations.push(result)
      }
    }

    return some(validations, Boolean)
  }

  installProperties () {
    const configs = this[ConfigSymbol].entries()

    for (let config = configs.next(); config.done !== true; config = configs.next()) {
      const [propName, description] = config.value

      Object.defineProperty(this, propName, {
        set: (value) => {
          if (description.persistentValidation === true && isFunction(description.validation)) {
            if (description.validation(value)) {
              throw new TypeError(`Value to ${propName} is not valid.`)
            }
          }

          this[Symbol.for(propName)] = value
        },
        get: () => {
          if (!(Symbol.for(propName) in this)) return description.default
          return this[Symbol.for(propName)]
        }
      })
    }
  }

  valueOf () {
    const e = {}
    const configs = this[ConfigSymbol].entries()

    for (let config = configs.next(); config.done !== true; config = configs.next()) {
      const [propName] = config.value

      // if (!isUndefined(this[propName])) e[propName] = this[propName]
      e[propName] = this[propName]
    }

    return e
  }

  toJSON () {
    return this.valueOf()
  }

  toString () {
    return Object.prototype.toString.apply(this)
  }

  delete (propName) {
    delete this[Symbol.for(propName)]
  }

  static defineProperties (props) {
    Object.entries(props).forEach(([propName, description]) => {
      this.defineProperty(propName, description)
    })
  }

  static defineProperty (propName, description) {
    if (!isString(propName)) throw new TypeError(`defineProperty: propName parameter is not a string.`)
    if (!isObject(description)) throw new TypeError(`defineProperty: description parameter is not an object.`)

    if (!(ConfigSymbol in this.prototype)) this.prototype[ConfigSymbol] = new Map()

    this.prototype[ConfigSymbol].set(propName, description)
  }
}

exports = module.exports
exports.default = Model
exports.Model = Model
