'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone, isLike } = require('isClone')

const serdes = (v) => deserialize(serialize(v))
const debug = true

class A extends Number {
  constructor (i = 0) {
    super(i | 0)
    this._src = i
    this._self = this
  }
  f(){console.log('this', this)}
  g = a => a * a
  h = function(){
    console.log(this)
    return this
  }
  i = this.f
  j = this.g
  k = this.h
  get self () { return this._self }
  get odd () { return this % 2 === 1 }
}
  //get exact () { return this == this._src}
  //get even () {return this % 2 === 0}
  // b = this.a
  // c = a => a * a
  // d = this.c
  // b = this.a
  // c = a => a * a
  // f(a) { return this + a }
  // g = a => a * a
  // h = this.g
  //a = function (){}
  //b = this.a
  // get exact () { return this == this._src}
  // get self () {return this._self}
  // get even () {return this % 2 === 0}
  // get odd () {return this % 2 === 1}

(function (){
  const x = 6.1
  const y = new A(x)
  y._src = '99.33'
  //const z = serdes(y)
  const json = serialize(y)
  console.log(json)
  const z = deserialize(json)
  console.log('---------------------')
  console.log(y)
  console.log(z)
  // console.log('y.g', y.g())
  // console.log('z.g', z.g())
  // console.log('y.h', y.h())
  // console.log('z.h', z.h())
  console.log('y.i', y.i.toString())
  console.log('z.i', z.i.toString())
  console.log(y.odd)
  assert(isLike(z, y))
  assert(y.i === y.f)
  assert(z.i === z.f)
  assert(y.j === y.g)
  assert(z.j === z.g)
  assert(y.k === y.h)
  assert(z.k === z.h)

  //console.log(serialize(z))
  // assert(z.even)
  // assert(!z.odd)
  // assert(!z.exact)
  // assert(9 === z.f(3))
  // assert(9 === z.g(3))
  // assert(9 === z.h(3))
  // assert(y.h === y.g)
  // assert(z.h === z.g)
})()
//const v = 'function g(){return 3}'
//const f = new Function('return ' + v)()
//console.log(f, f())
const showChain = require('./lib/showPrototypeChain')
const getProps = require('./lib/getAllPropertyNames')
// showChain(Object.getPrototypeOf({}))
// console.log('--------------')
// showChain(Object.prototype)
// showChain(Number.prototype)
// console.log('--------------')
// showChain(Math.prototype)
// console.log('--------------')
// showChain(RegExp.prototype)
// console.log('--------------')
// showChain(BigInt.prototype)
// let  n = new Number(9999999999999)
// console.log(n)
// console.log('---------------------')
// showChain(n)
// console.log('---------------------')
// getProps(n).forEach(name => {
//   console.log(name, '=>', n[name])
// })
// console.log('---------------------')
// const m = new Number(7)
// console.log(m)
// const r = Object.assign(n,m)
// console.log(r)

class Long extends A {
  constructor (i = 5) {
    super(i)
    this.cnt = 0
  }
  get long () { return this }
  get count () { return this.cnt }
  set count (n) { this.cnt = n}
}

(function (){
  const n = new Long(4)
  const m = serdes(n)
  assert(isLike(n, m))
  assert(m.long == 4)
  assert(m.long |0 === 4)
  assert(m.int |0 === 4)
  m.count = 2
  assert(m.count === 2)
})//()

// const n = new Int(3)
// const m = new Number(6)
// const r = Object.assign(n, m)
// console.log(n)
// console.log(r)
// console.log(r | 0)
// console.log(r.label)


class Sset extends Set {
  constructor (s) {
    super(s)
    this.label = 'this is a set'
  }
}

class Smap extends Map {
  constructor (s) {
    super(s)
  }
  get name () { return 'my name' }
}

(function (){
  const s = new Sset([1,2])
  s.add(s)
  const r = serdes(s)
  assert(r.has(1))
  //console.log(s)
  //console.log(r)
  //assert(isLike(r,s))
})//()


/*
serdes(new Smap([[{ i: 1 }, { j: 3 }]]), false, false)
*/
