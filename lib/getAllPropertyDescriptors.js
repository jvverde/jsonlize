// get get All Property Names
// go down on chain recursively, but stop on builtin prototypes
const builtins = require('./builtins')
const builtinPrototypes = [...Object.values(builtins).map(b => b.prototype), Object.prototype]

module.exports = (obj) => {
  const result = new Set()
  while (obj && !builtinPrototypes.includes(obj)) { // Stop if object is a builtin prototype or is null
    const descriptors = Object.getOwnPropertyDescriptors(obj)
    Object.entries(descriptors).forEach(pair => result.add(pair))
    obj = Object.getPrototypeOf(obj)
  }
  return [...result]
}