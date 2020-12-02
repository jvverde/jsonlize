# Serialize
Serialize Objects, Functions, primitive types, builtin objects, nested objects, class instances, methods, setters and getters, cross and self references objects, Regular Expressions (including status), Maps, Sets, Errors, binary arrays

<!--
  -- This file is auto-generated from README_js.md. Changes should be made there.
  -->

## Setup

**1. Install**

```shell
npm install jsonlize
```

## Usage

**1. Serialize and deserialize an class instance**

```javascript
const { serialize, deserialize } = require('jsonlize')
class A {
  constructor(n) {
    this.n = n
  }
  inc(n) {
    this.n += n
  }
}
const a = new A(10)

const json = serialize(a)

const aa = deserialize(json)
aa.inc(5)
```
**2. Serialize and deserialize nested objects**

```javascript
const { serialize, deserialize } = require('jsonlize')
class A {
  constructor(n) {
    this.n = n
  }
  inc(n) {
    this.n += n
  }
}

class C {
  constructor(n) {
    this._a = new A(n)
  }
  set a (value) {
    this._a = value
  }
  get a () {
    return this._a
  }
}

const c = new C(10)

const json = serialize(c)

const cc = deserialize(json)
cc.a.inc(5)
```
# Limitations
**1. Functions defined in a scope**
If won't work if functions access to scoped variables
```javascript
let obj = {/*...*/}
const f = function(){ return obj.prop }
```
**2. Class Private members**
```javascript
class A{
  #x = 'I am private'
}
```
