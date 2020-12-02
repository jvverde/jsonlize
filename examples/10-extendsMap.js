'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone, isLike } = require('isClone')

const serdes = (v) => deserialize(serialize(v))

class Smap extends Map {
  constructor (m) {
    super(m)
    this.self = this
  }
  setLinkedList(...args) { // Create a circular linked list
    [...args].forEach((v, k, array) => {
      this.set(v, array[(k + 1) % array.length])
    })
  }
  get name () { return 'my name' }
}

(function (){
  const m = new Smap([[1, 'a']])
  const o = {m}
  const a = [m, o]
  const s = new Set([m, o, a])
  a.push(s, a)
  s.add(s)
  Object.assign(o, {o, a, s})
  m.setLinkedList(m, o, a, s, null, undefined, Infinity, true, 0, 3n)
  const n = serdes(m)
  assert(isLike(n, m))
  assert(!n.has(m))
  assert(!n.has(o))           // Everything was clone, so the old elements of map m don't occur on clone map n
  assert(!n.has(a))
  assert(!n.has(s))
  const entries = [...n]
  assert(n.get(1) === 'a')
  assert(entries[1][0] === n)
  const p = entries[2][0]     // p is the clone of o
  const b = entries[3][0]     // b is the clone of a
  const r = entries[4][0]     // r is the clone of s
  assert(m.get(m) === o)
  assert(n.get(n) === p)      // As well as m[m] = o, n[n] = p
  assert(m.get(o) === a)
  assert(n.get(p) === b)      // As well as m[o] = a, n[p] = b
  assert(m.get(a) === s)
  assert(n.get(b) === r)      // As well as m[a] = s, n[b] = r
  assert(m.get(s) === null)
  assert(n.get(r) === null)
  assert(m.get(null) === undefined)
  assert(n.get(null) === undefined)
  assert(n.get(undefined) === Infinity)
  assert(n.get(Infinity) === true)
  assert(n.get(true) === 0)
  assert(n.get(0) === 3n)
  assert(n.get(3n) === n)
  assert(s.has(m))
  assert(r.has(n))
  assert(s.has(o))
  assert(r.has(p))
  assert(s.has(a))
  assert(r.has(b))
  assert(s.has(s))
  assert(r.has(r))
  assert(b[0] === n)
  assert(b[1] === p)
  assert(b[2] === r)
  assert(b[3] === b)
  assert(p.m === n)
  assert(p.a === b)
  assert(p.s === r)
  assert(p.o === p)
})()
