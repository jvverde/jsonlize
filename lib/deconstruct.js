// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
const isClone = require('isClone')
const builtins = require('./builtins')
const { primitive2string } = require('./primitives')

const isIterable = obj => obj && typeof obj[Symbol.iterator] === 'function'
const basicTypes = [Number, String, Boolean]

// Get default descriptors of Object prototype
const defaultdescriptors = Object.getOwnPropertyDescriptors(Object.prototype)


function isInstanceOf (obj, type) { // Check if object is instance of a given type
  while (obj) {
    if (obj.constructor && obj.constructor.name === type) return true
    obj = Object.getPrototypeOf(obj) // Go deeper on chain
  }
  return false
}
const bTypesNames = Object.keys(builtins) // Avoid to get it everytime
function  builtinTypeValue (obj) {
  try { // Avoid TypeError: Number.prototype.valueOf requires that 'this' to be a Number
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

const deconstruct = (obj) => {
  const decompDescriptors = (descriptors, except = defaultdescriptors) => {
    const filtered = descriptors ? {} : descriptors
    Object.entries(descriptors || {})
      .filter(([name]) => name !== 'prototype') // ignore prototypes is descriptores
      // Also discard descriptors present in except
      .filter(([name, descriptor]) => !isClone(descriptor, except[name]))
      .forEach(([name, descriptor]) => {
        for (const key of ['value', 'get', 'set']) { // We only need to decompose these 3 descriptors properties
          if (key in descriptor) {
            descriptor[key] = decompose(descriptor[key])
          }
        }
        filtered[name] = descriptor
      })
    // console.log('newdescs', newdescs)
    return filtered
  }

  const memoir = new Map()
  let id = 0
  const getRef = obj => {
    if (memoir.has(obj)) {
      return {
        _ref: memoir.get(obj)
      }
    }
    memoir.set(obj, ++id)
    return id
  }
  const decompose = (obj, isPrototype = false) => {
    if (primitive2string.has(obj)) {
      return { _class: primitive2string.get(obj) }
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
        const ref = getRef(obj)
        if (ref instanceof Object) return ref
        const _id = ref
        const _descriptors = decompDescriptors(Object.getOwnPropertyDescriptors(obj), builtins[_class].descriptors)
        const _value = builtins[_class].dismantle(obj, decompose)
        return {
          _id,
          _class,
          _descriptors,
          _value
        }
      } else if (Array === obj.constructor /*|| obj.constructor === Object*/) {
        const ref = getRef(obj)
        if (ref instanceof Object) return ref
        const _id = ref
        const _descriptors = decompDescriptors(Object.getOwnPropertyDescriptors(obj))
        return {
          _id,
          _class,
          _descriptors
        }
      } else {
        let _value, _parent
        const ref = getRef(obj)
        if (ref instanceof Object) return ref
        const _id = ref

        if (!isPrototype) { // Don't do this for prototypes

          if (obj instanceof Set) {
            _parent = 'Set'
            _value = [...obj].map(v => decompose(v))
          } else if (obj instanceof Map) {
            _parent = 'Map'
            _value = [...obj].map(v => decompose(v))
          } else {
            const { value, type } = builtinTypeValue(obj) // For cases where obj is an instance of sub class of a builtin type
            _value = value // could be undefined
            _parent = type // could be undefined
          }
        }
        const _prototype = decompose(Object.getPrototypeOf(obj), true)
        const _descriptors = decompDescriptors(Object.getOwnPropertyDescriptors(obj))
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

module.exports = deconstruct
