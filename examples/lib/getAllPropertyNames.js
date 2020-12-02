// get get All Property Names
module.exports = (obj) => {
  const result = new Set()
  while (obj) {
    Object.getOwnPropertyNames(obj).forEach(p => result.add(p))
    obj = Object.getPrototypeOf(obj)
  }
  return [...result]
}