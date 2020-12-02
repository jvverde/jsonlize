const deconstruct = require('./lib/deconstruct')
const reconstruct = require('./lib/reconstruct')

const serialize = object => {
  if (arguments.length === 0) return // distinguish from undefined argument
  return JSON.stringify(deconstruct(object))
}
const deserialize = json => reconstruct(JSON.parse(json))

module.exports.serialize = serialize
module.exports.deserialize = deserialize
module.exports.deepclone = obj => deserialize(serialize(obj))
