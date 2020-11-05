const replacer = (value) => {
  if (value && value instanceof Object && value.constructor && value.constructor.name ) {
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
  return value
}

const modify = (obj) => {
  if (obj && obj instanceof Object) {
    const keys = Object.keys(obj)
    if (keys.length) {
      const newobj = {}
      keys.forEach(k => {
        newobj[k] = replacer(obj[k])
      })
      return newobj
    } else {
      console.warn('No keys for', obj)
      return replacer(obj)
    }
  }
  return obj
}

const types = { // javascript builtin objects
  Date: v => new Date(v),
  Number: v => new Number(v),
  String: v => new String(v),
  Boolean: v => new Boolean(v),
  // Idea from https://ovaraksin.blogspot.com/2013/10/pass-javascript-function-via-json.html
  Function: v => new Function('return ' + v)()
}
const ktypes = Object.keys(types)

const reconstruct = (obj, ...classes) => {
  const lookup = {}
  classes.forEach(c => { lookup[c.name] = c.prototype })

  function compose (obj) {
    // console.log('obj', typeof obj, obj)
    if(obj && obj instanceof Object && obj._class && typeof obj._class === 'string' && obj._value !== undefined) {
      if (obj._class === 'Array') {
        return Object.keys(obj._value).map(k => compose(obj._value[k]))
      } else if (lookup[obj._class]) { // check if it is a user defined class
        const prototype = lookup[obj._class]
        const children = compose(obj._value)
        const descriptors = Object.getOwnPropertyDescriptors(children)
        return Object.create(prototype, descriptors)
      } else if (ktypes.includes(obj._class)) { // check if it is builtin javascript object
        return types[obj._class](obj._value)
      } else {
        const children = compose(obj._value)
        const descriptors = Object.getOwnPropertyDescriptors(children)
        return Object.create({}, descriptors)
      }
    } else if(obj && obj instanceof Object) {
      const newobj = new Object()
      for (i in obj) {
        newobj[i] = compose(obj[i])
      }
      return newobj
    }
    // if it is not an object return as is
    return obj
  }
  return compose(obj)
}

const serialize = object => {
  const modified = modify(object)
  return JSON.stringify(modified, (k,v) => {
    if (v instanceof Function) return v.toString()
    return v
  })
}
const deserialize = (json, ...classes) => {
  const modified = JSON.parse(json)
  return reconstruct(modified, ...classes)
}

module.exports.serialize = serialize
module.exports.deserialize = deserialize
