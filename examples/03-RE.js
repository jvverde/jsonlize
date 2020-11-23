'use strict'
const { serialize, deserialize } = require('../index')
const serdes = (v) => deserialize(serialize(v))

const re = /[a-f]/ig

re.test('A3CB2')

console.log('A' === RegExp.lastMatch && 1 === re.lastIndex)

const clone = serdes(re)

clone.test('A3CB2')
console.log('C' === RegExp.lastMatch && 3 === clone.lastIndex) /*
  THIS is because clone was cloned after first usage,
  so the RegExpInstance.lastIndex was at position 2
*/

clone.test('A3CB2')
console.log('B' === RegExp.lastMatch && 4 === clone.lastIndex)

re.test('A3CB2')
console.log('C' === RegExp.lastMatch && 3 === re.lastIndex) /*
  re is not modified with operations over it's clone
*/
