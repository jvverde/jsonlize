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
  const r = serdes(m)
  assert(isLike(r, m))
})()
