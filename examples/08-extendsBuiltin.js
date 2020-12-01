'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone, isLike } = require('isClone')

const chain = require('./lib/showPrototypeChain')
const props = require('./lib/getAllPropertyNames')

const serdes = (v) => deserialize(serialize(v))
const debug = true

const obj = {
  i: 0,
  inc() {
    this.i++
  }
}
obj.inc()
class A extends Number {
  constructor (i = 0, o) {
    super(i | 0)
    this.nested = o
    this.m = new Array(10)
    this.obj = {
      i,
      parent: this,
    }
    this.n = this.m
    this._self = this
  }
  f (m = 0) { return m * this.obj.i }
  g = a => a * a
  h = function () { return this.obj }
  i = this.f
  j = this.g
  k = this.h
  get self () { return this._self }
  get odd () { return this % 2 === 1 }
  get val () { return this.obj }
}




(function (){
  const x = 6.1
  const y = new A(x, obj)
  y.m[3] = 77777
  y.tag = 'tag'
  y.obj.self = y.obj
  const z = serdes(y)
  assert(isLike(z, y))
  /* keep intra references */
  assert(z === z.self)
  assert(y.i === y.f)
  assert(z.i === z.f)
  assert(y.j === y.g)
  assert(z.j === z .g)
  assert(y.k === y.h)
  assert(z.k === z.h)
  assert(9 === z.j(3))
  assert(x * 3 === z.f(3))
  assert('tag' === z.tag)
  assert(y.m.length === z.m.length)
})()

class B extends A {
  constructor (i = 5) {
    super(i)
    this.cnt = 0
  }
  get val () { return this | 0}
  get count () { return this.cnt }
  set count (n) { this.cnt = n}
}

(function (){
  const b = new B(4.7)
  const c = serdes(b)
  assert(isLike(c, b))
  assert(c.val === 4)
  c.count = 2
  assert(c.count === 2)
})()
