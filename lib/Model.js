const isString = require('lodash/isString')
const isObject = require('lodash/isObject')
const ConfigSymbol = Symbol('Configs')

class Model {
  constructor () {
    this[ConfigSymbol] = this[ConfigSymbol] || new Map()

    this[Symbol.toStringTag] = this.constructor.name

    this.installProperties()
  }

  installProperties () {
    const configs = this[ConfigSymbol].entries()

    for (let config = configs.next(); config.done !== true; config = configs.next()) {
      const [propName, description] = config.value

      Object.defineProperty(this, propName, {
        set: (value) => {
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
