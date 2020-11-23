'use strict'
const { serialize, deserialize } = require('../index')
const serdes = (v) => deserialize(serialize(v))

class A {
  constructor (n = 0) {
    this.n = n
  }
  get val () { return this.n }
  set val (n) {this.n = n}
}
const a = new A(3)
const b = serdes(a)
console.log(3 === b.val)
b.val = 7
console.log(3 === a.val)

a.label = 'a'
const c = serdes(a)
console.log('a' === c.label)

// With nested instances
class B {
  a = new A(1)
}

const ba = new B()
const x = serdes(a)
console.log(1 === ba.a.val)

// inheritance

class C extends A {
  m = 1
  set val ([n, m]) {
    this.n = n
    this.m = m
  }
}

const ca = new C(500)
const y = serdes(ca)
y.val = [3,7]
console.log(3 === y.n)
console.log(7 === y.m)

