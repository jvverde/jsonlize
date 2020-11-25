'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone, isLike } = require('isClone')

const serdes = (v) => deserialize(serialize(v))

const x = { i: 1 }
const y = { x }
const z = serdes(y)
assert(isClone(y,z))
assert(x.i === z.x.i)
x.f = function(a = 3) { return 2 * this.i + a }
x.g = a =>  a * a

const w = serdes(y)
assert(isLike(w,y))
w.x.i = 3
assert(5 === y.x.f())
assert(9 === w.x.f())
assert(10 === w.x.f(4))
assert(16 === w.x.g(4))
