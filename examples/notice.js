const { serialize, deserialize } = require('../index')

console.log('----undefined----')
const undef = undefined
console.log(undef)
//console.log(undef.constructor)
console.log(typeof undef)
console.log(undef instanceof Object)

console.log('----null----')
const nulo = null
console.log(nulo)
// console.log(nulo.constructor)
console.log(typeof nulo)
console.log(nulo instanceof Object)

console.log('----number----')
const number = 0
console.log(number)
console.log(number.constructor)
console.log(typeof number)
console.log(number instanceof Object)

console.log('----string----')
const string = ''
console.log(string)
console.log(string.constructor)
console.log(typeof string)
console.log(string instanceof Object)

console.log('----boolean----')
const bool = 1 === 1
console.log(bool)
console.log(bool.constructor)
console.log(typeof bool)
console.log(bool instanceof Object)

const showArray = (array) => {
  console.log('array:', array)
  console.log('array.length:', array.length)
  console.log('array.map:', array.map(v => v))
  console.log('...array.keys:', ...array.keys())
  console.log('...array.values:', ...array.values())
  console.log('Object.keys(array:)', Object.keys(array))
  console.log('Object.getOwnPropertyNames(array):', Object.getOwnPropertyNames(array))

}

console.log('----Array(5)----')
showArray(new Array(5))

console.log('----Array = [undefined, 1]----')
showArray([undefined, 1])

console.log('----Array(5) and one element set ----')

;(function (array) {
  array[3] = 3
  showArray(array)
})(new Array(5))

;(function (array) {
  array.label = 'label'
  showArray(array)
})(new Array(5))

