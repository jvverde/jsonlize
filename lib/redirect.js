const getAllPropertyDescriptors = require('./getAllPropertyDescriptors')

const getAllDataProperties = obj => {
  return getAllPropertyDescriptors(obj)
    .filter(([name, desc]) => desc.value !== undefined) // Only consider data descriptors
    .map(([name]) => name) // map to name
}

module.exports = (obj, newref, oldref) => { // Redirect (recursively) references from oldref to newref
  const excluded = name => ['constructor', 'prototype', 'caller', 'callee', 'arguments'].includes(name)
  const map = new Map([[oldref, newref]]) // map oldref to newref
  getAllDataProperties(oldref) // And also map properties (even ones in prototypes)
    .filter(name => !excluded(name)) // exclude soem well known descriptors
    .filter(name => !map.has(oldref[name])) // Don't overlap previous values
    .filter(name => name in newref) // Forget it if newref[name] doesn't exists
    .forEach(name => map.set(oldref[name], newref[name])) //map oldref to newref

  const set = new Set() // This set is only used by f bellow to prevent loops
  ;(function f(obj) { // we need a semicolon. Not ASI here
    if (!(obj instanceof Object)) return
    if (set.has(obj)) return // prevent infinite loops
    set.add(obj)
    getAllDataProperties(obj)
      .filter(name => !excluded(name))
      .forEach(name => {
        // console.log('name:', name)
        if (map.has(obj[name])) {
          const target = map.get(obj[name])
          // console.log('redirect', name, 'from', obj[name] ,'to', target)
          obj[name] = target
        } else {
          f(obj[name]) // go down on property
        }
      })
  })(obj)
}
