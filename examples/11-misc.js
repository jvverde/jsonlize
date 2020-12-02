'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone, isLike } = require('isClone')

const serdes = (v) => deserialize(serialize(v))

class Smap extends Map {
  static cntLists = 0
  constructor (m) {
    super(m)
    this.self = this
  }
  setLinkedList(...args) { // Create a circular linked list
    Smap.cntLists++
    [...args].forEach((v, k, array) => {
      this.set(v, array[(k + 1) % array.length])
    })
  }
  get name () { return 'my name' }
}

(function (){
  const s = new Smap()
  s.setLinkedList(1,2,s)
  const Rmap = serdes(Smap) // Clone a class (not a instance)
  assert(isLike(Smap, Rmap))
  const r = new Rmap()
  r.setLinkedList(3,4,r)
  r.setLinkedList(r,4,5)
  r.setLinkedList(null, undefined, NaN)
  s.setLinkedList(null, undefined, NaN)
  assert(2 === Smap.cntLists)
  assert(4 === Rmap.cntLists)
})()
