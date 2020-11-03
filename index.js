const isValidVarName = require('./isValidName.js')

[123].forEach(n => {
  console.log(n, 'is', isValidVarName(n))
})

const replacer = (key, value) => {
  if (value && value instanceof Object && value.constructor !== Object
    && value.constructor !== String && value.constructor !== Number
    && value.constructor !== Symbol && value.constructor !== Boolean
    && value.constructor !== Array && value.constructor !== Function
    && value.constructor.name
    ) {
    return {
      _class: value.constructor.name,
      _key: key,
      _value: Object.assign({}, value)
    }
  }
  return value
}
const recomposer = (key, value) => {
  if (value instanceof Object && value._class && typeof value._class === 'string'
    && isValidVarName(value._class)
    && typeof value._key === 'string' && value._value instanceof Object) {
    const prototype = eval(value._class).prototype
    console.log('Class:', value._class, prototype)
    console.log('Value', value._value)
    const descriptors = Object.getOwnPropertyDescriptors(value._value)
    console.log('descriptors', descriptors)
    const obj = Object.create(prototype, descriptors)
    console.log('Obj', obj)
    return obj
  }
  return value
}
const encode = (object)  => JSON.stringify(object, replacer)
const decode = (string) => JSON.parse(string, recomposer)

class A {
  constructor(n) {
    this.n = n
    this.a = [1,2]
  }

  inc(n) {
    this.n += n
  }
}

const a = new A(2)
const encoded = encode(a)
console.log('encoded => ', encoded)
const aa = decode(encoded)
console.log('aa => ', aa )
//const aa = decode(encoded, A)
aa.inc(2)
console.log('aa => ', aa)

/*console.log('-------------------------------------')
function ParentClass(n = 3) {
  this.n = n
  this.a = new A(n*n)
  this.sqr = () => n * n;
  this.sub = {
    a:2,
    b:3
  }
  this.nulo = null
  this.undef = undefined
  this.array = [1,3,5,7, {
    x: 3,
    y: 4
  }]
}
ParentClass.prototype.inc = function(n) {this.n += n};

const p = new ParentClass(2)
console.log('ParentClass => ', ParentClass)
console.log('p => ', p)
const ep = encode(p)
console.log('ep => ', ep)
console.log('JSON.parse', JSON.parse(ep) )*/
// const pp = decode(ep, ParentClass)
// pp.inc(2)
// console.log('pp =>', pp)

/* console.log('-------------------------------------')

class B extends A {
  constructor(n) {
    super(n)
    this.cnt = 0
  }
  dec (n) {
    this.inc(-n)
    this.cnt++
  }
}

const b = new B(10)
console.log('B => ', B)
console.log('b => ', b)
const eb = encode(b)
console.log('eb => ', eb)
const bb = decode(eb, B)
bb.dec(2)
console.log('bb => ', bb)

console.log('-------------------------------------')

function ChildClass(n = 1) {
  this.cnt = 0;
  this.n = n
  this.p = new ParentClass(n*n)
}
ChildClass.prototype = new ParentClass;
ChildClass.prototype.dec = function(n) {this.inc(-n); this.cnt++};

const c = new ChildClass(10)
console.log('C => ', ChildClass)
console.log('c => ', c)
console.log('c.p', c.p)
console.log('Object.create(c.p)', Object.create(c.p))
const ec = encode(c)
console.log('ec => ', ec)
const cc = decode(ec, ChildClass)
cc.dec(2)
console.log('cc.p', cc.p)
console.log('cc => ', cc)

console.log('-------------------------------------')

const x = {
  a: 3,
  b: 4,
  f: (a) => 2 * a
}

const ex = encode(x)
console.log('ex => ', ex)
const xx = decode(ex)
console.log('xx => ', xx)
console.log('Object.getPrototypeOf(x)', Object.getPrototypeOf(x))
console.log('Object.getPrototypeOf(a)', Object.getPrototypeOf(a))
console.log('Object.getPrototypeOf(b)', Object.getPrototypeOf(b))
console.log('Object.getPrototypeOf(p)', Object.getPrototypeOf(p))
console.log('Object.getPrototypeOf(c)', Object.getPrototypeOf(c))
let original_class = eval('B')
console.log('original_class', original_class)
console.log('x.prototype', x.constructor === Object)
console.log('x.prototype', x.constructor.name)
console.log('a.prototype', a.constructor.name)
console.log('b.prototype', b.constructor === original_class)
console.log('p.prototype', p.constructor.name)
console.log('c.prototype', c.constructor.name)*/

