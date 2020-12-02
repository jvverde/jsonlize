const transform = (type, assembly, dismantle = v => v) => {
  const trycatch = f => (...args) => {
    try {
      return f(...args)
    } catch (e) {
      console.warn(e)
      console.log('args:', ...args)
      return undefined
    }
  }
  return {
    type,
    prototype: type.prototype,
    descriptors: Object.getOwnPropertyDescriptors(type.prototype),
    dismantle: trycatch(dismantle),
    assembly: trycatch(assembly)
  }
}
const builtins = { // javascript builtin objects
  Number: transform(Number, v => new Number(v)),
  String: transform(String, v => new String(v)),
  Boolean: transform(Boolean, v => new Boolean(v)),
  Date: transform(Date, v => new Date(v)),
  BigInt: transform(BigInt, v => BigInt(v), v => v.toString()),
  RegExp: transform(
    RegExp,
    v => {
      const exp = new RegExp(v.source, v.flags)
      if (v.lastIndex) exp.lastIndex = v.lastIndex
      return exp
    },
    v => {
      const { source, flags, lastIndex } = v
      return { source, flags, lastIndex }
    }
  ),
  Symbol: transform(Symbol, v => Symbol(v), v => v.description),
  Error: transform(
    Error,
    v => {
      const err = new Error(v.message || '')
      if (v.name) err.name = v.name
      return err
    },
    v => {
      const { message, name } = v
      return { message, name }
    }
  ),
  Set: transform(
    Set,
    (v, compose) => new Set(v.map(e => compose(e))),
    (v, decompose) => [...v].map(v => decompose(v))
  ),
  Map: transform(
    Map,
    (v, compose) => new Map(v.map(e => compose(e))),
    (v, decompose) => [...v].map(v => decompose(v))
  ),
  Int8Array: transform(Int8Array, v => new Int8Array(v), v => Array.from(v)),
  Uint8Array: transform(Uint8Array, v => new Uint8Array(v), v => Array.from(v)),
  Int16Array: transform(Int16Array, v => new Int16Array(v), v => Array.from(v)),
  Uint16Array: transform(Uint16Array, v => new Uint16Array(v), v => Array.from(v)),
  Int32Array: transform(Int32Array, v => new Int32Array(v), v => Array.from(v)),
  Uint32Array: transform(Uint32Array, v => new Uint32Array(v), v => Array.from(v)),
  Float32Array: transform(Float32Array, v => new Float32Array(v), v => Array.from(v)),
  Float64Array: transform(Float64Array, v => new Float64Array(v), v => Array.from(v)),
  Uint8ClampedArray: transform(Uint8ClampedArray, v => new Uint8ClampedArray(v), v => Array.from(v)),
  BigUint64Array: transform(
    BigUint64Array,
    (v, compose) => new BigUint64Array(v.map(e => compose(e))),
    (v, decompose) => Array.from(v).map(e => decompose(e))
  ),
  BigInt64Array: transform(
    BigInt64Array,
    (v, compose) => new BigInt64Array(v.map(e => compose(e))),
    (v, decompose) => Array.from(v).map(e => decompose(e))
  ),
  Function: transform(
    Function,
    // Idea from https://ovaraksin.blogspot.com/2013/10/pass-javascript-function-via-json.html
    v => new Function('return ' + v)(),
    v => {
      const string = v.toString()
      if (string.indexOf('[native code]') > -1) {
        return v.name
      }
      const fn = string.split(/[{(]/)[0] // fn could be '' in case arrow function () => something
      console.log('string', string)
      console.log('fn', fn)
      if (fn && !fn.match(/=>|function|class|Function/)) { //for cases where the function is a getter, setter, or class method
        const xetter = /^set\s+|^get\s+/
        if (v.name) { // most probably
          const fname = v.name.replace(xetter,'')
          return `{ ${string.replace(xetter,'')} }.${fname}`;
        } else {  // but... just in case of something else
          return 'function ' + string
        }
      }
      return string
    }
  )
}

module.exports = builtins
