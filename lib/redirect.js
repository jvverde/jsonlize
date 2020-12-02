const getAllPropertyDescriptors = require('./getAllPropertyDescriptors')

const isIterable = obj => obj && typeof obj[Symbol.iterator] === 'function'

const getAllDataProperties = obj => {
  return getAllPropertyDescriptors(obj)
    .filter(([name, desc]) => desc.value !== undefined) // Only consider data descriptors
    .map(([name]) => name) // map to name
}

module.exports = (obj, newref, oldref) => { // Redirect (recursively) references from oldref to newref
  const excluded = name => ['constructor', 'prototype', 'caller', 'callee', 'arguments'].includes(name)
  const map = new Map([[oldref, newref]]) // map oldref to newref
  const set = new Set()
  // console.log('map =>', map)
  // console.log('oldref =>', oldref)
  // console.log('newref =>', newref)
  // console.log('map[ol =>', map.get(oldref))
  getAllDataProperties(oldref) // And also map properties (even ones in prototypes)
    .filter(name => !excluded(name)) // exclude some well known descriptors
    .filter(name => !map.has(oldref[name])) // Don't overlap previous values
    .filter(name => name in newref) // Forget it if newref[name] doesn't exists
    .filter(name => 'object' === typeof oldref[name] || 'function' === typeof oldref[name])
    .forEach(name => {
      if (set.has(oldref[name])) { // Only if oldobj is a reference (= is already in the set)
        map.set(oldref[name], newref[name]) //map oldref to newref
      }
      set.add(oldref[name])
    })

  const visited = new Set() // This set is only used by f bellow to prevent loops
  return (function f(obj) { // we need a semicolon. Not ASI here
    if (!(obj instanceof Object)) return
    if (visited.has(obj)) return // prevent infinite loops
    visited.add(obj)
    getAllDataProperties(obj)
      .filter(name => !excluded(name))
      .forEach(name => {
        //console.log('name:', name)
        if (map.has(obj[name])) {
          const target = map.get(obj[name])
          // console.log('redirect', name, 'from', obj[name] ,'to', target)
          obj[name] = target
        } else {
          f(obj[name]) // go down on property
        }
      })
    // Falta os iterables
    if (obj instanceof Set)  {
      const newo = [...obj]
      obj.clear()
      newo.forEach(v => {
        // console.log('elem', v)
        if (map.has(v)) {
          // console.log('Has', v)
          obj.add(map.get(v))
        } else {
          f(v)
          obj.add(v)
        }
      })
    } else if (obj instanceof Map) {
      console.log('map:', map)
      console.log('+++++++++++++')
      console.log('obj:', obj)
      console.log('+++++++++++++')
      const newo = [...obj]
      console.log('entries:', newo)
      obj.clear()
      newo.forEach(([k, v]) => {
        console.log('k =>', k)
        console.log('v =>', v)
        if (map.has(v)) {
          console.log('Has', v)
          obj.set(k, map.get(v))
        } else {
          f(v)
          obj.set(k, v)
        }
      })
    }
    return obj
  })(obj)
}
