'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone } = require('isClone')


const serdes = (v) => deserialize(serialize(v))

;
(function () {
  const x = { i: 1 }
  const y = { j: 2 }
  x.r = x
  y.r = y
  x.y = y
  y.x = x
  const z = {x, y}
  x.z = y.z = z
  const set = new Set([x,y,z])
  const map = new Map([[x, set], [y, set]])
  //map.set(map, set)
  const array = [ undefined, null, Infinity, NaN, Math, 1, 'a', x, y, z, set, map]
  const obj = {
    array,
    map,
    set
  }
  console.log(obj)
  const json = serialize(obj)
  console.log(json)
  const newobj = serdes(obj)
  console.log(newobj)
  assert(isClone(obj, newobj))
})()

