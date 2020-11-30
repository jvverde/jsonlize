const { serialize, deserialize } = require('../index')
const { random, lorem } = require('faker')
const { isClone, isLike } = require('isClone')

const serdes = (v) => deserialize(serialize(v))

describe('Test (de)serialize of prototype objects', () => {
  function A (n = 1) {
    this.n = n
  }
  A.prototype.inc = function (n) { this.n += n }
  Object.defineProperty(A.prototype, 'val', {
    get: function () { return this.n },
    set: function (n) { this.n = n }
  })

  const a = new A(10)
  a.inc(5)

  describe('Test object', () => {
    const clone = serdes(a)
    test('The deserializes of a serialize obvject should be similar to original', () => {
      expect(isLike(clone, a)).toBe(true)
    })
    test('The current values should be preserved', () => {
      expect(a.n === clone.n).toBe(true)
    })
    test('The class methods should be available', () => {
      expect(clone.inc(5) === undefined).toBe(true)
    })
    test('The prototype getters should be available', () => {
      expect(clone.val === 20).toBe(true)
    })
    test('The class setters should be available', () => {
      expect(clone.val = 30).toBe(30)
    })
  })

  function B (n = 1) {
    A.call(this, n)
  }
  B.prototype = Object.create(A.prototype)
  B.prototype.dec = function (n) { this.inc(-n); this.cnt++ }
  B.prototype.constructor = B

  describe('Test inheritance', () => {
    const b = new B(20)
    const clone = serdes(b)
    test('The deserializes of a serialize instance should be similar to original', () => {
      expect(isLike(clone, b)).toBe(true)
    })
    test('The current values should be preserved', () => {
      expect(b.n === clone.n).toBe(true)
    })
    test('The class methods should be available', () => {
      expect(clone.dec(5) === undefined).toBe(true)
    })
    test('The parent class methods should be available', () => {
      expect(clone.inc(10) === undefined).toBe(true)
    })
    test('The class getters should be available', () => {
      expect(clone.val === 25).toBe(true)
    })
    test('The class setters should be available', () => {
      expect(clone.val = 30).toBe(30)
    })
  })

  function C (n = 1) {
    this._a = new A(n)
  }

  Object.defineProperty(C.prototype, 'a', {
    get: function () { return this._a },
    set: function (n) { this._a = n }
  })

  describe('Test nested objects', () => {
    const c = new C(20)
    const clone = serdes(c)
    test('The deserializes of a serialize instance should be similar to original', () => {
      expect(isLike(clone, c)).toBe(true)
    })
    test('The nested elements has been cloned as well', () => {
      expect(c._a !== clone._a).toBe(true)
    })
    test('The current values should be preserved', () => {
      expect(c._a.n === clone._a.n).toBe(true)
    })
    test('The nested class methods should be available', () => {
      expect(clone.a.inc(10) === undefined).toBe(true)
    })
    test('The chain getters should be available', () => {
      expect(clone.a.val === 30).toBe(true)
    })
    test('The chain setters should be available', () => {
      expect(clone.a.val = 4).toBe(4)
    })
  })

})
