const isClone = require('isClone')

const isIterable = obj => obj && typeof obj[Symbol.iterator] === 'function'
const basicTypes = [Number, String, Boolean]
const transform = (assembly, dismantle = v => v) => {
  return {
    dismantle,
    assembly
  }
}
const builtins = { // javascript builtin objects
  Number: transform(v => new Number(v)),
  String: transform(v => new String(v)),
  Boolean: transform(v => new Boolean(v)),
  Date: transform(v => new Date(v)),
  BigInt: transform(v => BigInt(v), v => v.toString()),
  RegExp: transform(
    v => {
      const exp = new RegExp(v.source, v.flags)
      if (v.lastIndex) exp.lastIndex = v.lastIndex
      return exp
    },
    v => {
      const { source, flags, lastIndex } = v
      return { source, flags, lastIndex }
    }
  ),
  Symbol: transform(v => Symbol(v), v => v.description),
  Error: transform(
    v => {
      const err = new Error(v.message || '')
      if (v.name) err.name = v.name
      return err
    },
    v => {
      const { message, name } = v
      return { message, name }
    }
  ),
  Set: transform(
    (v, compose) => new Set(v.map(e => compose(e))),
    (v, decompose) => [...v].map(v => decompose(v))
  ),
  Map: transform(
    (v, compose) => new Map(v.map(e => compose(e))),
    (v, decompose) => [...v].map(v => decompose(v))
  ),
  Int8Array: transform(v => new Int8Array(v), v => Array.from(v)),
  Uint8Array: transform(v => new Uint8Array(v), v => Array.from(v)),
  Int16Array: transform(v => new Int16Array(v), v => Array.from(v)),
  Uint16Array: transform(v => new Uint16Array(v), v => Array.from(v)),
  Int32Array: transform(v => new Int32Array(v), v => Array.from(v)),
  Uint32Array: transform(v => new Uint32Array(v), v => Array.from(v)),
  Float32Array: transform(v => new Float32Array(v), v => Array.from(v)),
  Float64Array: transform(v => new Float64Array(v), v => Array.from(v)),
  Uint8ClampedArray: transform(v => new Uint8ClampedArray(v), v => Array.from(v)),
  BigUint64Array: transform(
    (v, compose) => new BigUint64Array(v.map(e => compose(e))),
    (v, decompose) => Array.from(v).map(e => decompose(e))
  ),
  BigInt64Array: transform(
    (v, compose) => new BigInt64Array(v.map(e => compose(e))),
    (v, decompose) => Array.from(v).map(e => decompose(e))
  ),
  Function: transform(
    // Idea from https://ovaraksin.blogspot.com/2013/10/pass-javascript-function-via-json.html
    v => new Function('return ' + v)(),
    v => {
      const string = v.toString()
      if (string.indexOf('[native code]') > -1) {
        return v.name
      }
      return string
    }
  )
}

// Get descriptors of Object prototype
const protodescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({}))
const decompDescriptors = (descriptors) => {
  const newdescs = {}
  Object.entries(descriptors || {})
    // discard descriptors present in Object prototype
    .filter(([name, descriptor]) => !isClone(descriptor, protodescriptors[name]))
    .forEach(([name, descriptor]) => {
      if ('value' in descriptor) { // We only need to decompose value property
        descriptor.value = decompose(descriptor.value)
      }
      newdescs[name] = descriptor
    })
  // console.log('newdescs', newdescs)
  return newdescs
}

function isInstanceOf (obj, type) { // Check if object is instance of a given type
  while (obj) {
    if (obj.constructor && obj.constructor.name === type) return true
    obj = Object.getPrototypeOf(obj) // Go deeper on chain
  }
  return false
}
const bTypesNames = Object.keys(builtins) // Avoid to get it everytime
function getTypeValue (obj) {
  try { // Avoid TypeError: Number.prototype.valueOf requires that 'this' be a Number
    for (const typename of bTypesNames) {
      if (isInstanceOf(obj, typename)) {
        return {
          type: typename,
          value: builtins[typename].dismantle(obj)
        }
      }
    }
  } catch (e) {}
  return {}
}

// Gllbal properties
const gp2string = new Map([[undefined, 'undefined'], [Infinity, 'Infinity'], [NaN, 'NaN'], [Math, 'Math']])
const string2gp = new Map([['undefined', undefined], ['Infinity', Infinity], ['NaN', NaN], ['Math', Math]])

const decompose = (obj, isPrototype = false) => {
  if (gp2string.has(obj)) {
    return { _class: gp2string.get(obj) }
  } else if (obj === null || !obj.constructor || !obj.constructor.name
    || (typeof obj !== 'object' && basicTypes.includes(obj.constructor))) {
    return obj
  } else {
    const _class = obj.constructor.name
    // console.log('class', _class)
    if (builtins[_class]) {
      // console.log('dismantle')
      if (isPrototype && isIterable(obj)) {
        // console.log('isPrototype')
        return {
          _class,
          _value: []
        }
      }
      return {
        _class,
        _value: builtins[_class].dismantle(obj, decompose)
      }
    } else if (obj.constructor === Array || obj.constructor === Object) {
      // console.log('Array or Object')
      return {
        _class,
        _descriptors: decompDescriptors(Object.getOwnPropertyDescriptors(obj))
      }
    } else {
      let _value, _parent
      if (!isPrototype) { // Don't do this for prototypes
        if (obj instanceof Set) {
          _parent = 'Set'
          _value = [...obj].map(v => decompose(v))
        } else if (obj instanceof Map) {
          _parent = 'Map'
          _value = [...obj].map(v => decompose(v))
        } else {
          const { value, type } = getTypeValue(obj) // For cases where obj is an instance of sub class of a builtin type
          _value = value
          _parent = type
        }
      }
      const _descriptors = decompDescriptors(Object.getOwnPropertyDescriptors(obj))
      const _prototype = decompose(Object.getPrototypeOf(obj), true)
      return {
        _class,
        _parent,
        _value,
        _descriptors,
        _prototype
      }
    }
  }
}

const reconstruct = (obj, ...classes) => {
  const lookup = {}
  classes.forEach(c => { lookup[c.name] = c.prototype })

  const map = new Map()
  function compdesc (descriptors) {
    // compose/create descriptors
    Object.entries(descriptors || {}).forEach(([name, desc]) => {
      if ('value' in desc) {
        desc.value = compose(desc.value)
      }
    })
    return descriptors
  }

  function compose (obj) {
    if (obj && obj._class && string2gp.has(obj._class)) { return string2gp.get(obj._class) }
    try {
      if (obj && obj._class && /* Just to make sure */ typeof obj._class === 'string') {
        if (obj._descriptors) {
          if (obj._class === 'Array') {
            const prototype = Object.getPrototypeOf([])
            const descriptors = compdesc(obj._descriptors)
            return Object.create(prototype, descriptors)
          } else if (obj._class === 'Set') {
            const prototype = Object.getPrototypeOf(new Set())
            const descriptors = compdesc(obj._descriptors)
            return Object.create(prototype, descriptors)
          } else if (obj._class === 'Map') {
            const prototype = Object.getPrototypeOf(new Map())
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
            if (obj._parent && builtins[obj._parent]) {
              // Special cases where object is an instance of a sub class of a builtin object
              const parent = builtins[obj._parent].assembly(obj._value, compose)
              const base = new newobj.constructor(parent)
              return Object.assign(base, newobj)
            }
            return newobj
          } else {
            console.log("SHOULDN't HAPPEN")
          }
        } else if (builtins[obj._class]) {
          // for builtin objects
          const builtinValue = builtins[obj._class].assembly(obj._value, compose)
          if (obj._class === 'Function' && 'name' in builtinValue) {
            // temporary publish on global scope the named functions and classes
            if (map.has(builtinValue.name)) {
              map.get(builtinValue.name).push(global[builtinValue.name])
            } else {
              map.set(builtinValue.name, [global[builtinValue.name]])
            }
            global[builtinValue.name] = builtinValue
          }
          return builtinValue
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
      // }
    } catch (e) {
      console.warn(e)
    }
  }
  const result = compose(obj)
  ;[...map.entries()].forEach(([k, v]) => {
    // Clean global scope setting it to initial values (possible undefined)
    global[k] = v[0]
  })
  return result
}

function serialize (object) {
  if (arguments.length === 0) return
  return JSON.stringify(decompose(object))
}
const deserialize = (json, ...classes) => {
  return reconstruct(JSON.parse(json), ...classes)
}

module.exports.serialize = serialize
module.exports.deserialize = deserialize
