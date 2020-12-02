'use strict'
const { serialize, deserialize } = require('../index')
const serdes = (v) => deserialize(serialize(v))
const assert = require('assert').strict
const { isClone, isLike } = require('isClone')
const showProtoChain = require('./lib/showPrototypeChain')

class A {
  constructor (n = 0) {
    this.n = n
  }
  get val () { return this.n }
  set val (n) { this.n = n }
}

(function () {
  const a = new A(3)
  const b = serdes(a)
  assert(3 === b.val)
  b.val = 7
  assert(3 === a.val)
  assert(7 === b.val)
  a.label = 'a'
  const c = serdes(a)
  assert(isLike(a, c))
  assert('a' === c.label)
})()


// nesting

class B {
  a = new A(1)
}

(function (){
  const b = new B()
  const c = serdes(b)
  assert(isLike(b, c))
})()

// inheritance

class C extends A {
  m = 1
  set val ([n, m]) {
    this.n = n
    this.m = m
  }
  get val () {
    return [this.n, this.m]
  }
}

(function (){
  const c = new C(500)
  const d = serdes(c)
  assert(isLike(c, d))
  c.val = [3,7]
  assert(isClone(c.val, [3,7]))
  assert(!isClone(d.val, [3,7])) // d is not affect by any changes on c
  d.val = [4,6]
  assert(isClone(d.val, [4,6]))
  const e = serdes(d)
  assert(isClone(e.val, [4,6 ]))
})()
