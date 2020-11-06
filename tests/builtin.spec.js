const { serialize, deserialize } = require('../index')
const { random, lorem } = require('faker')

describe('Test (de)serialize of instances of javascript objects', () => {
  describe('Test if builtin object are exactly the same', () => {
    const obj = { i: 1, j: [2, 3], o: { k: 4 } }
    const array = [1, 2, 3, obj]
    const set = [1, 1, 2, 2, array, obj]
    const map = [ ['a', 1], ['b', 2], [array, obj], [obj, set] ]
    const tests = {
      'Boolean Object' : new Boolean(random.boolean()),
      'literal Boolean': !random.boolean(),
      'Number Object' : new Number(random.number()),
      'literal Number': 0 | new Number(random.number()),
      'String Object' : new String(lorem.paragraphs()),
      'literal String' : `${lorem.paragraphs()}`,
      'Date' : new Date(),
      'BigInt' : BigInt(random.hexaDecimal(64)),
      'ReExp' :  /^$/igsm,
      'empty Object' : new Object,
      'empty literal Object' : {},
      'empty Array' : new Array,
      'empty literal array' : [],
      'empty Set': new Set(),
      'empty Map': new Map(),
      'Object' : new Object(obj),
      'literal Object' : obj,
      'Array' : new Array(...array),
      'literal array' : array,
      'Set': new Set(set),
      'Map': new Map(map)
    }
    for (const [k, v] of Object.entries(tests)) {
      test(`Deserialize of a serialized ${k} (${v}) should be strict equal`, () => {
        const json = serialize(v)
        const result = deserialize(json)
        expect(result).toStrictEqual(v)
      })
    }
  })
  describe('Test class instances', () => {
    class A {}
    class B extends A {}
    const tests = {
      'Class empty' : new A,
      'Sub Class' : new B
    }
    for (const [k, v] of Object.entries(tests)) {
      test(`Deserialize of a serialized ${k} (${v}) should be strict equal`, () => {
        const json = serialize(v)
        const result = deserialize(json, v.constructor)
        expect(result).toStrictEqual(v)
      })
      test(`Deserialize (WITHOUT class identification) of a serialized ${k} (${v}) should be equal to literal object`, () => {
        const json = serialize(v)
        const result = deserialize(json)
        const obj = Object.create(v)
        expect(result).toEqual(obj)
      })
    }
  })
  describe('More', () => {
    class A {}
    class B extends A {}
    for (let cnt = 1; cnt-->0; ){
      // --------------------------
      const re = /^[a-f]{3,}$/igsm
      test(`Deserialize of a serialized of Regex (${re}) should be also a re`, () => {
        const json = serialize(re)
        const result = deserialize(json)
        expect(result.test('abcd')).toBe(true)
        expect(result.test('1234\nabcd')).toBe(true)
      })
      const date = new Date()
      test(`Deserialize of a serialized of date object (${date}) should have Date's methods`, () => {
        const json = serialize(date)
        const result = deserialize(json)
        expect(() => {
          result.getTime()
          result.getUTCDate()
          result.toLocaleString()
          result.toTimeString()
        }).not.toThrow();
      })
      const f = (a) => a*a*a
      test(`Deserialize of a serialized of function should be Function`, () => {
        const json = serialize(f)
        const g = deserialize(json)
        const pow = g(4)
        expect(pow).toBe(4*4*4)
      })
    }
  })
  describe('Test binary arrays', () => {
    const types = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, Uint8ClampedArray]
    types.forEach(type => {
      const array = new type([1, 2, random.number()])
      test(`Deserialize of a serialized ${array.constructor.name} should be equal`, () => {
        const json = serialize(array)
        const array2 = deserialize(json)
        expect(array2).toEqual(array)
      })
    })
    const bigtypes = [BigInt64Array, BigUint64Array]
    bigtypes.forEach(type => {
      const array = new type([1n, 2n, 3n])
      test(`Deserialize of a serialized ${array.constructor.name} should be equal`, () => {
        const json = serialize(array)
        const array2 = deserialize(json)
        expect(array2).toEqual(array)
      })
    })
  })
})
