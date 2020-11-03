const { serialize, deserialize } = require('./index')

describe('Test (de)serialize service', () => {
  class A {
    constructor(n) {
      this.n = n
    }
    inc(n) {
      this.n += n
    }
  }
  const a = new A(10)
  const string = '{"_class":"A","_key":"","_value":{"n":10}}'
  const stringObj = JSON.parse(string)

  describe('Test instance of a class', () => {
    test(`should serialize and instance of a given class`, () => {
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
    class B extends A {
      constructor(n) {
        super(n)
      }
      dec (n) {
        this.inc(-n)
      }
    }
    const b = new B(20)
    const string = '{"_class":"B","_key":"","_value":{"n":20}}'
    const stringObj = JSON.parse(string)

    test(`should serialize and instance of a sub class`, () => {
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
})
