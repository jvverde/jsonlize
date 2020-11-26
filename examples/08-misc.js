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
  const set = new Set([1,2])
  const map = new Map([[1, set], [2, set]])
  map.set(3, map)
  map.label = 'mapaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  assert(map.get(1) === map.get(2))
  //map.set(map, set)
  const array = [ undefined, null, Infinity, NaN, Math, 1, 'a', x, y, z, set, map]
  const obj = {
    array,
    map,
    set
  }
  console.log(map)
  const json = serialize(map)
  console.log(json)
  const newobj = serdes(map)
  //assert(newobj.get(1) === newobj.get(2))
  console.log(newobj)
  console.log(isClone(map, newobj, { debug: true}))
  //console.log(Object.getOwnPropertyDescriptors(map))
  //const m = new Map(map)
  //console.log(m)
})()

