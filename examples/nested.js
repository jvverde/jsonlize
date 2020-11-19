'use strict'
const { serialize, deserialize } = require('../index')
const serdes = (v) => deserialize(serialize(v))

const x = {i:1}
const y = {x}
const z = serdes(y)
console.log(x.i === z.x.i)

const xyz = {x, y, z}
const clone = serdes(xyz)
console.log(x.i === clone.y.x.i)