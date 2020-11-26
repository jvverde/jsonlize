'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone } = require('isClone')


const serdes = (v) => deserialize(serialize(v))

;
(function () {
  const x = { i:1 }
  x.r = x

  const y = serdes(x)

  assert(isClone(x,y))
  assert(1 === y.r.i)
  assert(y.r === y)
})()

;
(function () {
  const x = { i: 0 }
  const y = { x, j: 1 }
  const z = { x, y, k: 2 }
  x.y = y
  x.z = z
  y.z = z

  // const json = serialize(z)
  // console.log(json)
  // const c = deserialize(json)
  // console.log(c)
  const c = serdes(z)

  assert(isClone(c,z))
  assert(2 === c.k)
  assert(c === c.y.z)
  assert(c === c.x.z)
  assert(c.y === c.x.y)
  assert(c.x === c.y.x)
  assert(c.y.x.z === c)
  assert(c.x.y.z === c)
})()
