const { serialize, deserialize } = require('../index')
const { isClone, isLike } = require('isClone')

describe('Test Regular Expressions', () => {
  const re = /[a-f]/ig
  re.test('A3CB2')
  describe('Test if a deserialized of a serialize of a RE preserve all properties', () => {
    test(`Deserialize of a serialized ${re} is a exactly clone`, () => {
      const json = serialize(re)
      const clone = deserialize(json)
      expect(isClone(clone, re)).toBe(true)
      clone.test('A3CB2')
      expect('C' === RegExp.lastMatch && 3 === clone.lastIndex).toBe(true)
      clone.test('A3CB2')
      expect('B' === RegExp.lastMatch && 4 === clone.lastIndex).toBe(true)
    })
  })
})
