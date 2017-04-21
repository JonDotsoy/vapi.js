const transform = require('lodash/transform')
const concat = require('lodash/concat')

/**
 * Get parents constructors
 */
function * getPrototypesOf (elem, stopOn) {
  const prototype = Object.getPrototypeOf(elem)

  /* Stop On */
  if (prototype === null || prototype === undefined || elem === stopOn || elem === Object) return null

  yield prototype
  yield * getPrototypesOf(prototype, stopOn)

  return
}

function getDescriptionOf (obj, {stopOn} = {}) {
  const arrDescriptions = [...getPrototypesOf(obj, stopOn)]
    .map((prototype) => prototype.constructor.properties).reverse()

  return Object.assign({}, ...arrDescriptions)
}

/**
 * Transform a value by functions
 */
function transformValue (value, ..._transforms) {
  const transforms = concat(..._transforms)

  const {value: result} = transform(
    transforms,
    function (result, transformator) {
      if (transformator === undefined) return false

      result.value = transformator(result.value, result)
    },
    {value}
  )

  return result
}

function validationValue (value, ..._validations) {
  const validations = concat(..._validations)

  const {truthy} = transform(
    validations,
    function (result, validator) {
      const resultValidation = validator(result.value, result)

      if (resultValidation !== true) {
        result.truthy = false
      }

      // Stop if is false
      return result.truthy
    },
    {
      truthy: true,
      value
    }
  )

  return truthy
}

exports = module.exports
exports.getPrototypesOf = getPrototypesOf
exports.getDescriptionOf = getDescriptionOf
exports.transformValue = transformValue
exports.validationValue = validationValue
