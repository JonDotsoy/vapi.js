
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

exports = module.exports
exports.getPrototypesOf = getPrototypesOf
exports.getDescriptionOf = getDescriptionOf

