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

const obj = {
  today,
  // string,
  // text,
  // bool,
  // falso,
  // number,
  // um,
  // array,
  // vector,
  // mix,
  f: function (a) {
    console.log('a=', a)
  },
  g: (a) => a*a,
  a
}

console.log(obj)

const json = serialize(obj)

console.log(json)

const newobj = deserialize(json, A)
console.log(newobj)
newobj.f('dddddddddddddddddd')
console.log(newobj.today.toLocaleString())
newobj.a.inc(33)
console.log(newobj.a.value)

/*const test = Object.create(Array.prototype)
test[3] = 'c'
console.log(test)
console.log(Array.from({ '0': 1, '1': 2 }))
console.log(Array.from(test))
console.log({
  a: test
})*/
