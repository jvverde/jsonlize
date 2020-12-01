// show all prototype chain
function getAllProtoChain(obj, tab='') {
  if (!obj) return
  const props = Object.getOwnPropertyDescriptors(obj)
  const symbols = Object.getOwnPropertySymbols(obj)
  const proto = Object.getPrototypeOf(obj)
  console.log(`${tab}constructor::`, obj.constructor)
  console.log(`${tab}constructor.toString()::`, (obj.constructor || '').toString())
  console.log(`${tab}proto::`, proto)
  console.log(`${tab}props.constructor::`, props.constructor)
  console.log(`${tab}typeof props.constructor::`, typeof props.constructor)
  console.log(`${tab}props.constructor.toString()::`, props.constructor.toString())
  console.log(`${tab}props.constructor.value.toString()::`, (props.constructor.value || '').toString())
  // console.log(`${tab}symbols::`, symbols)
  if (proto) {
    Object.keys(props).forEach( p => {
      if (props[p].value instanceof Function) props[p].value = props[p].value.toString()
      console.log(`${tab}prop[${p}]::`, props[p])
    })
  }
  getAllProtoChain(proto, tab + '>>')
}
module.exports = getAllProtoChain
