const isValidVarName = require('./isValidVarName')

const modify = (obj) => {
  if (obj && obj instanceof Object) {
    // console.log('is obj:', obj)
    const keys = Object.keys(obj)
    if (keys.length) {
      const newobj = {}
      keys.forEach(k => {
        newobj[k] = replacer(obj[k])
      })
      return newobj
    } else {
      console.log('No keys for', obj)
      return replacer(obj)
    }
  }
  return obj
}
const replacer = (value) => {
  // console.log('k,v =', key, value)
  if (value && value instanceof Object && value.constructor
    && value.constructor.name // && value.constructor !== Object
    // && value.constructor !== String && value.constructor !== Number
    // && value.constructor !== Symbol && value.constructor !== Boolean
    //  && value.constructor !== Array && value.constructor !== Function
    ) {
    const _class = value.constructor.name
    let _value
    if (value instanceof Array) {
      _value = value.map(v => modify(v))
    } else {
      _value = ktypes.includes(_class) ? value : modify(Object.assign({}, value))
    }
    return {
      _class,
      _value
    }
  }
 //  console.log("Didn't replace", value)
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
const types = {
  Date: v => new Date(v),
  Number: v => new Number(v),
  String: v => new String(v),
  Boolean: v => new Boolean(v),
  Function: v => new Function(v)
}
const ktypes = Object.keys(types)

const reconstruct = (obj, ...classes) => {
  const lookup = {}
  classes.forEach(c => { lookup[c.name] = c.prototype })

  function f (obj) {
    console.log('obj', typeof obj)
    if(obj && obj instanceof Object && obj._class && typeof obj._class === 'string' && obj._value !== undefined) {
      if (obj._class === 'Array') {
        return Object.keys(obj._values).map(k => f(obj._values[k]))
      } else if (lookup[obj._class]) {
        const prototype = lookup[obj._class]
        const children = f(obj._value)
        const descriptors = Object.getOwnPropertyDescriptors(children)
        return Object.create(prototype, descriptors)
      } else if (ktypes.includes(obj._class)) {
        return types[obj._class](obj._value)
      }
    } else if(obj && obj instanceof Object) {
      const newobj = new Object()
      for (i in obj) {
        newobj[i] = f(obj[i])
      }
      return newobj
    }
    return obj
  }
  return f(obj)
}

module.exports.serialize = (object)  => modify(object)
// module.exports.deserialize = (string, ...classes) => JSON.parse(string, reviver(...classes))
module.exports.deserialize = (obj, ...classes) => reconstruct(obj, ...classes)
