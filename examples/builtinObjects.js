'use strict'

const { serialize, deserialize } = require('../index')
const { isClone, isLike } = require('isClone')

const serdes = (v) => deserialize(serialize(v))

const today = new Date()
const out = serdes(today)
console.log('today is', out.toLocaleString())

const re = new RegExp('[0-9]')
const newre = serdes(re)
console.log(`'A21B' match ${newre}`, 'A21B'.match(newre))

const f = function (a) {return a * a}
const g = serdes(f)
console.log('3 * 3 =', g(3))

const sqr = a => a * a
const square = serdes(sqr)
console.log('5 * 5 =', square(5))

const obj = {i:3, j:4}
const newobj = serdes(obj)
console.log(true === isClone(obj, newobj))

const array = [1,2]
const newarray = serdes(array)
console.log(true === isClone(array, newarray))

const set = new Set([3,5])
const newset = serdes(set)
console.log(true === isClone(set, newset))
console.log(true === newset.has(5))

const map = new Map([['a',1], ['b', 2]])
const newmap = serdes(map)
console.log(true === isClone(map, newmap))
console.log(true === newmap.has('b'))
console.log(2 === newmap.get('b'))