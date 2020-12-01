'use strict'
const { serialize, deserialize } = require('../index')
const assert = require('assert').strict
const { isClone, isLike } = require('isClone')

const serdes = (v) => deserialize(serialize(v))

class Smap extends Map {
  constructor (...pairs) {
    super([...pairs])
    this.self = this
  }
  setLinkedList(...args) {
    [...args].forEach((v, k, array) => {
      this.map(v, array[k + 1])
    })
  }
  get name () { return 'my name' }
}

(function (){
  const m = new Smap([1, 'a'])
  const r = serdes(m)
  console.log(m)
  console.log(r)
  assert(isLike(r, m))
})()
