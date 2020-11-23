'use strict'
const { serialize, deserialize } = require('../index')
const { isClone } = require('isClone')

const serdes = (v) => deserialize(serialize(v))

console.log(serdes(null) === null)
console.log(serdes(undefined) === undefined)
console.log(serdes(Infinity) === Infinity)
console.log(serdes(7) === 7)
console.log(serdes('') === '')
console.log(serdes(false) === false)
console.log(serdes(1n) === 1n )
console.log(serdes(Math) === Math )

console.log(isClone(serdes(NaN), NaN)) //because NaN !== NaN
