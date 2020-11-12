const { serialize, deserialize } = require('../index')
const isClone = require('isClone')

/*console.log('----undefined----')
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
  console.log('array.constructor', array.constructor.toString())
  console.log('array.prototye', array.prototype)
  console.log('Object.getPrototypeOf(array):', Object.getPrototypeOf(array))
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
})(new Array(5))*/

/*console.log('----sub class of Array ----')
class S extends Array{
  tag = 'S'
  obj = {
    i: 3,
    j:4
  }
  undef = undefined
  constructor(...args) {
    super(...args)
  }
  // get valor() { return this }
}
function Myarrays (...args) {
  const s = new S(...args)
  s.label = 'label'
  s[3]=3
  // showArray(s)
  return s
}
const s = Myarrays(5)
const st = serialize(s)
console.log(st)
const r = deserialize(st)
console.log(s)
console.log(r)*/

function test(obj) {
  console.log('in:', obj)
  //console.log('typeof', typeof obj)
  //console.log('instanceof Array', obj instanceof Array)
  console.log('obj.constructor', obj.constructor)
  console.log('obj.constructor.name', obj.constructor.name)
  // console.log('...obj.keys', ...obj.keys())
  // console.log('Object.keys(obj)', Object.keys(obj))
  // console.log('...obj', [...obj])
  const p = Object.getPrototypeOf(obj)
  const d = Object.getOwnPropertyDescriptors(obj)
  console.log('descriptors:', d)
  // const newobj =  Object.create(p, d)
  let newobj
  if (obj.constructor === Array) {
    newobj = Object.create(Object.getPrototypeOf([]), d)
  } else if (obj.constructor === Object) {
    newobj = Object.create(Object.getPrototypeOf({}), d)
  } else {
    console.log('prototype:', p)
    console.log('prototype.constructor:', p.constructor)
    console.log('prototype.constructor.toString():', p.constructor.toString())
    console.log('prototype.descriptores', Object.getOwnPropertyDescriptors(p))
    newobj = Object.create(p, d)
  }
  console.log('out:', newobj)
  console.log('isClone?:', isClone(obj,newobj))
  console.log('-------------------')
  return newobj
}

// test([])
// test(new Array(5))
// const t = new Array(5)
// t[3] = 3
// test(test(t))
// const e = []
// e.label = 'label'
// test(e)
// test({})
// test({i:3})
// function A(){}
// test(new A())
// function make(){
//   function B(n = 0){
//     this.i = n
//     this.j++
//     console.log(this.j)
//   }
//   return new B()
// }
// test(make())

function serdes(obj){
  console.log('obj:', obj)
  const s = serialize(obj)
  console.log('serialize', s)
  console.log('-------------------')
}

serdes()
serdes(undefined)
serdes(null)
serdes(1)
serdes('a')
serdes({})
serdes([])
serdes({i:1})
serdes([1])
serdes({j:[]})
serdes([{}])
serdes({k:[1]})
serdes([{k:1}])
serdes(new Date)
serdes(/^$/igsm)
serdes(3n)
serdes(new Set)
serdes(new Map)
serdes(new Set([{i:2},{i:2}]))
class INT extends Number{
  constructor(i = 0) {
    super(i)
    this.label = 'int'
  }
  get tag() { return label }
}
serdes(new INT(3))
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
