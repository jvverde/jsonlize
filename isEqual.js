// Borrow some ideas from:
// https://stackoverflow.com/a/44827922
// https://stackoverflow.com/a/16788517
// https://stackoverflow.com/a/1144249
// https://stackoverflow.com/a/6713782
function getAllPropertyNames(obj) {
  const result = new Set()
  do {
      Object.getOwnPropertyNames(obj).forEach(p => { result.add(p) })
  } while (obj = Object.getPrototypeOf(obj))
  return [...result]
}

const isEqual = (x, y, cnt = 0) => {
  cnt++
  // console.log(cnt, 'x:',x)
  // console.log(cnt, 'y:',y)
  function _FALSE(location) {
    console.log(cnt, 'false on', location, ':', x, '<=>', y)
    return false
  }
  function _TRUE(location) {
    console.log(cnt, 'true on', location, ':', x, '<=>', y)
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
  if (!isEqual(px, py, cnt)) { return _FALSE('Prototypes are different') }

  if (typeof x === 'function' /* || x instanceof RegExp*/ || x instanceof String) {
    const result = x.toString() === y.toString()
    return _RETURN(result, 'x.toString() === y.toString()')
  }

  if (x instanceof Date  || x instanceof Number ) {
    // Never use .tostring() for a Date object. It may(?) discard milliseconds
    const result = x.valueOf() === y.valueOf()
    return _RETURN(result, 'x.valueOf() === y.valueOf()')
  }

  if (x instanceof Set) {
    return _RETURN([...x].every(v => y.has(v)), 'y Set member compare')
  }
  if (x instanceof Map) {
    return _RETURN([...x].every(([k,v]) => isEqual(v, y.get(k), cnt)), 'y Map [key,value] compare')
  }
  if (x instanceof Array) {
    return _RETURN(x.every( (v, i) => isEqual(v, y[i], cnt)), 'y Array element compare')
  }

  const props = new Set([...getAllPropertyNames(x), ...getAllPropertyNames(y)])
  if (props.size > 0) {
    return _RETURN([...props].every( p => isEqual(x[p], y[p], cnt)), 'Own Property compare')
  }

  // last attempt if we forget some "special" case or object has no properties at all
  const result = x.toString() === y.toString()
  return _RETURN(result, 'Last attempt using "x.toString() === y.toString()"')
}

const assert = {
  same: (x, y) => console.log(isEqual(x, y) ? 'ok' : 'fail'),
  diff: (x, y) => console.log(isEqual(x, y) ? 'fail' : 'ok')
}

let cnt = 1
console.log('------------------------', cnt++)
assert.diff(null, undefined)

console.log('------------------------', cnt++)
assert.same(undefined, undefined)

console.log('------------------------', cnt++)
assert.same(null, null)

console.log('------------------------', cnt++)
const x = { i: 1 }
const y = { i: 1 }
assert.same(x, y)

console.log('------------------------', cnt++)
function A (i) { this.i = i }
function B (i) { this.i = i }
const a = new A(3)
const b = new B(3)
assert.diff(a, b)

console.log('------------------------', cnt++)
const s = new Set([x, a])
const r = new Set([x, b])
assert.diff(s, r)

console.log('------------------------', cnt++)
const m = new Map([[x, a], [y, a]])
const n = new Map([[x, a], [y, b]])
assert.diff(m, n)

console.log('------------------------', cnt++)
const arraya = new Array(3, 2, 1, {a: s})
const arrayb = new Array(3, 2, 1, {a: m})
assert.diff(arraya, arrayb)

console.log('------------------------', cnt++)
const datea = new Date
const dateb = new Date(datea)
assert.same(datea, dateb)

console.log('------------------------', cnt++)
const datec = new Date
assert.diff(datea, datec)

console.log('------------------------', cnt++)
assert.diff(3, 4)

console.log('------------------------', cnt++)
assert.diff(3, new Number(3))

console.log('------------------------', cnt++)
const re = /^$/imsg
assert.same(/^$/igsm, new RegExp(re))

// console.log(getAllPropertyNames(/^$/msgi))
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

