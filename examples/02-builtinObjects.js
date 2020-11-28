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

const array = [1,2]
const newarray = serdes(array)
assert(isClone(array, newarray))
assert(2 === newarray[1])

;// semi comma is needed here
(function () {
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