'use strict'
const { serialize, deserialize } = require('../index')
const clone = (v) => deserialize(serialize(v))

let input, out

input = /[a-f]/ig

input.test('A3CB2')

console.log(`match`, RegExp.lastMatch, input.lastIndex) // expected A 1

out = clone(input)

out.test('A3CB2')
console.log(`match`, RegExp.lastMatch, out.lastIndex) /* expected C 3 !!!
  THIS is because out was cloned after first usage,
  so the RegExpInstance.lastIndex was at position 2
*/

out.test('A3CB2')
console.log(`match`, RegExp.lastMatch, out.lastIndex) // expected B 4

input.test('A3CB2')
console.log(`match`, RegExp.lastMatch, input.lastIndex) /* expected C 3 !!!
  input is not modified with operations over it's clone
*/
