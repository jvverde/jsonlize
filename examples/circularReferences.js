'use strict'
const { serialize, deserialize } = require('../index')
const serdes = (v) => deserialize(serialize(v))

const x = {i:0, nested:{a:1}}
x.nested.b = x

const json = serialize(x)
console.log(json)
const clone = deserialize(json)
console.log(clone)