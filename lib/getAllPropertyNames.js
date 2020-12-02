// get get All Property Names
// go down on chain recursively, but stop on builtin prototypes
const builtins = require('./builtins')
const builtinPrototypes = [...Object.values(builtins).map(b => b.prototype), Object.prototype]

module.exports = (obj) => {
  const result = new Set()
  while (obj && !builtinPrototypes.includes(obj)) { // Stop if object is a builtin prototype or is null
    Object.getOwnPropertyNames(obj).forEach(p => result.add(p))
    obj = Object.getPrototypeOf(obj)
  }
  return [...result]
}