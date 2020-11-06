const { serialize, deserialize } = require('./index')

function getAllPropertyNames(obj) {
  let result = new Set()
  while (obj) {
      Object.getOwnPropertyNames(obj).forEach(p => result.add(p));
      obj = Object.getPrototypeOf(obj);
  }
  return [...result]
}

const today = new Date()
const string = new String('abc')
const bool = new Boolean()
const number = new Number(3.14)
const array = new Array(1,2)

const text = 'texto'
const falso = false
const um = 1
const vector = [1, 2]
const mix = [1, {
  a: 1,
  b: 'dois',
  today
}]

class A {
  constructor(n) {
    this.n = n
  }
  inc(n) {
    this.n += n
  }
  get value () {
    return this.n
  }
}
const a = new A(10)
const an = {
  i: 1,
  j: 2,
  f: function(){ return this.j + this.i},
  g: (a) => 2 * a + 1
}
const bi = BigInt(9007199254740991)

const obj = {
  // today,
  // string,
  // text,
  // bool,
  // falso,
  number,
  um,
  // array,
  // vector,
  // mix,
  // f: function (a) {
  //   console.log('a=', a)
  // },
   g: (a) => a*a,
   a,
   an,
  bi
}

console.log(a)
const ajson = serialize(a)
console.log(ajson)
const newa = deserialize(ajson, A)
console.log(newa)

console.log(obj)

const json = serialize(obj)

console.log(json)

const newobj = deserialize(json, A)
console.log(newobj)

console.log('--------------------')
const bij = serialize(bi)

console.log(bij)

const newbi = deserialize(bij)
console.log(newbi)

console.log('--------------------')
const tj = serialize(today)

console.log(tj)

const newt = deserialize(tj)
console.log(newt)
console.log(newt.toLocaleString())

console.log('--------------------')
let sym = Symbol('foo')
console.log(sym)
const sj = serialize(sym)
console.log(sj)
const news = deserialize(sj)
console.log(news)

console.log('--------------------')
const err = new Error('Aconteceu')
console.log(err)
const ej = serialize(err)
console.log(ej)
const newe = deserialize(ej)
console.log(newe)

console.log('--------------------')
const re = /^all$/igs
console.log(re)
const rj = serialize(re)
console.log(rj)
const newr = deserialize(rj)
console.log(newr)

console.log('--------------------')

const set = new Set([1,1,1,2, a, an, today])
console.log(set)
const setj = serialize(set)
console.log(setj)
const newset = deserialize(setj, A)
console.log(newset)

console.log('--------------------')
let first = new Map([
  [1, 'one'],
  [2, 'two'],
  [a, 'three'],
])

console.log(first)

const fj = serialize(first)
console.log(fj)
const second = deserialize(fj, A)
console.log(second)
// const ia = new Int8Array(3)
// const ia2 = new Int8Array([1,2,3,4])
// const ia3 = new Int8Array(10)
// console.log(ia)
// console.log(ia2)
// console.log(ia3)
// console.log(ia3.constructor)
// console.log(ia3.constructor.name)
// console.log(typeof ia3.constructor)
 /*newobj.f('dddddddddddddddddd')
console.log(newobj.today.toLocaleString())
newobj.a.inc(33)
console.log(newobj.a.value)
console.log(newobj.an.f())
console.log(newobj.an.g(7))*/

/*const test = Object.create(Array.prototype)
test[3] = 'c'
console.log(test)
console.log(Array.from({ '0': 1, '1': 2 }))
console.log(Array.from(test))
console.log({
  a: test
})*/
