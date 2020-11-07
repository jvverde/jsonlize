
const isEqual = (x, y, cnt = 0) => {
  cnt++
  // console.log(cnt, 'x:',x)
  // console.log(cnt, 'y:',y)
  function f(location) {
    console.log(cnt, 'false on', location, ':', x, '<=>', y)
    return true
  }
  function g(location) {
    console.log(cnt, 'true on', location, ':', x, '<=>', y)
    return true
  }
  if (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y)) {
    g(1)
    return true
  }

  // Compare primitives and functions.
  // Check if both arguments link to the same object.
  // Especially useful on the step where we compare prototypes
  if (x === y) {
    g(2)
    return true
  }
  if (!(x instanceof Object)) { f(1); return false }
  if (!(y instanceof Object)) { f(2); return false }
  if (x.length !== undefined && x.length !== y.length) { f(3); return false }

  if (x.constructor !== y.constructor) { f(4); return false }
  if (x.prototype !== y.prototype) { f(5); return false }

  if (typeof x === 'function') {
    return x.toString() === y.toString() && f(6) || g(3)
  }

  if (x instanceof Set) {
    for (const e of x) {
      console.log('e=', e)
      if (!y.has(e)) { f(10); return false}
    }
    g(5)
    return true
  }
  if (x instanceof Map) {
    for (const [k,v] of x) {
      console.log('k=', k, '=>', v)
      if (!isEqual(v, y.get(k), cnt)) {
        f(11); return false
      }
    }
    g(6)
    return true
  }
  if (x instanceof Array) {
    for (const i in x) {
      console.log(`${i} => `, x[i], ',', y[i])
      if (!isEqual(x[i], y[i], cnt)) {
        f(12); return false
      }
    }
    g(7)
    return true
  }
  const props = new Set()
  Object.getOwnPropertyNames(x).forEach(p => props.add(p))
  Object.getOwnPropertyNames(y).forEach(p => props.add(p))
  for (const p of props) {
    console.log('p=', p)
    if (!isEqual(x[p], y[p]), cnt) { f(7); return false }
  }

  const px = Object.getPrototypeOf(x)
  const py = Object.getPrototypeOf(y)
  if (!isEqual(px,py, cnt)) { f(8); return false }
  const result = x.valueOf() === y.valueOf()
  if (result) {
    g(4)
    return true
  } else {
    f(13)
    return false
  }
}

const assert = {
  same: (x, y) => console.log(isEqual(x, y) ? 'ok' : 'fail'),
  diff: (x, y) => console.log(isEqual(x, y) ? 'fail' : 'ok')
}

console.log('------------------------')
assert.diff(null, undefined)

console.log('------------------------')
assert.same(undefined, undefined)

console.log('------------------------')
assert.same(null, null)

console.log('------------------------')
const x = { i: 1 }
const y = { i: 1 }
assert.same(x, y)

console.log('------------------------')
function A (i) { this.i = i }
function B (i) { this.i = i }
const a = new A(3)
const b = new B(3)
assert.diff(a, b)

console.log('------------------------')
const s = new Set([x, a])
const r = new Set([x, b])
assert.diff(s, r)

console.log('------------------------')
const m = new Map([[x, a], [y, a]])
const n = new Map([[x, a], [y, b]])
assert.diff(m, n)

console.log('------------------------')
const arraya = new Array(3, 2, 1, {a: s})
const arrayb = new Array(3, 2, 1, {a: m})
assert.diff(arraya, arrayb)

console.log('------------------------')
const datea = new Date
const dateb = new Date(datea)
assert.same(datea, dateb)

console.log('------------------------')
const datec = new Date
assert.diff(datea, datec)

console.log('------------------------')
assert.diff(3, 4)

console.log('------------------------')
assert.diff(3, new Number(3))


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

