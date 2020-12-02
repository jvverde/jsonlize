const { serialize, deserialize } = require('../index')

describe('Test primitive values', () => {
  describe('Test if a deserialized of a serialize of a primitive value is exactly the same', () => {
    for (const p of [undefined, null, Infinity, 0, 1, -1, 3.5, 2/3, '', 'abc', true, false,
        Math.random(), -1 * Math.random(),
        (1 + Math.random()) / (1 + Math.random()),
        11111111111111111111111111111111111111111111111111111111111111111111111n,
      ]) {
      test(`Deserialize of a serialized ${p} should be ${p}`, () => {
        const json = serialize(p)
        const clone = deserialize(json)
        expect(clone === p).toBe(true)
        expect(typeof clone === typeof p).toBe(true)
      })
    }
    const s = Symbol('Sym')
    test(`Deserialize of a serialized Symbol ${s.toString()} should be equal to Symbol`, () => {
      const json = serialize(s)
      const clone = deserialize(json)
      expect(clone.description === s.description).toBe(true)
      expect(typeof clone === 'symbol').toBe(true)
    })
  })
})
