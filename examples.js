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
