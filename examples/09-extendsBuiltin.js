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
  const i = new Int(3)
  const n = serdes(i)
  assert(isLike(n, i))
  assert(n.int == 3)
  assert(n.int | 0 === 3)
  assert(n.tag === 'int')
})()

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
})()

//const n = new Int(3)
//const m = new Number(6)
//console.log(Object.assign(m, n))
//console.log(m.label)


/*
class Sset extends Set {
  constructor (s) {
    super(s)
    this.label = 'this is a set'
  }
}
serdes(new Set(), false, false)
serdes(new Sset([{ i: 1 }]), false, false)

class Smap extends Map {
  constructor (s) {
    super(s)
  }

  get name () { return 'my name' }
}
serdes(new Smap([[{ i: 1 }, { j: 3 }]]), false, false)
*/
