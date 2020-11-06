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
