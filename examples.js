const { serialize, deserialize } = require('./index')

function getAllPropertyNames(obj) {
  let result = new Set()
  while (obj) {
      Object.getOwnPropertyNames(obj).forEach(p => result.add(p));
      obj = Object.getPrototypeOf(obj);
  }
  return [...result]
}

const today = new Date()

console.log(today)
console.log(today.getTime())
for (const i in today) {
  console.log(`${i}:${today[i]}`)
}

const s = new  String('abc')
console.log(today instanceof Object)
console.log(today instanceof Date)
console.log(s instanceof Object)
console.log(s instanceof String)
// const json = serialize(today)
// console.log(json)
