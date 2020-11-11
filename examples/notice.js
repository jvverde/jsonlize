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
  console.log('Object.keys(array);', Object.keys(array))
  console.log('...array.keys:', ...array.keys())
  console.log('...array.values:', ...array.values())
  console.log('typeof:', typeof array)
  console.log('array.constructor', array.constructor)
  console.log('array.prototye', array.prototype)
  console.log('array.getPrototypeOf(array):', Object.getPrototypeOf(array))
  console.log('Object.getOwnPropertyNames(array):', Object.getOwnPropertyNames(array))
  console.log('Object.getOwnPropertyDescriptors(array):', Object.getOwnPropertyDescriptors(array))
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

console.log('----Array(5) with a prop ----')
;(function (array) {
  array.label = 'label'
  showArray(array)
})(new Array(5))

console.log('----sub class of Array ----')
function Myarrays (...args) {
  class S extends Array{
    tag = 'S'
    obj = {
      i: 3,
      j:4
    }
    constructor(...args) {
      super(...args)
    }
    get valor() { return this }
  }
  const s = new S(...args)
  s.label = 'label'
  showArray(s)
}
Myarrays(5)


// console.log('---- date with a label ----')
// const date = new Date
// date.label = 'label'
// console.log(Object.getOwnPropertyDescriptors(date))
// console.log(Object.getPrototypeOf(date))

// console.log('---- Number extended with a label ----')
// function showobj(type, value){
//   function create() {
//     return class D extends type{
//       static type = 'String'
//       label = 'label'
//       constructor(s){
//         super(s)
//       }
//       get valor() {return this}
//     }
//   }
//   const X = create()
//   const n = new X(value)
//   n.name = 'myobjname'
//   n.label = 'tag'

//   console.log('valor', 0 + n.valor)
//   console.log(Object.getOwnPropertyDescriptors(n))
//   const p = Object.getPrototypeOf(n)
//   console.log(p)
//   console.log('proto:', Object.getOwnPropertyDescriptors(p))
//   console.log('constructor:', Object.getOwnPropertyDescriptors(p).constructor.value.toString())
//   console.log('constructor:', p.constructor.toString())

// }

// showobj(Number, 3)
// showobj(String, '3')
// showobj(Date, new Date)
