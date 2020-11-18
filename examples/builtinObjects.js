'use strict'

const { serialize, deserialize } = require('../index')

const clone = (v) => deserialize(serialize(v))

let input, out

input = new Date()
out = clone(input)
console.log('today is', out.toLocaleString())

const v =  Math.floor(Math.random() * 100)
const m =  Math
console.log(v)
console.log(m.random())
