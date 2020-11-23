'use strict'
const { serialize, deserialize } = require('../index')
const serdes = (v) => deserialize(serialize(v))
const { isClone, isLike } = require('isClone')
const  _ = require('lodash')

function getAllPropertyNames (obj) {
  const result = new Set()
  while (obj) {
    Object.getOwnPropertyNames(obj).forEach(p => result.add(p))
    obj = Object.getPrototypeOf(obj)
  }
  return [...result]
}

function getAllProtoChain(obj, tab='') {
  const props = Object.getOwnPropertyDescriptors(obj)
  const symbols = Object.getOwnPropertySymbols(obj)
  const proto = Object.getPrototypeOf(obj)
  console.log(`${tab}constructor.toString()::`, obj.constructor.toString())
  console.log(`${tab}proto::`, proto)
  console.log(`${tab}props.constructor::`, props.constructor)
  console.log(`${tab}typeof props.constructor::`, typeof props.constructor)
  console.log(`${tab}props.constructor.toString()::`, props.constructor.toString())
  console.log(`${tab}props.constructor.value.toString()::`, (props.constructor.value || '').toString())
  // console.log(`${tab}symbols::`, symbols)
  if (proto) console.log(`${tab}props::`, props)
  if (proto) getAllProtoChain(proto, tab + '>>')
}

function doit(obj) {
  const props = Object.getOwnPropertyDescriptors(obj)
  const proto = Object.getPrototypeOf(obj)
  return Object.create(proto, props)
}

function test(obj) {
  console.log('++++++++++++++++++++')
  console.log('obj:', obj)
  const jbo = doit(obj)
  console.log('jbo:', jbo)
  console.log(isClone(jbo, obj) || (isLike(jbo, obj, { debug:true }) && ' (loosely)'))
  console.log('--------------------')
  return jbo
}

class A{
  x = 0
  get base () { return this.x}
  set base (n) { this.x = n}
}
class B extends A{
  static cnt = 0
   y = 0
   z = -1
  constructor(n = 0){
    super(n)
    this.y = n
    B.cnt++
    this.z = 2 * n + 1
    this.x = n * n
  }
  get val() {
    return this.y
  }
  set val(n) {
    this.y = n
  }
  inc(){
    this.z++
  }
}

const b = new B(5)
console.log(b)
const json = serialize(b)
console.log(json)
const c = deserialize(json)
console.log(c)
c.inc()
console.log(c)
console.log(b.base, c.base)
console.log(b.val, c.val)

//getAllProtoChain(c)
/*
const x = {
  i: 0,
  inc () {
    this.i++
  },
  dec: function () {
    this.i--
  },
  zero: function clean(){
    this.i = 0
  },
  alert: a => {console.log(a)},
  sqr: a => a * a
}
console.log(x)
x.inc()
console.log(x)
const json = serialize(x)
console.log(json)
const c = deserialize(json)
console.log(c)
c.zero()
console.log(c)
c.inc()
c.inc()
console.log(c, c.alert(3333), c.sqr(5))
*/

// c.inc()
// console.log(b)
// console.log(b.val)
// console.log(b.base)
// console.log('______________________________')
// getAllProtoChain(b)
//console.log(serialize(b))
// const props = Object.getOwnPropertyDescriptors(b)
// const BC = Object.create(Object.getPrototypeOf(b), props).constructor
// let bcc = new BC()
// for (const key in bcc) {
//   console.log('key:', key, b[key], bcc[key])
// }
// const propsnames = getAllPropertyNames(b).filter(p => p !== '__proto__' && !(b[p] instanceof Function))
// for (const name of propsnames) {
//   console.log('name:', name, b[name], bcc[name])
//   console.log('typeof b[name]:', typeof b[name])
//   try {
//     bcc[name] = b[name]
//   } catch (e) {
//     console.warn(e)
//   }
// }


//console.log('______________________________')
//console.log(serialize(bc))
// getAllProtoChain(bcc)
// console.log(b.val, bcc.val)
// console.log(b.base, bcc.base)
// console.log(bcc)
// bcc.inc()
// console.log(bcc)
// const C = Object.getPrototypeOf(b)
// console.log('C=', C, typeof C, 'name=', C.name )
// Object.keys(C).forEach(k => {
//   console.log(`k=${k}: ${C[k]}`)
// })
//console.log(bc.base)
//const bcc = Object.create(bc)
//console.log('______________________________')
//getAllProtoChain(bcc)
// for (const obj of [
//   /*{},
//   new Object,
//   {i:1},
//   Object.create(null),
//   Object.create({}),
//   Object.create({i:2}),
//   new A`*/
//   // new B,
//   //b
// ]) {
//   const jbo = test(obj)
//   console.log('proto:', Object.getPrototypeOf(obj))
//   console.log('proto:', Object.getPrototypeOf(jbo))
//   console.log('props:', Object.getOwnPropertyDescriptors(obj))
//   console.log('props:', Object.getOwnPropertyDescriptors(jbo))
//   console.log('obj.val:', obj.val)
//   const clone = _.cloneDeep(obj)
//   console.log(isClone(clone, obj) || (isLike(clone, obj, { debug:true }) && ' (loosely)'))
//   const json = serialize(obj)
//   console.log(json)
//   const newobj = deserialize(json)
//   console.log(isClone(newobj, obj) || (isLike(newobj, obj, { debug:true }) && ' (loosely)'))
//   //console.log('newobj.val:', newobj.val)
//   //console.log('clone.val:', clone.val)
//   //console.log('jbo.val:', jbo.val)
// }

// const c = serdes(b)

// console.log('*********************')
// getAllProtoChain(b)
// console.log('*********************')
// getAllProtoChain(c)
// console.log('*********************')

