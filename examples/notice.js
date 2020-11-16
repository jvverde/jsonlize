const { serialize, deserialize } = require('../index')
const isClone = require('isClone')

function serdes(obj, debug = false, strictly = true){
  console.log('original:', obj)
  const s = serialize(obj)
  console.log('serialize', s)
  const newobj = deserialize(s)
  console.log('clone:', newobj)
  //console.log('isClone:', isClone(obj, newobj, {debug, strictly}))
  console.log('-------------------')
  return newobj
}

// serdes()
// serdes(undefined)
// serdes(null)
// serdes(1)
// serdes('a')
// serdes({})
// serdes([])
// serdes({i:1})
// serdes([1])
// serdes({j:[]})
// serdes([{}])
// serdes({k:[1]})
// serdes([{k:1}])
// serdes(new Date)
// serdes(/^$/igsm)
// serdes(3n)
// serdes(new Set)
// serdes(new Map)
// serdes(new Set([3,2,1]))
// serdes(new Set([{i:2},{i:2}]))
class A{
  constructor(n) {
    this.n = n
  }
  get val() { return this.n }
}
//serdes(new A(3), false, false)
//serdes(new Set([new A(3)]), false, false)

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

// serdes(new Int(3), false, false)
// serdes(new Long(3), false, false)

class Sset extends Set{
  constructor(s){
    super(s)
    this.label = 'this is a set'

  }
}
//serdes(new Set(), false, false)
serdes(new Sset([{i:1}]), false, false)
//console.log(Object.getOwnPropertyDescriptors(new Sset()))

const isIterable = obj => obj && typeof obj[Symbol.iterator] === 'function'

function showchain(obj) {
  let sp=''
  const o = obj
  do {
    console.log(sp, 'obj:', obj)
    try {
      if (obj.valueOf instanceof Function) {
        console.log(sp, 'valueof=', obj.valueOf())
      }
      if (obj.toString instanceof Function) {
        console.log(sp, 'toString=', obj.toString())
      }
    } catch (e) {
      console.warn(e)
    }
    console.log(sp, 'typeof:', typeof obj)
    console.log(sp, 'constructor:', obj.constructor)
    console.log(sp, 'constructor.name:', obj.constructor.name)
    console.log(sp, 'descriptors', Object.getOwnPropertyDescriptors(obj))
    console.log(sp, 'isIterable', isIterable(obj))
    if (isIterable(obj)) {
      try {
        [...obj].forEach(e => {
          console.log(sp, 'e:', e)
        })
      } catch (e) {
        console.warn(e)
      }
    }
    console.log(sp, '<<<<<<<<')
    sp += '  '
  } while(obj = Object.getPrototypeOf(obj))
  console.log('>>>>>>>>')
}
//showchain(new Sset([{i:1}]))