const { serialize, deserialize } = require('../index')
const { random, lorem } = require('faker')
const isClone = require('isClone')

describe('Test (de)serialize of instances of javascript objects', () => {
  describe('Test if builtin objects are exactly the same', () => {
    const obj = { i: 1, j: [2, 3], o: { k: 4 } }
    const array = [1, 2, 3, obj]
    const set = [1, 1, 2, 2, array, obj]
    const map = [['a', 1], ['b', 2], [array, obj], [obj, set]]
    const tests = {
      'Boolean Object': new Boolean(random.boolean()),
      'literal Boolean': !random.boolean(),
      'Number Object': new Number(random.number()),
      'literal Number': 0 | new Number(random.number()),
      'String Object': new String(lorem.paragraphs()),
      'literal String': `${lorem.paragraphs()}`,
      Date: new Date(),
      BigInt: BigInt(random.hexaDecimal(64)),
      ReExp: /^$/igsm,
      'empty literal array': [],
      'literal array': array,
      'empty Array': new Array(),
      'Array with empty values': new Array(5),
      Array: new Array(...array),
      'empty literal Object': {},
      'literal Object': obj,
      'empty Object': new Object(),
      Object: new Object(obj),
      'empty Set': new Set(),
      'empty Map': new Map(),
      Set: new Set(set),
      Map: new Map(map)
    }
    for (const [k, v] of Object.entries(tests)) {
      test(`Deserialize of a serialized ${k} (${v}) should be strict equal`, () => {
        const json = serialize(v)
        const result = deserialize(json)
        expect(result).toStrictEqual(v)
      })
    }
    const fntests = {
      'literal anonymous function': function () {},
      'literal named function': function f () {},
      'Arrow function': () => null,
      Function: new Function()
    }
    for (const [k, v] of Object.entries(fntests)) {
      test(`Deserialize of a serialized ${k} (${v}) should be strict equal`, () => {
        const json = serialize(v)
        const result = deserialize(json)
        const cond = isClone(result, v, { strictly: false })
        expect(cond).toBe(true)
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
      const array = new type([1n, 2n/*, BigInt(random.hexaDecimal(128))*/])
      test(`Deserialize of a serialized ${array.constructor.name} should be equal`, () => {
        const json = serialize(array)
        const array2 = deserialize(json)
        expect(array2).toEqual(array)
      })
    })
  })
})
