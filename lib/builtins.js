const transform = (assembly, dismantle = v => v) => {
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
    dismantle: trycatch(dismantle),
    assembly: trycatch(assembly)
  }
}
const builtins = { // javascript builtin objects
  Number: transform(v => new Number(v)),
  String: transform(v => new String(v)),
  Boolean: transform(v => new Boolean(v)),
  Date: transform(v => new Date(v)),
  BigInt: transform(v => BigInt(v), v => v.toString()),
  RegExp: transform(
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
  Symbol: transform(v => Symbol(v), v => v.description),
  Error: transform(
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
    (v, compose) => new Set(v.map(e => compose(e))),
    (v, decompose) => [...v].map(v => decompose(v))
  ),
  Map: transform(
    (v, compose) => new Map(v.map(e => compose(e))),
    (v, decompose) => [...v].map(v => decompose(v))
  ),
  Int8Array: transform(v => new Int8Array(v), v => Array.from(v)),
  Uint8Array: transform(v => new Uint8Array(v), v => Array.from(v)),
  Int16Array: transform(v => new Int16Array(v), v => Array.from(v)),
  Uint16Array: transform(v => new Uint16Array(v), v => Array.from(v)),
  Int32Array: transform(v => new Int32Array(v), v => Array.from(v)),
  Uint32Array: transform(v => new Uint32Array(v), v => Array.from(v)),
  Float32Array: transform(v => new Float32Array(v), v => Array.from(v)),
  Float64Array: transform(v => new Float64Array(v), v => Array.from(v)),
  Uint8ClampedArray: transform(v => new Uint8ClampedArray(v), v => Array.from(v)),
  BigUint64Array: transform(
    (v, compose) => new BigUint64Array(v.map(e => compose(e))),
    (v, decompose) => Array.from(v).map(e => decompose(e))
  ),
  BigInt64Array: transform(
    (v, compose) => new BigInt64Array(v.map(e => compose(e))),
    (v, decompose) => Array.from(v).map(e => decompose(e))
  ),
  Function: transform(
    // Idea from https://ovaraksin.blogspot.com/2013/10/pass-javascript-function-via-json.html
    v => new Function('return ' + v)(),
    v => {
      let string = v.toString()
      if (string.indexOf('[native code]') > -1) {
        return v.name
      }
      const fn = string.split('{')[0]
      if (!fn.match(/=>|function|class|Function/)) string = 'function ' + string
      return string
    }
  )
}

module.exports = builtins
