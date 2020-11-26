'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone } = require('isClone')


const serdes = (v) => deserialize(serialize(v))

;
(function () {
  const x = { i: 1 }
  const y = { j: 2 }
  x.self = x
  y.self = y
  x.y = y
  y.x = x
  const z = {x, y}
  x.z = y.z = z
  const array = [ undefined, null, Infinity, NaN, Math, 1, 'a', x, y, z]
  const set = new Set([1,2, x, y, z])
  const map = new Map([[1, set], [2, set]])
  map.set(3, map)
  set.add(set)
  map.label = 'mapa'
  map.set(map, set)
  set.add(map)
  const obj = { array, map, set, x, y, z, undef: undefined}
  obj.self = obj
  set.add(obj)
  set.label = 'seta'
  array.push(set, map, array, obj, new Array(5))
  array[array.length + 3] = map
  array.label = 'vector'
  const newobj = serdes(obj)
  //console.log(serialize(obj))
  assert(isClone(obj, newobj, { debug: false}))
  assert(newobj.map.get(1) === newobj.map.get(2))
  assert(newobj.map === newobj.map.get(3))
  assert(newobj.set === newobj.map.get(newobj.map))
  assert(newobj.set === newobj.map.get(newobj.map))
})()

