const isValidVarName = require('./isValidVarName')

const replacer = (key, value) => {
  if (value && value instanceof Object && value.constructor
    && value.constructor.name && value.constructor !== Object
    && value.constructor !== String && value.constructor !== Number
    && value.constructor !== Symbol && value.constructor !== Boolean
    && value.constructor !== Array && value.constructor !== Function
    ) {
    return {
      _class: value.constructor.name,
      _key: key,
      _value: replacer(Object.assign({}, value))
    }
  }
  return value
}
const reviver = (...classes) => {
  const lookup = {}
  classes.forEach(c => { lookup[c.name] = c.prototype })
  return (key, value) => {
    if (value instanceof Object && value._class && typeof value._class === 'string'
      && isValidVarName(value._class) && lookup[value._class]
      && typeof value._key === 'string' && value._value instanceof Object) {
      const prototype = lookup[value._class]
      const descriptors = Object.getOwnPropertyDescriptors(value._value)
      return Object.create(prototype, descriptors)
    }
    return value
  }
}
module.exports.serialize = (object)  => replacer(object)
module.exports.deserialize = (string, ...classes) => JSON.parse(string, reviver(...classes))
