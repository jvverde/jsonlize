// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
const isClone = require('isclone')
const builtins = require('./builtins')
const { string2primitive } = require('./primitives')
const redirect = require('./redirect')

const reconstruct = (obj) => {
  const map = new Map()
  const registerGlobal = (name, value) => { // set a 'value' on global scope under the 'name'
    if (map.has(name)) {
      map.get(name).push(global[name])
    } else {
      map.set(name, [global[name]])
    }
    global[name] = value
  }
  const cleanGlobal = () => [...map.entries()].forEach(([k, v]) => {
    // Clean global scope setting it to initial values (possible undefined)
    global[k] = v[0]
  })
  function compdesc (descriptors = {}) {
    Object.entries(descriptors || {})
      .forEach(([name, desc]) => {
        for (const key of ['value', 'get', 'set']) {
          if (desc && key in desc) {
            desc[key] = compose(desc[key])
          }
        }
      })
    return descriptors
  }
  const applyProperties = (newobj, descriptors = {}) => {
    Object.entries(descriptors)
      .forEach(([name, props]) => {
        Object.defineProperty(newobj , name, props)
      })
    return newobj
  }
  const refs = new Map()
  function compose (obj) {
    // console.log('obj._class =', obj._class)
    const register = newobj => {
      if (obj && '_id' in obj) {
        // console.log('Register ref', obj._id, obj)
        refs.set(obj._id, newobj)
      }
    }
    const registerAndCompose = (newobj) => {
      register(newobj)
      const descriptors = compdesc(obj._descriptors)
      applyProperties(newobj, descriptors)
      return newobj
    }
    const createObject = prototype => {
      const newobj = Object.create(prototype)
      return registerAndCompose(newobj)
    }
    // console.log('obj:', obj)
    if (!!obj === false) {
      return obj
    } else if (obj._ref !== undefined) {
      // console.log('Look for ref:', obj._ref, obj)
      if (refs.has(obj._ref)) {
        // console.log('Found ref', obj._ref)
        return refs.get(obj._ref)
      }
      console.warn(`Didn't find a ref ${obj._ref} in refs map`)
      return obj
    } else if (obj._class !== undefined && typeof obj._class === 'string') {
      if (string2primitive.has(obj._class)) {
        return string2primitive.get(obj._class)
      } else if (obj._class === 'Set') {
        const set = new Set()
        registerAndCompose(set)
        const newset = builtins[obj._class].assembly(obj._value, compose)
        newset.forEach((v) => {
          set.add(v)
        })
        return set
      } else if (obj._class === 'Map') {
        const map = new Map()
        registerAndCompose(map)
        const newmap = builtins[obj._class].assembly(obj._value, compose)
        newmap.forEach((v, k) => {
          map.set(k, v)
        })
        return map
      } else if (obj._class === 'Array') {
          return registerAndCompose([])
      } else if (obj._class === 'BigInt64Array') {
          const len = (obj._value || []).length
          return registerAndCompose(new BigInt64Array(len))
      } else if (obj._class === 'BigUint64Array') {
          const len = (obj._value || []).length
          return registerAndCompose(new BigUint64Array(len))
      } else if (obj._class === 'Object') {
        const prototype = compose(obj._prototype)
        const newobj = prototype !== null ? {} : Object.prototype // for classes
        return registerAndCompose(newobj)
      } else if (builtins[obj._class]) { // for any other builtin objects
        const builtinValue = builtins[obj._class].assembly(obj._value, compose)
        if (obj._class === 'Function' && builtinValue !== undefined && builtinValue.name) {
          // temporary publish named Functions (and Classes as well) on global scope
          registerGlobal(builtinValue.name, builtinValue)
        }
        return registerAndCompose(builtinValue)
      } else if (obj._parent && builtins[obj._parent]) {
        // Special cases where object is an instance of a sub class of a builtin object
        const prototype = compose(obj._prototype)
        const newobj = createObject(prototype)
        const parentValue = builtins[obj._parent].assembly(obj._value, compose)
        try {
          //console.log('newo => ', newobj)
          const base = new newobj.constructor(parentValue)
          //console.log('base => ', base)
          const res = Object.assign(base, newobj)
          //console.log('res  => ', res)
          redirect(res, res, newobj)
          //console.log('re2  => ', res)
          return res
        } catch (e) {
          console.warn('Error while trying to create a instance of', (newobj.constructor || {}).name)
          console.warn(e)
          return newobj
        }
      } else if (obj._prototype !== undefined) {
        const prototype = compose(obj._prototype)
        const newobj = createObject(prototype)
        return newobj
      } else {
        console.log("SHOULDN't HAPPEN")
      }
    }
    return obj
    // if (lookup[obj._class]) { // check if it is a user defined class
    //  const prototype = lookup[obj._class]
    //  const children = compose(obj._value)
    //  const descriptors = Object.getOwnPropertyDescriptors(children)
    //  return Object.create(prototype, descriptors)
    // }
  }
  const result = compose(obj)
  cleanGlobal()
  return result
}

module.exports = reconstruct
