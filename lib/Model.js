// const log = require('debug')('vapi:model')

const EventEmitter = require('events')
const isString = require('lodash/isString')
const every = require('lodash/every')
const isFunction = require('lodash/isFunction')
const isObject = require('lodash/isObject')
const concat = require('lodash/concat')

const utils = require('./utils')

const ConfigSymbol = Symbol('Configs')
const EventSymbol = Symbol('Events')
const VALUES = Symbol('values')
const __installProperties__ = Symbol('__installProperties__')

const globalProperties = new Map()
const PROPERTIES = Symbol('Properties')

class Model {
  constructor (initialData) {
    const descriptions = utils.getDescriptionOf(this, {stopOn: Model.prototype})

    /* Defualt Options */
    Object.defineProperties(this, {
      [ConfigSymbol]: {
        writable: false,
        enumerable: false,
        value: Object.entries(descriptions)
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

  isValid (cb) {
    const resultValidations = this[ConfigSymbol]
      .map(([propertyName, description]) => {
        if (this[propertyName] instanceof Model) {
          return this[propertyName].isValid()
        }

        if (description.validation === undefined) return true

        const validations = concat([], description.validation)
        return utils.validationValue(this[propertyName], validations)
      })

    return every(resultValidations, Boolean)
  }

  [__installProperties__] () {
    this[ConfigSymbol].forEach(([propertyName, description]) => {
      const transforms = concat([], description.transform)
      const validations = concat([], description.validation).filter(isFunction)

      Object.defineProperty(this, propertyName, {
        enumerable: description.transferable !== false,
        set: (value) => {
          if (description.persistentValidation === true) {
            if (value instanceof Model) {
              if (!value.isValid()) {
                throw new Error(`Model "${propertyName}" is not valid.`)
              }
            } else
            if (!utils.validationValue(value, validations)) {
              throw new TypeError(`Value to "${propertyName}" is not valid.`)
            }
          }

          const valueEnd = utils.transformValue(value, transforms)

          if (description.alias) {
            this[description.alias] = valueEnd
          } else {
            this[VALUES][propertyName] = valueEnd
          }
        },
        get: () => {
          if (description.alias) {
            return this[description.alias]
          } else
          if (!(propertyName in this[VALUES])) {
            return description.default
          } else {
            return this[VALUES][propertyName]
          }
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

  static defineProperty (propertyName, description, blockProperty = false) {
    if (!isString(propertyName)) throw new TypeError(`defineProperty: propertyName parameter is not a string.`)
    if (!isObject(description)) throw new TypeError(`defineProperty: description parameter is not an object.`)

    const {
      alias = undefined,
      default: _default,
      isModel,
      persistentValidation,
      transferable,
      transform,
      validation
    } = description

    const descriptor = Object.getOwnPropertyDescriptor(this.properties, propertyName)
    if (descriptor !== undefined) {
      if (descriptor.writable === false) {
        throw new Error(`not is possible redefined the "${propertyName}" property.`)
      }
    }

    Object.defineProperty(this.properties, propertyName, {
      enumerable: true,
      writable: blockProperty !== true,
      value: {
        alias,
        default: _default,
        isModel: isModel === true,
        persistentValidation,
        transferable,
        transform,
        validation
      }
    })
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
