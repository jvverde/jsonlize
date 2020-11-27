'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone, isLike } = require('isClone')

const serdes = (v) => deserialize(serialize(v))

class Int extends Number {
  constructor (i = 0) {
    super(i)
    this.label = 'int'
  }

  get tag () { return this.label }
  get int () { return this }
}

(function (){
  const x = 7
  const i = new Int(x)
  const json = serialize(i)
  console.log(json)
  const n = deserialize(json)
  console.log(i)
  console.log(n)
  assert(n.int == 7)
  assert(n.int | 0 === 7)
  assert(n.tag === 'int')
  assert(isLike(n, i))
})()
// const showChain = require('./lib/showPrototypeChain')
// showChain(Object.getPrototypeOf({}))
// console.log('--------------')
// showChain(Object.prototype)
class Long extends Int {
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
