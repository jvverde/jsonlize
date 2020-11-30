const { serialize, deserialize } = require('../index')
const { random, lorem } = require('faker')
const { isClone, isLike } = require('isClone')

describe('Test builtin objects', () => {
  describe('Test if a deserialized of a serialize is exactly the same as original', () => {
    const obj = { i: 1, j: [2, 3], o: { k: 4 } }
    const array = [1, 2, 3, obj]
    const set = [1, 1, 2, 2, array, obj]
    const map = [['a', 1], ['b', 2], [array, obj], [obj, set]]
    const tests = {
      'literal Boolean': !random.boolean(),
      'literal Number': 0 | random.number(),
      'literal String': `${lorem.paragraphs()}`,
      'Boolean Object': new Boolean(random.boolean()),
      'Number Object': new Number(random.number()),
      'String Object': new String(lorem.paragraphs()),
      Date: new Date(),
      BigInt: BigInt(random.hexaDecimal(64)),
      ReExp: /^$/igsm,
      'literal array (empty)': [],
      'literal array': array,
      'Array (empty)': new Array(),
      'Array with empty values': new Array(5),
      Array: new Array(...array),
      'literal Object (empty)': {},
      'literal Object': obj,
      'Object (empty)': new Object(),
      Object: new Object(obj),
      'Set (empty)': new Set(),
      'Map (empty)': new Map(),
      Set: new Set(set),
      Map: new Map(map)
    }
    for (const [k, v] of Object.entries(tests)) {
      test(`Deserialize of a serialized ${k} (${v}) should be strict equal`, () => {
        const json = serialize(v)
        const clone = deserialize(json)
        expect(clone).toStrictEqual(v)
      })
    }
  })
  describe('Test if functions are similar (stringify equality)', () => {
    const fntests = {
      'literal anonymous function': function () {},
      'literal named function': function f () {},
      'Arrow function': () => null,
      Function: new Function('a','b','return a +  b')
    }
    for (const [k, v] of Object.entries(fntests)) {
      test(`Deserialize of a serialized ${k} (${v.toString()}) should be like the original`, () => {
        const json = serialize(v)
        const clone = deserialize(json)
        const cond = isLike(clone, v)
        expect(cond).toBe(true)
      })
    }
  })
  describe('Test binary arrays', () => {
    const types = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, Uint8ClampedArray]
    types.forEach(type => {
      const array = new type([1, 2, random.number()])
      test(`Deserialize of a serialized ${array.constructor.name}[${array}] should be equal`, () => {
        const json = serialize(array)
        const clone = deserialize(json)
        expect(clone).toStrictEqual(array)
        expect(clone.length).toEqual(array.length)
        expect(clone[2]).toEqual(array[2])
      })
    })
    const bigtypes = [BigInt64Array, BigUint64Array]
    bigtypes.forEach(type => {
      const array = new type([1n, 2n, BigInt(random.hexaDecimal(128))])
      test(`Deserialize of a serialized ${array.constructor.name}[${array}] should be equal`, () => {
        const json = serialize(array)
        const clone = deserialize(json)
        expect(clone).toStrictEqual(array)
        expect(clone.length).toEqual(array.length)
        expect(clone[2]).toEqual(array[2])
      })
    })
    const emptypes = [BigInt64Array, BigUint64Array, Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, Uint8ClampedArray]
    emptypes.forEach(type => {
      const array = new type(random.number(32))
      test(`Deserialize of a serialized empty ${array.constructor.name} should be equal`, () => {
        const json = serialize(array)
        const clone = deserialize(json)
        expect(clone).toStrictEqual(array)
        expect(clone.length).toEqual(array.length)
        expect(clone[0]).toEqual(array[0])
      })
    })
  })
})
