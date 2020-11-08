// Borrow some ideas from:
// https://stackoverflow.com/a/44827922
// https://stackoverflow.com/a/16788517
// https://stackoverflow.com/a/1144249
// https://stackoverflow.com/a/6713782
function getAllPropertyNames(obj) {
  const s = new Set()
  do {
      Object.getOwnPropertyNames(obj).forEach(p => { s.add(p) })
  } while (obj = Object.getPrototypeOf(obj))
  return [...s]
}

const isIterable = obj => obj && typeof obj[Symbol.iterator] === 'function'

const isEqual = (x, y, spaces = '') => {
  const prefix = spaces
  spaces += '  '
  // console.log(prefix, 'x:',x)
  // console.log(prefix, 'y:',y)
  function _FALSE(location) {
    console.log(prefix, 'is false on', location, ':', x, '<=>', y)
    return false
  }
  function _TRUE(location) {
    console.log(prefix, 'is true on', location, ':', x, '<=>', y)
    return true
  }
  const _RETURN = (bool, line) => {
    return bool ? _TRUE(line) : _FALSE(line)
  }

  if (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y)) {
    return _TRUE(1)
  }

  // Compare primitives and functions.
  // Check if both arguments link to the same object.
  // Especially useful on the step where we compare prototypes
  if (x === y) { return _TRUE('x === y') }
  if (!(x instanceof Object)) { return _FALSE('x is not an obj') }
  if (!(y instanceof Object)) { return _FALSE('y is not an obj') }
  if (x.length !== y.length) { return _FALSE('x.length !== y.length') }
  if (x.size !== y.size) { return _FALSE('x.size !== y.size') }
  if (x.constructor !== y.constructor) { return _FALSE('x.constructor !== y.constructor') }
  if (x.prototype !== y.prototype) { return _FALSE('x.prototype !== y.prototype') }

  const px = Object.getPrototypeOf(x)
  const py = Object.getPrototypeOf(y)
  if (!isEqual(px, py, prefix)) { return _FALSE('Prototypes are different') }

  if (typeof x === 'function' || typeof x ===  'string') {
    // We don't use here 'x instanceof String' to avoid incorrectly compare subclasses of String
    const result = x.toString() === y.toString()
    return _RETURN(result, 'x.toString() === y.toString()')
  }

  if (x instanceof Date  || x instanceof Number ) {
    // Never use .tostring() for a Date object. It may(?) discard milliseconds
    const result = x.valueOf() === y.valueOf()
    return _RETURN(result, 'x.valueOf() === y.valueOf()')
  }

  //Compare every properties
  const props = new Set([...getAllPropertyNames(x), ...getAllPropertyNames(y)])
  const check = [...props].every(p => isEqual(x[p], y[p], prefix))
  if (!check) return _FALSE("At least one property doesn't match")

  if (!(x instanceof String) && isIterable(x)) { //iterate except if x is a Strings
    const [xo, yo] = [ [...x], [...y] ]
    const check = xo.every((v, i) => isEqual(v, yo[i], prefix))
    if (!check) {
      return _FALSE('At least one iterable value is not equal')
    } else {
      //we are assuming here that All properties are already tested above
      return _TRUE('Every element and every property match')
    }
  }

  if(x instanceof String || x instanceof Function || x instanceof RegExp
    || x instanceof Number  || x instanceof Boolean || Object.keys(x).length > 0) {
    return _TRUE('Every property match')
  }

  // last attempt if we forget some "special" case or object has no properties at all
  const result = x.toString() === y.toString()
  return _RETURN(result, 'Last attempt using "x.toString() === y.toString()"')
}

const assert = {
  same: (x, y) => console.log(isEqual(x, y) ? 'OK' : 'FAIL'),
  diff: (x, y) => console.log(isEqual(x, y) ? 'FAIL' : 'OK')
}

let prefix = 1
console.log('------------------------', prefix++)
assert.diff(null, undefined)

console.log('------------------------', prefix++)
assert.same(undefined, undefined)

console.log('------------------------', prefix++)
assert.same(null, null)

console.log('------------------------', prefix++)
assert.same(3/0, 3/0)

console.log('------------------------', prefix++)
assert.same(+"xpto", +"1 + 2")

console.log('------------------------', prefix++)
const x = { i: 1 }
const y = { i: 1 }
assert.same(x, y)

console.log('------------------------', prefix++)
function A (i) { this.i = i }
function B (i) { this.i = i }
const a = new A(3)
const b = new B(3)
assert.diff(a, b)

console.log('------------------------', prefix++)
const s = new Set([x, a])
const r = new Set([x, b])
assert.diff(s, r)
console.log('------------------------', prefix++)
const m = new Map([[x, a], [y, a]])
const n = new Map([[x, a], [y, b]])
assert.diff(m, n)

console.log('------------------------', prefix++)
const arraya = new Array(3, 2, 1, {a: s})
const arrayb = new Array(3, 2, 1, {a: m})
assert.diff(arraya, arrayb)

console.log('------------------------', prefix++)
const datea = new Date
const dateb = new Date(datea)
assert.same(datea, dateb)

console.log('------------------------', prefix++)
const datec = new Date('December 17, 1995 03:24:00')
assert.diff(datea, datec)

console.log('------------------------', prefix++)
assert.diff(3, 4)

console.log('------------------------', prefix++)
assert.diff(3, new Number(3))

console.log('------------------------', prefix++)
const re = /^$/imsg
assert.same(/^$/igsm, new RegExp(re))

console.log('------------------------', prefix++)
const bint = BigInt(321)
assert.same(bint, 321n)

console.log('------------------------', prefix++)
assert.diff(3, '3')

console.log('------------------------', prefix++)
assert.diff(3, new Number(3))

console.log('------------------------', prefix++)
assert.same(new Int8Array([3, -3]), new Int8Array([3, -3]))

console.log('------------------------', prefix++)
assert.diff(new Int8Array([3, -3]), new Int8Array([3, -3, 4]))

console.log('------------------------', prefix++)
assert.same(new BigInt64Array([3n, -3n]), new BigInt64Array([3n, -3n]))

console.log('------------------------', prefix++)
assert.diff(new BigInt64Array([3n, -3n]), new BigInt64Array([3n, 0n]))

console.log('------------------------', prefix++)
assert.same(new Float64Array([Math.PI, Math.E, 1/3, Math.sqrt(2)]), new Float64Array([Math.PI, Math.E, 1/3, Math.sqrt(2)]))

console.log('------------------------', prefix++)
assert.same([Math.PI, Math.E], [Math.PI, Math.E])

console.log('------------------------', prefix++)
const stringa = new String('ab')
assert.same(stringa, new String('ab'))

console.log('------------------------', prefix++)
assert.diff(stringa, 'ab')

const stringb = 'ab'
class STR extends String{
  constructor(s) {super(s)}
}
const str = new STR('abc')
function STRB(s){
  String.call(this, s)
}
STRB.prototype = Object.create(String.prototype)
STRB.prototype.append = function(s) {this.a = s}
STRB.prototype.constructor = STRB

const strb = new STRB('abc')

// console.log('------------------------')
// console.log(isIterable(stringa))
// console.log(stringa instanceof String)
// console.log(stringa.constructor.name)
// console.log(stringa.constructor === String)
// console.log(typeof stringa)
// console.log('------------------------')
// console.log(isIterable(stringb))
// console.log(stringb instanceof String)
// console.log(stringb.constructor.name)
// console.log(stringb.constructor === String)
// console.log(typeof stringb)
// console.log('------------------------')
// console.log(isIterable(str))
// console.log(str instanceof String)
// console.log(str.constructor.name)
// console.log(str.constructor === String)
// console.log(typeof str)
// console.log(str)

// console.log('------------------------')
// console.log(isIterable(strb))
// console.log(strb instanceof String)
// console.log(strb.constructor.name)
// console.log(strb.constructor === STRB)
// console.log(typeof strb)
// console.log(strb)
// console.log(getAllPropertyNames(s))
// console.log(s.valueOf())
// console.log(s.toString())
// console.log(getAllPropertyNames(m))
// console.log(getAllPropertyNames({}))
// console.log('++++++++++++++++++++++++')
// console.log(Object.getOwnPropertyNames(datea))
// console.log(datea.prototype)
// console.log(datea.constructor.prototype)
// console.log(Object.getPrototypeOf(datea))
// console.log('++++++++++++++++++++++++')
// console.log(Object.getOwnPropertyNames(b))
// console.log(b.prototype)
// console.log(b.constructor.prototype)
// console.log(Object.getPrototypeOf(b))

