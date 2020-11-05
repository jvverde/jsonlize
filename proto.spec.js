const { serialize, deserialize } = require('./index')

describe('Test (de)serialize of prototype objects', () => {
  function A(n = 1) {
    this.n = n
  }
  A.prototype.inc = function(n) {this.n += n};

  const a = new A(10)
  const string = '{"_class":"A","_key":"","_value":{"n":10}}'
  const stringObj = JSON.parse(string)

  describe('Test instance of a class', () => {
    test(`should serialize an  instance of a given class`, () => {
      const json = serialize(a)
      expect(json).toMatchJSON(stringObj)
    })

    test(`should deserialize to an instance of a given class`, () => {
      const obj = deserialize(string, A)
      expect(obj).toMatchObject(a)
    })

    test(`Deserialize object must be able to invoke instance methods`, () => {
      const aa = new A(15)
      const obj = deserialize(string, A)
      obj.inc(5)
      expect(obj).toMatchObject(aa)
    })
  })

  describe('Test inheritance', () => {
    function B(n = 1) {
      A.call(this, n)
    }
     // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance
    B.prototype = Object.create(A.prototype)
    B.prototype.dec = function(n) {this.inc(-n); this.cnt++}
    Object.defineProperty(B.prototype, 'constructor', {
        value: B,
        enumerable: false, // so that it does not appear in 'for in' loop
        writable: true
    })
    // B.prototype.constructor = B //from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    const b = new B(20)
    const string = '{"_class":"B","_key":"","_value":{"n":20}}'
    const stringObj = JSON.parse(string)

    test(`should serialize an instance of a sub class`, () => {
      const json = serialize(b)
      expect(json).toMatchJSON(stringObj)
    })

    test(`should deserialize to an instance of a sub class`, () => {
      const obj = deserialize(string, B)
      expect(obj).toMatchObject(b)
    })

    test(`Deserialize object must be able to invoke instance methods (including inherit ones)`, () => {
      const bb = new B(15)
      const obj = deserialize(string, B)
      obj.inc(5)
      obj.dec(10)
      expect(obj).toMatchObject(bb)
    })
  })

  describe('Test nested objects', () => {
    function C(n = 1) {
      this.a = new A(n)
    }

    const c = new C(20)
    const string = '{"_class":"C","_key":"","_value":{"_a":{"_class":"A","_key":"_a","_value":{"n":20}}}}'
    const stringObj = JSON.parse(string)

    test(`should serialize an instance with a nested object instance`, () => {
      const json = serialize(c)
      expect(json).toMatchJSON(stringObj)
    })

    test(`should deserialize to an instance with a nested instance`, () => {
      const obj = deserialize(string, C, A)
      expect(obj).toMatchObject(c)
    })

    test(`Deserialize object must be able to invoke instance setters and getters`, () => {
      const cc = new C(25)
      const obj = deserialize(string, C, A)
      obj.a.inc(5)
      expect(obj).toMatchObject(cc)
    })
  })
})
