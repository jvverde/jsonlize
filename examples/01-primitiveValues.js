'use strict'
const { serialize, deserialize } = require('../index')
const { isClone } = require('isClone')
const assert = require('assert').strict

const serdes = (v) => deserialize(serialize(v))

assert(serdes(null) === null)
assert(serdes(undefined) === undefined)
assert(serdes(Infinity) === Infinity)
assert(serdes(Infinity) === 3 / 0)
assert(serdes(7) === 7)
assert(serdes(0) === 0)
assert(serdes(-3) === -3)
assert(serdes(2.7) === 2.7)
assert(serdes(1/3) === 1/3)
assert(serdes('') === '')
assert(serdes('abc') === 'abc')
assert(serdes(false) === false)
assert(serdes(true) === true)
assert(serdes(1n) === 1n )
assert(serdes(Math) === Math )
assert(serdes(Math.sqrt(2)) === Math.sqrt(2))

assert(isClone(serdes(NaN), NaN)) //because NaN !== NaN
