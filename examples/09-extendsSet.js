'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone, isLike } = require('isClone')

const serdes = (v) => deserialize(serialize(v))

class Sset extends Set {
  constructor (s) {
    super(s)
    this.label = 'this is a Sset'
  }
  test = a => this.has(a) // We shouldn't use arrow functions as methods
  getIf(condf = () => true) {
    return [...this].filter(condf)
  }
  add(...args) {
    [...args].forEach(arg => super.add(arg))
  }
  del(...args) {
    [...args].forEach(arg => super.delete(arg))
  }
  removeIf = function(obj) { // defined as instance property
    if (this.has(obj)) this.del(obj)
  }
  set include (obj) {
    super.add(obj)
  }
  get getNumbers () {
    return [...this].filter(n => typeof n === 'number')
  }
}

class Smap extends Map {
  constructor (s) {
    super(s)
  }
  get name () { return 'my name' }
}

(function (){
  const s = new Sset([1])
  s.add(2,3)
  s.include = 4
  s.add(s) // circular reference
  s.self = s // another type of self reference
  const obj = {s}
  obj.self = obj // circular reference
  const array = [ obj, s]
  array.push(array) // circular reference on index 2
  obj.array = array // cross reference
  s.add(array, obj) // More two cross references
  const r = serdes(s)
  assert(isLike(r,s))
  assert(s.has(s))
  assert(r.has(r))  // As well as s contains s, r contains r
  assert(!r.has(s)) // But not the original set. Everything was cloned
  r.include = 5
  assert(r.has(5))
  r.removeIf(4)
  assert(!r.has(4))
  assert(isClone(r.getNumbers, [1, 2, 3, 5]))  // The element 4 was removed
  const a = r.getIf(e => e instanceof Array)[0] // get the array on set
  assert(a[2] === a)      // check self-contained circular references.
  assert(a[2] !== array)  // Notice that is a[2] don't reference original element 'array'
  assert(a[1] === r)      // check self-contained cross references.
  assert(a[1] !== s)      // Notice that is a[1] don't reference original element 's'
  assert(r.has(a[0]))     // a[0] = obj
  const o = a[0]
  assert(r === o.s)       // check self-contained cross references.
  assert(o.s !== s)       // Notice that is 0.s don't reference original element 's'
  assert(o.array === a)
  assert(o.self === o)
  assert(s.self === s)    // check circular reference in property self
  assert(r.self === r)    // As well as s.self referes to s, r.self referes to r
})()
