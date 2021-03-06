'use strict'
const { serialize, deserialize } = require('../index')
const { isClone, isLike } = require('isClone')
const assert = require('assert').strict

const serdes = (v) => deserialize(serialize(v))

const today = new Date()
const out = serdes(today)
assert(isClone(today,out))
assert(today.toLocaleString(), out.toLocaleString())

const re = new RegExp('[0-9]')
const newre = serdes(re)
assert(newre.test('A21B'))

const f = function (a) {return a * a}
const g = serdes(f)
assert(isLike(f,g))
assert(9 === g(3))

const sqr = a => a * a
const square = serdes(sqr)
assert(isLike(sqr,square))
assert(25 === square(5))

const obj = {i:3, j:4}
const newobj = serdes(obj)
assert(isClone(obj, newobj))
assert(isClone(obj, newobj))

;// semi comma is needed here
(function () {
  const array = []
  const newarray = serdes(array)
  assert(isClone(array, newarray))
  assert(0 === newarray.length)
})()

;(function () {
  const array = [1,2]
  const newarray = serdes(array)
  assert(isClone(array, newarray))
  assert(2 === newarray[1])
})()

;(function () {
  const array = new Array(5)
  const newarray = serdes(array)
  assert(isClone(array, newarray))
  assert(5 === newarray.length)
  assert(undefined === newarray[1])
})()

const set = new Set([3,5])
const newset = serdes(set)
assert(isClone(set, newset))
assert(newset.has(5))

const map = new Map([['a',1], ['b', 2]])
const newmap = serdes(map)
assert(isClone(map, newmap))
assert(newmap.has('b'))
assert(1 === newmap.get('a'))

;// semi comma is needed here
(function () {
  const map = new Map([[sqr,1], [obj, 2]])
  const newmap = serdes(map)
  assert(isLike(map, newmap))
  assert(!newmap.has(obj))  // the 'obj' on map was cloned, so the original 'obj' is not in newmap
  assert(isLike([...newmap.keys()], [sqr, obj])) // but cloned keys still there
})()

function bigint(a) {
  const b = new BigInt64Array(a)
  const c = serdes(b)
  assert(isLike(c, b))
}
bigint()
bigint(0)
bigint(3)
bigint([1n ,-2n, -3n])

function biguint(a) {
  const b = new BigUint64Array(a)
  const c = serdes(b)
  assert(isLike(c, b))
}
biguint()
biguint(0)
biguint(3)
biguint([1n , 2n, 3n])

function binaryArray(type, a) {
  const b = new type(a)
  const c = serdes(b)
  assert(isLike(c, b))
}
for (const type of [Int8Array, Uint8Array, Int16Array, Uint16Array,
  Int32Array, Uint32Array, Uint8ClampedArray, Float32Array, Float64Array]) {
  binaryArray(type, )
  binaryArray(type, 0)
  binaryArray(type, 3)
  binaryArray(type, [1, 2, 3.5, 300000.3])
}
