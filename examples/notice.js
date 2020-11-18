const { serialize, deserialize } = require('../index')
const isClone = require('isClone')

function serdes (obj, debug = false, strictly = true) {
  console.log('original:', obj)
  const s = serialize(obj)
  console.log('serialize', s)
  const newobj = deserialize(s)
  console.log('clone:', newobj)
  console.log('isClone:', isClone(obj, newobj, {debug, strictly}))
  console.log('-------------------')
  return newobj
}

serdes()
serdes(undefined)
serdes(null)
serdes(1)
serdes('a')
serdes({})
serdes([])
serdes({ i: 1 })
serdes([1])
serdes({ j: [] })
serdes([{}])
serdes({ k: [1] })
serdes([{ k: 1 }])
serdes(new Date())
serdes(/^$/igsm)
serdes(3n)
serdes(new Set())
serdes(new Map())
serdes(new Set([3, 2, 1]))
serdes(new Set([{ i: 2 }, { i: 2 }]))
class A {
  constructor (n) {
    this.n = n
  }

  get val () { return this.n }
}
serdes(new A(3), false, false)
serdes(new Set([new A(3)]), false, false)

class Int extends Number {
  // static cnt = 0
  // j = 2
  constructor (i = 0) {
    super(i)
    this.label = 'int'
  }

  get tag () { return this.label }
  get val () { return this }
  // setval(v) {
  //  this.i +  v
  // }
}

serdes(new Int(3), false, false)

class Long extends Int {
  constructor (i = 5) {
    super(i)
    this.cnt = 2 * i
  }

  get long () { return this }
}

serdes(new Long(3), false, false)

class Sset extends Set {
  constructor (s) {
    super(s)
    this.label = 'this is a set'
  }
}
// serdes(new Set(), false, false)
// serdes(new Sset([{i:1}]), false, false)
class Smap extends Map {
  constructor (s) {
    super(s)
  }

  get name () { return 'my name' }
}
// serdes(new Smap([[{i:1}, {j:3}]]), false, false)
// console.log(Object.getOwnPropertyDescriptors(new Sset()))

/* function types(a, type = Object) {
  console.log('-------', a)
  try {
    console.log('typeof a:', typeof a)
    console.log(`a instanceof ${type.name}:`, a instanceof type)
    console.log('a instanceof Object:', a instanceof Object)
    console.log('a.constructor:', a.constructor)
    console.log('a.constructor.name:', a.constructor.name)
  } catch (e) {}
}
types('a', String)
types(new String('a'), String)
types(0, Number)
types(new Number(0), Number)
types(true, Boolean)
types(new Boolean(true), Boolean)
types(/^$/i, RegExp)
types(new RegExp('^$','i'), RegExp)
types(1n, BigInt)
types(BigInt(1), BigInt)
types(null, Object)
types(NaN, Object)
types(undefined, Object)
types(Infinity, Object) */

const isIterable = obj => obj && typeof obj[Symbol.iterator] === 'function'

function showchain (obj, isPrototype = false) {
  let sp = ''
  do {
    console.log(sp, 'obj:', obj)
    try {
      if (obj.valueOf instanceof Function) {
        console.log(sp, 'valueof:', obj.valueOf())
      }
      if (obj.toString instanceof Function) {
        console.log(sp, 'toString:', obj.toString())
      }
    } catch (e) {
      console.warn(e)
    }
    console.log(sp, 'typeof:', typeof obj)
    console.log(sp, 'constructor:', obj.constructor)
    console.log(sp, 'constructor.name:', obj.constructor.name)
    console.log(sp, 'isIterable', isIterable(obj))
    if (!isPrototype && isIterable(obj)) {
      try {
        [...obj].forEach(e => {
          console.log(sp, 'e:', e)
        })
      } catch (e) {
        console.warn(e)
      }
    }
    console.log(sp, 'descriptors', Object.getOwnPropertyDescriptors(obj))
    console.log(sp, '<<<<<<<<')
    sp += '  '
    isPrototype = true
  } while (obj = Object.getPrototypeOf(obj))
  console.log('>>>>>>>>')
}
// showchain(new Sset([{i:1}]))
