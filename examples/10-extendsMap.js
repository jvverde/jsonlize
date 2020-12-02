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
  setLinkedList(...args) {
    [...args].forEach((v, k, array) => {
      this.set(v, array[k + 1])
    })
  }
  get name () { return 'my name' }
}

(function (){
  const m = new Smap([[1, 'a']])
  //m.setLinkedList('a','b','c')
  const obj = {m}
  m.set(2, obj)
  m.set(3, m)
  const r = serdes(m)
  console.log('---------------')
  console.log(m)
  console.log('---------------')
  console.log(r)
  //assert(isLike(r, m))
})()
