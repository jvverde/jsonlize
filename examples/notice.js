const { serialize, deserialize } = require('../index')
const isClone = require('isClone')

function serdes(obj, debug = false, strictly = true){
  console.log('obj:', obj)
  const s = serialize(obj)
  console.log('serialize', s)
  const newobj = deserialize(s)
  console.log('newobj:', newobj)
  console.log('isClone:', isClone(obj, newobj, {debug, strictly}))
  console.log('-------------------')
  return newobj
}

serdes()
serdes(undefined)
serdes(null)
serdes(1)
serdes('a')
serdes({})
serdes([])
serdes({i:1})
serdes([1])
serdes({j:[]})
serdes([{}])
serdes({k:[1]})
serdes([{k:1}])
serdes(new Date)
serdes(/^$/igsm)
serdes(3n)
serdes(new Set)
serdes(new Map)
serdes(new Set([3,2,1]))
serdes(new Set([{i:2},{i:2}]))
class A{
  constructor(n) {
    this.n = n
  }
  get val() { return this.n }
}
serdes(new A(3), false, false)
serdes(new Set([new A(3)]), false, false)

class Int extends Number{
  // static cnt = 0
  // j = 2
  constructor(i = 0) {
    super(i)
    this.label = 'int'
  }
  get tag() { return this.label }
  get val() { return this }
  // setval(v) {
  //  this.i +  v
  //}
}
class Long extends Int{
  constructor(i = 5) {
    super(i)
    this.cnt = 2*i
  }
  get long() { return this}
}

serdes(new Int(3), false, false)
serdes(new Long(3), false, false)

class Sset extends Set{
  constructor(s){
    super(s)
    this.label = 'set'
  }
}

serdes(new Sset([1]), false, false)
