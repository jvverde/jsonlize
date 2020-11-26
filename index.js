// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
const isClone = require('isClone')
const builtins = require('./lib/builtins')

const isIterable = obj => obj && typeof obj[Symbol.iterator] === 'function'
const basicTypes = [Number, String, Boolean]

// Get default descriptors of Object prototype
const defaultdescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({}))

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

// Global properties
const gp2string = new Map([[undefined, 'undefined'], [Infinity, 'Infinity'], [NaN, 'NaN'], [Math, 'Math']])
const string2gp = new Map([['undefined', undefined], ['Infinity', Infinity], ['NaN', NaN], ['Math', Math]])

const deconstruct = (obj) => {
  const decompDescriptors = (descriptors) => {
    const newdescs = {}
    Object.entries(descriptors || {})
      // discard descriptors present in default Object prototype
      .filter(([name, descriptor]) => !isClone(descriptor, defaultdescriptors[name]))
      .forEach(([name, descriptor]) => {
        for (const key of ['value', 'get', 'set']) {
          if (key in descriptor) { // We only need to decompose these 3 properties
            if (key === 'value' || descriptor[key] === undefined) {
              descriptor[key] = decompose(descriptor[key])
            } else {
              descriptor[key] = {
                 _class: 'Function',
                _value: descriptor[key].toString().replace(/^[^(]+/,'function') //.replace(/^[sg]et /,'function ')
              }
            }
          }
        }
        newdescs[name] = descriptor
      })
    // console.log('newdescs', newdescs)
    return newdescs
  }

  const memoir = new Map()
  let id = 0

  const decompose = (obj, isPrototype = false) => {
    if (gp2string.has(obj)) {
      return { _class: gp2string.get(obj) }
    } else if (obj === null || !obj.constructor || !obj.constructor.name
      || (typeof obj !== 'object' && basicTypes.includes(obj.constructor))) {
      return obj
    } else {
      const _class = obj.constructor.name
      if (builtins[_class]) {
        if (isPrototype && isIterable(obj)) {
          return {
            _class,
            _value: []
          }
        }
        return {
          _class,
          _value: builtins[_class].dismantle(obj, decompose)
        }
      } else if (obj.constructor === Array /*|| obj.constructor === Object*/) {
        let _id
        if (!isPrototype) { // Don't do this for prototypes
          if (memoir.has(obj)) {
            // console.log('Found memoir', obj, '=>', memoir.get(obj))
            return {
              _ref: memoir.get(obj)
            }
          }
          _id = id++
          // console.log('memoir', obj, '=>', _id)
          memoir.set(obj, _id)
        }
        return {
          _id,
          _class,
          _prototype: decompose(Object.getPrototypeOf(obj), true),
          _descriptors: decompDescriptors(Object.getOwnPropertyDescriptors(obj))
        }
      } else {
        let _value, _parent, _id
        if (!isPrototype) { // Don't do this for prototypes
          if (memoir.has(obj)) {
            // console.log('Found memoir(2)', obj, '=>', memoir.get(obj))
            return {
              _ref: memoir.get(obj)
            }
          }
          _id = id++
          // console.log('memoir(2)', obj, '=>', _id)
          memoir.set(obj, _id)
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
          _id,
          _class,
          _parent,
          _value,
          _descriptors,
          _prototype
        }
      }
    }
  }
  return decompose(obj)
}

const reconstruct = (obj, ...classes) => {
  const lookup = {}
  classes.forEach(c => { lookup[c.name] = c.prototype })

  const map = new Map()
  function compdesc (descriptors, only) {
    // compose/create descriptors
    const newdesc = {}
    Object.entries(descriptors || {})
      .forEach(([name, desc]) => {
      for (const key of ['value', 'get', 'set']) {
        if (key in desc) {
          desc[key] = compose(desc[key])
        }
      }
      newdesc[name] = desc
    })
    return newdesc
  }
  const applyProperties = (newobj, descriptors) => {
    Object.entries(descriptors)
      .forEach(([name, props]) => {
        Object.defineProperty(newobj , name, props)
      })
    return newobj
  }
  const refs = new Map()
  function compose (obj) {
    const registerAndCompose = (newobj) => {
      if (typeof obj === 'object' && '_id' in obj) {
        refs.set(obj._id, newobj)
      }
      const descriptors = compdesc(obj._descriptors)
      applyProperties(newobj, descriptors)
      return newobj
    }
    const createObject = prototype => {
      const newobj = Object.create(prototype)
      return registerAndCompose(newobj)
    }

    if (obj && obj._class && string2gp.has(obj._class)) { return string2gp.get(obj._class) }
    try {
      if (obj && typeof obj === 'object' && '_ref' in obj) {
        if (refs.has(obj._ref)) {
          return refs.get(obj._ref)
        }
        console.warn(`Didn't find a ref ${obj._ref} in refs map`)
        return obj
      } else if (obj && typeof obj === 'object' && obj._class && /* Just to make really sure */ typeof obj._class === 'string') {
        if (obj._descriptors) {
          if (obj._class === 'Array') {
            const prototype = Object.getPrototypeOf([])
            return createObject(prototype)
          } else if (obj._class === 'Set') {
            const prototype = Object.getPrototypeOf(new Set())
            return createObject(prototype)
          } else if (obj._class === 'Map') {
            const prototype = Object.getPrototypeOf(new Map())
            return createObject(prototype)
          } else if (obj._class === 'Object') {
            const prototype = compose(obj._prototype)
            const newobj = prototype !== null ? {} : Object.prototype // for classes
            return registerAndCompose(newobj)
          } else if (obj._prototype !== undefined) {
            const prototype = compose(obj._prototype)
            const newobj = createObject(prototype)
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
          if (obj._class === 'Function' && builtinValue && builtinValue.name) {
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
  return JSON.stringify(deconstruct(object))
}
const deserialize = (json, ...classes) => {
  return reconstruct(JSON.parse(json), ...classes)
}

module.exports.serialize = serialize
module.exports.deserialize = deserialize
