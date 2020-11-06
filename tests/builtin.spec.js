const { serialize, deserialize } = require('../index')
const { random, lorem } = require('faker')

describe('Test (de)serialize of instances of javascript builtin objects', () => {
  describe('Test basic type arrays', () => {
    for (let cnt = 1; cnt-->0; ){
      const bool = new Boolean(random.boolean())
      test(`Deserialize of a serialized Boolean Object (${bool}) should be strict equal`, () => {
        const json = serialize(bool)
        const result = deserialize(json)
        expect(result).toStrictEqual(bool)
      })
      const pbool = random.boolean() === random.boolean() // force it to be a primitive boolean
      test(`Deserialize of a serialized primitive boolean (${pbool}) should be strict equal`, () => {
        const json = serialize(pbool)
        const result = deserialize(json)
        expect(result).toStrictEqual(pbool)
      })
      const number = new Number(random.number())
      test(`Deserialize of a serialized Number Object (${number}) should be strict equal`, () => {
        const json = serialize(number)
        const result = deserialize(json)
        expect(result).toStrictEqual(number)
      })
      const pnumber = 0 | number // force it to be a primitive number
      test(`Deserialize of a serialized primitive Number (${pnumber}) should be strict equal`, () => {
        const json = serialize(pnumber)
        const result = deserialize(json)
        expect(result).toStrictEqual(pnumber)
      })
      const string = new String(lorem.paragraphs())
      test(`Deserialize of a serialized String Object (${string}) should be strict equal`, () => {
        const json = serialize(string)
        const result = deserialize(json)
        expect(result).toStrictEqual(string)
      })
      const pstring = '' + string // force it to be a primitive string
      test(`Deserialize of a serialized primitive string (${pstring}) should be strict equal`, () => {
        const json = serialize(pstring)
        const result = deserialize(json)
        expect(result).toStrictEqual(pstring)
      })
      const date = new Date()
      test(`Deserialize of a serialized of date object (${date}) should be strict equal`, () => {
        const json = serialize(date)
        const result = deserialize(json)
        expect(result).toStrictEqual(date)
      })
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
      const bint = BigInt(random.hexaDecimal(64))
      test(`Deserialize of a serialized of BigInt (${bint}) should be exactly the same`, () => {
        const json = serialize(bint)
        const result = deserialize(json)
        expect(result).toStrictEqual(bint)
      })
      const re = /^[a-f]{3,}$/igsm
      test(`Deserialize of a serialized of Regex (${re}) should be also a re`, () => {
        const json = serialize(re)
        const result = deserialize(json)
        expect(result.test('abcd')).toBe(true)
        expect(result.test('1234\nabcd')).toBe(true)
      })
      const obj = new Object()
      test(`Deserialize of a serialized of Object should be exactly the same`, () => {
        const json = serialize(obj)
        const result = deserialize(json)
        expect(result).toStrictEqual(obj)
      })
      const lobj = {}
      test(`Deserialize of a serialized of literal Object should be exactly the same`, () => {
        const json = serialize(lobj)
        const result = deserialize(json)
        expect(result).toStrictEqual(lobj)
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
