// const log = require('debug')('vapi:model')

const EventEmitter = require('events')
const isString = require('lodash/isString')
const every = require('lodash/every')
const isFunction = require('lodash/isFunction')
const isObject = require('lodash/isObject')

const ConfigSymbol = Symbol('Configs')
const EventSymbol = Symbol('Events')
const VALUES = Symbol('values')
const __installProperties__ = Symbol('__installProperties__')

const globalProperties = new Map()
const PROPERTIES = Symbol('Properties')

function * chainOfTheExtends (el) {
  let currentProtoEl
  const next = () => Object.getPrototypeOf(currentProtoEl !== undefined ? currentProtoEl : el)

  let r = []
  while ((currentProtoEl = next()) !== null) {
    r.push(currentProtoEl)
  }

  yield * r
}

class Model {
  constructor (initialData) {
    const chainOfTheDescriptions = [...chainOfTheExtends(this)].map(e => [e, e.constructor.properties]).reverse()
    const endDescription = {}

    chainOfTheDescriptions.map(([model, desc]) => {
      if (isObject(desc)) {
        Object.entries(desc).map(([propName, description]) => {
          endDescription[propName] = description
        })
      }
    })

    /* Defualt Options */
    Object.defineProperties(this, {
      [ConfigSymbol]: {
        writable: false,
        enumerable: false,
        value: Object.entries(endDescription)
      },
      [EventSymbol]: {
        writable: false,
        enumerable: false,
        value: new EventEmitter()
      },
      [Symbol.toStringTag]: {
        writable: true,
        enumerable: false,
        value: this.constructor.name
      },
      [VALUES]: {
        writable: false,
        enumerable: false,
        value: {}
      }
    })

    this[__installProperties__]()

    Object.assign(this, initialData)
  }

  on () { return this[EventSymbol].on.apply(this[EventSymbol], arguments) }
  once () { return this[EventSymbol].once.apply(this[EventSymbol], arguments) }
  emit () { return this[EventSymbol].emit.apply(this[EventSymbol], arguments) }
  removeAllListeners () { return this[EventSymbol].removeAllListeners.apply(this[EventSymbol], arguments) }
  removeListener () { return this[EventSymbol].removeListener.apply(this[EventSymbol], arguments) }

  isValid () {
    const validations = this[ConfigSymbol].map(([propertyName, description]) => {
      if (isFunction(description.validation)) {
        const result = description.validation(this[propertyName])
        return result
      } else {
        return null
      }
    }).filter(e => e !== null)

    return every(validations, Boolean)
  }

  [__installProperties__] () {
    this[ConfigSymbol].forEach(([propertyName, description]) => {
      Object.defineProperty(this, propertyName, {
        enumerable: description.transferable !== false,
        set: (value) => {
          if (description.alias) {
            this[description.alias] = value
            return
          }

          if (description.persistentValidation === true) {
            if (!description.validation(value)) {
              throw new TypeError(`Value to "${propertyName}" is not valid.`)
            }
          }

          this[VALUES][propertyName] = description.transform ? description.transform.apply(this, [value]) : value
        },
        get: () => {
          let toReturn
          if (description.alias) {
            toReturn = this[description.alias]
          } else
          if (!(propertyName in this[VALUES])) {
            toReturn = description.default
          } else {
            toReturn = this[VALUES][propertyName]
          }

          return toReturn
        }
      })
    })
  }

  toString () {
    // OLD: Object.prototype.toString.apply(this)
    return `[model ${this[Symbol.toStringTag]}]`
  }

  delete (propertyName) {
    delete this[VALUES][propertyName]
  }

  static parse (initialData) {
    return new this(initialData)
  }

  static defineProperties (properties) {
    Object.entries(properties).forEach(([propertyName, description]) => {
      this.defineProperty(propertyName, description)
    })
  }

  static defineProperty (propertyName, description) {
    if (!isString(propertyName)) throw new TypeError(`defineProperty: propertyName parameter is not a string.`)
    if (!isObject(description)) throw new TypeError(`defineProperty: description parameter is not an object.`)

    const {
      alias = undefined,
      default: _default,
      persistentValidation,
      transferable,
      transform,
      validation
    } = description

    this.properties[propertyName] = {
      alias,
      default: _default,
      persistentValidation,
      transferable,
      transform,
      validation
    }
  }
}

Object.defineProperties(Model, {
  [PROPERTIES]: {
    enumerable: false,
    get: function () {
      if (!globalProperties.has(this)) globalProperties.set(this, {})

      return globalProperties.get(this)
    }
  },
  'properties': {
    enumerable: false,
    get: function () {
      return this[PROPERTIES]
    }
  },
  'toString': {
    enumerable: false,
    writable: true,
    value: function () { return this.name || 'Model' }
  }
})

exports = module.exports
exports.default = Model
exports.Model = Model
