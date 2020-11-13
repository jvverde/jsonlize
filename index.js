const isClone = require('isClone')
const basicTypes = [Number, String, Boolean]
const builtinTypes = { // javascript builtin objects
  Date: v => new Date(v),
  Number: v => new Number(v),
  String: v => new String(v),
  Boolean: v => new Boolean(v),
  BigInt: v => BigInt(v),
  Symbol: v => Symbol(v),
  Error: v => {
    const err = new Error(v.message || '')
    if (v.name) err.name = v.name
    return err
  },
  RegExp: v => {
    const exp = new RegExp(v.source, v.flags)
    if (v.lastIndex) exp.lastIndex = v.lastIndex
    return exp
  },
  Set: (v, compose) => new Set(v.map(e => compose(e))),
  Map: (v, compose) => new Map(v.map(e => compose(e))),
  Int8Array: v => new Int8Array(v),
  Uint8Array: v => new Uint8Array(v),
  Int16Array: v => new Int16Array(v),
  Uint16Array: v => new Uint16Array(v),
  Int32Array: v => new Int32Array(v),
  Uint32Array: v => new Uint32Array(v),
  Float32Array: v => new Float32Array(v),
  Float64Array: v => new Float64Array(v),
  Uint8ClampedArray: v => new Uint8ClampedArray(v),
  BigUint64Array: (v, compose) => new BigUint64Array(v.map(e => compose(e))),
  BigInt64Array: (v, compose) => new BigInt64Array(v.map(e => compose(e))),
  // Idea from https://ovaraksin.blogspot.com/2013/10/pass-javascript-function-via-json.html
  Function: v => new Function('return ' + v)()
}

const weirdTypes = {
  Function: v => {
    const string = v.toString()
    if (string.indexOf('[native code]') > -1) {
      return v.name
    }
    return string
  },
  BigInt: v => v.toString(),
  Symbol: v => v.description,
  Error: v => {
    const { message, name } = v
    return { message, name }
  },
  RegExp: v => {
    const { source, flags, lastIndex } = v
    return { source, flags, lastIndex }
  },
  Set: v => [...v].map(v => replacer(v)),
  Map: v => [...v].map(v => replacer(v)),
  Int8Array: v => Array.from(v),
  Uint8Array: v => Array.from(v),
  Int16Array: v => Array.from(v),
  Uint16Array: v => Array.from(v),
  Int32Array: v => Array.from(v),
  Uint32Array: v => Array.from(v),
  Float32Array: v => Array.from(v),
  Float64Array: v => Array.from(v),
  Uint8ClampedArray: v => Array.from(v),
  BigUint64Array: v => Array.from(v).map(e => replacer(e)),
  BigInt64Array: v => Array.from(v).map(e => replacer(e))
}

// Get descriptors of Object prototype
const protodescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({}))

const repdesc = (descriptors) => {
  const newdescs = {}
  Object.entries(descriptors || {})
    // discard descriptors of Object prototype
    .filter(([name, desc]) => !isClone(desc, protodescriptors[name]))
    .forEach(([name, desc]) => {
      if ('value' in desc) {
        desc.value = replacer(desc.value)
      }
      newdescs[name] = desc
    })
  return newdescs
}

const replacer = (obj) => {
  if (obj === undefined) { return { _class: 'undefined' } }
  // if (obj && obj instanceof Object && obj.constructor && obj.constructor.name ) {
  // Change from above test as it reveals the BigInt is not an Object!!!
  if (obj && obj.constructor && obj.constructor.name
    // don't replace if obj is a basic type, unless it is defined as an object (ex: let i = new Number())
    && (!basicTypes.includes(obj.constructor) || obj instanceof Object)){
    const _class = obj.constructor.name
    if (weirdTypes[_class]) {
      //idea from https://golb.hplar.ch/2018/09/javascript-bigint.html
      return {
        _class,
        _value: weirdTypes[_class](obj)
      }
    } else if (builtinTypes[_class]) {
      return {
        _class,
        _value: obj
      }
    } else if(obj.constructor === Array || obj.constructor === Object) {
      return {
        _class,
        _descriptors: repdesc(Object.getOwnPropertyDescriptors(obj))
      }
    } else {
      return {
        _class,
        _descriptors: repdesc(Object.getOwnPropertyDescriptors(obj)),
        _prototype: replacer(Object.getPrototypeOf(obj))
      }
    }
  } else {
    return obj
  }
}

const reconstruct = (obj, ...classes) => {
  const lookup = {}
  classes.forEach(c => { lookup[c.name] = c.prototype })

  function compdesc (descriptors) {
    Object.entries(descriptors || {}).forEach(([name, desc]) => {
      if ('value' in desc) {
        desc.value = compose(desc.value)
      }
    })
    return descriptors
  }
  function compose (obj) {
    if (obj && obj._class === 'undefined') { return undefined }
    else if (obj && obj._class && typeof obj._class === 'string') {
      if (obj._value !== undefined && builtinTypes[obj._class]) {
        return builtinTypes[obj._class](obj._value, compose)
      } else if (obj._descriptors) {
        if (obj._class === 'Array') {
          const prototype = Object.getPrototypeOf([])
          const descriptors = compdesc(obj._descriptors)
          return Object.create(prototype, descriptors)
        } else if (obj._class === 'Object') {
          const prototype = Object.getPrototypeOf({})
          const descriptors = compdesc(obj._descriptors)
          return Object.create(prototype, descriptors)
        } else if (obj._prototype) {
          const proto = compose(obj._prototype)
          const parent = proto.constructor instanceof Function ? new proto.constructor() : proto
          const prototype = Object.getPrototypeOf(parent)
          const descriptors = compdesc(obj._descriptors)
          const newobj = Object.create(prototype, descriptors)
          return newobj
        } else {
          console.log("SHOULDN't HAPPEN")
        }
      } else {
        console.log("SHOULDN't HAPPEN EITHER")
      }
    }
    return obj
      // if (lookup[obj._class]) { // check if it is a user defined class
      //  const prototype = lookup[obj._class]
      //  const children = compose(obj._value)
      //  const descriptors = Object.getOwnPropertyDescriptors(children)
      //  return Object.create(prototype, descriptors)
      //}
  }
  return compose(obj)
}

const serialize = object => {
  return JSON.stringify(replacer(object))
}
const deserialize = (json, ...classes) => {
  return reconstruct(JSON.parse(json), ...classes)
}

module.exports.serialize = serialize
module.exports.deserialize = deserialize
