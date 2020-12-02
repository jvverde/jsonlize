'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone, isLike } = require('isClone')


const serdes = (v) => deserialize(serialize(v))

;(function () {
  const x = {}
  x.self = x

  const y = serdes(x)

  assert(isClone(x,y))
  assert(y === y.self)
  assert(x === x.self)
  assert(x !== y.self)
})()

;(function () {
  const x = {}
  const y = {}
  x.y = y
  y.x = x

  const [a, b] = serdes([x, y]) // a is clone of x and b is clone of y

  assert(a.y === b)
  assert(a.y !== y) // a.y i now a clone de y => not a reference to y
  assert(isClone(a.y, y))
  assert(b.x === a)
  assert(b.x !== x)

  assert(a.y.x === a)
  assert(b.x.y === b)
})()

;(function () {
  const x = { i: 0 }
  const y = { x, j: 1 }
  const z = { x, y, k: 2 }
  x.y = y
  x.z = z
  y.z = z

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

;(function () {
  const o = {}
  const a = []
  const f = n => n * n
  Object.assign(o, { o, a, f })
  a.push(a, o, f)
  f.f = f

  const [O, A, F] = serdes([o, a, f])
  assert(O.o === O)
  assert(O.a === A)
  assert(O.f === F)
  assert(A[0] === A)
  assert(A[1] === O)
  assert(A[2] === F)

  assert(F.f === F)
  assert(F.f !== f)
  assert(isLike(F, f))
  assert(16 === F(4))
})()
