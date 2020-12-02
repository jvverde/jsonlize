const { serialize, deserialize } = require('../index')
const { random, lorem } = require('faker')
const isClone = require('isClone')

const serdes = (v) => deserialize(serialize(v))

describe('Test circular an cross references', () => {
  const obj = {}
  obj.self = obj // circular reference
  const array = [obj]
  array.push(array) // circular reference
  obj.array = array // cross reference
  const set = new Set([array, obj])
  set.add(set) // circular reference
  obj.set = set // cross reference
  array.push(set) // cross reference
  const map = new Map([[obj, array], [array, set]]) // obj->array->set
  map.set(set, map) // circular reference ???       // obj->array->set->map
  map.set(map, obj) // circular reference ???       // obj->array->set->map->obj
  set.add(map) // cross reference
  obj.map = map // cross reference
  array.push(map) // cross reference
  const tests = {
    obj,
    array,
    set,
    map
  }
  describe('Test cloned (deserialized of serialized) objects are exactly the same', () => {
    for (const [k, v] of Object.entries(tests)) {
      test(`Cloned and ${k} should be strict equal`, () => {
        const clone = serdes(v)
        expect(clone).toStrictEqual(v)
      })
    }
  })
  describe('Test circular references', () => {
    test(`Self property of cloned obj should be the cloned obj itself`, () => {
      const clone = serdes(obj)
      expect(clone.self === clone).toBe(true)
    })
    test(`Second element of cloned array should be the cloned array itself`, () => {
      const clone = serdes(array)
      expect(clone[1] === clone).toBe(true)
    })
    test(`The cloned set should have itself`, () => {
      const clone = serdes(set)
      expect(clone.has(clone)).toBe(true)
    })
    test(`The cloned map should have itself`, () => {
      const clone = serdes(set)
      expect(clone.has(clone)).toBe(true)
    })
    // test(`The cloned {obj, array, set, map} should have clone.obj.array === clone.array`, () => {
    //   const clone = serdes(tests)
    //   expect(clone.obj.array === clone.array).toBe(true)
    // })
  })
  describe('Test cross references', () => {
    ;['array', 'set', 'map'].forEach(v => {
      test(`The object {obj, array, set, map} clone.obj.${v} should be clone.${v}`, () => {
        const clone = serdes(tests)
        expect(clone.obj[v] === clone[v]).toBe(true)
      })
    })
    ;['obj', 'array', 'set', 'map'].forEach((v, k) => {
      test(`The object {obj, array, set, map} clone.array[${k}] should be clone.${v}`, () => {
        const clone = serdes(tests)
        expect(clone.array[k] === clone[v]).toBe(true)
      })
    })
    ;['obj', 'array', 'set', 'map'].forEach((v) => {
      test(`The object {obj, array, set, map} clone.set should have clone.${v}`, () => {
        const clone = serdes(tests)
        expect(clone.set.has(clone[v])).toBe(true)
      })
    })
    ;['obj', 'array', 'set', 'map'].forEach((v) => {
      test(`The object {obj, array, set, map} clone.map should have clone.${v}`, () => {
        const clone = serdes(tests)
        expect(clone.map.has(clone[v])).toBe(true)
      })
    })
    test(`The object {obj, array, set, map} clone.map.get(clone.obj) should be clone.array`, () => {
      const clone = serdes(tests)
      expect(clone.map.get(clone.obj) === clone.array).toBe(true)
    })
    test(`The object {obj, array, set, map} clone.map.get(clone.array) should be clone.set`, () => {
      const clone = serdes(tests)
      expect(clone.map.get(clone.array) === clone.set).toBe(true)
    })
    test(`The object {obj, array, set, map} clone.map.get(clone.set) should be clone.map`, () => {
      const clone = serdes(tests)
      expect(clone.map.get(clone.set) === clone.map).toBe(true)
    })
    test(`The object {obj, array, set, map} clone.map.get(clone.map) should be clone.obj`, () => {
      const clone = serdes(tests)
      expect(clone.map.get(clone.map) === clone.obj).toBe(true)
    })
    // const fntests = {
    //   'literal anonymous function': function () {},
    //   'literal named function': function f () {},
    //   'Arrow function': () => null,
    //   Function: new Function()
    // }
    // for (const [k, v] of Object.entries(fntests)) {
    //   test(`Deserialize of a serialized ${k} (${v}) should be strict equal`, () => {
    //     const json = serialize(v)
    //     const result = deserialize(json)
    //     const cond = isClone(result, v, { strictly: false })
    //     expect(cond).toBe(true)
    //   })
    // }
  })
})
