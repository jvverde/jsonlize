'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone, isLike } = require('isClone')

const serdes = (v) => deserialize(serialize(v))


const x = { i: 1 }
const y = { x }

const a = {x, y}
const c = serdes(a)
assert(isClone(a, c))
assert(a.x.i === c.y.x.i)
a.x.i = 2
assert(2 === a.y.x.i) // y.x is a referece to x => a.y.x is a reference to a.x
c.x.i = 3
assert(3 === c.y.x.i) // c.z.x is a reference to c.x
