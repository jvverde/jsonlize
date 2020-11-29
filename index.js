// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
const deconstruct = require('./lib/deconstruct')
const reconstruct = require('./lib/reconstruct')

const serialize = object => {
  if (arguments.length === 0) return
  return JSON.stringify(deconstruct(object))
}
const deserialize = json => reconstruct(JSON.parse(json))

module.exports.serialize = serialize
module.exports.deserialize = deserialize
module.exports.deepclone = obj => deserialize(serialize(obj))
