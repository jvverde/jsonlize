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
  Function: v => v.toString(),
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


const replacer = (obj) => {
  // if (obj && obj instanceof Object && obj.constructor && obj.constructor.name ) {
  // Change from above test as it reveals the BigInt is not an Object!!!
  if (obj && obj.constructor && obj.constructor.name
    // don't replace if obj is a basic type, unless it is defined as an object (ex: let i = new Number())
    && (!basicTypes.includes(obj.constructor) || obj instanceof Object)
  ) {
    const _class = obj.constructor.name
    let _value
    if (obj instanceof Array) {
      _value = obj.map(v => replacer(v))
    } else if (weirdTypes[_class]) {
      //idea from https://golb.hplar.ch/2018/09/javascript-bigint.html
      _value = weirdTypes[_class](obj)
    } else if (builtinTypes[_class]) {
      _value =  obj
    } else {
      _value = modify(Object.assign({}, obj))
    }
    return {
      _class,
      _value
    }
  }
  return obj
}

const modify = (obj) => {
  if (obj && obj instanceof Object) {
    const keys = Object.keys(obj)
    const newobj = {}
    keys.forEach(k => {
      newobj[k] = replacer(obj[k])
    })
    return newobj
  } else if (obj && obj.constructor && !basicTypes.includes(obj.constructor) && obj.constructor.name) {
    console.log('Special case for', obj, obj.constructor)
    return replacer(obj)
  } else {
    console.log('Do nothing for', obj)
  }
  return obj
}


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
      } else if (builtinTypes[obj._class]) { // check if it is builtin javascript object
        return builtinTypes[obj._class](obj._value, compose)
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
  return JSON.stringify(replacer(object))
}
const deserialize = (json, ...classes) => {
  return reconstruct(JSON.parse(json), ...classes)
}

module.exports.serialize = serialize
module.exports.deserialize = deserialize
