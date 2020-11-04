# serialize
Serialize nested objects

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

const json = serialize(a) // json = '{"_class":"A","_key":"","_value":{"n":10}}'

const aa = deserialize(json, A)
aa.inc(5)
```
**2. Serialize and deserializenested objects**

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

const json = serialize(c) // json = '{"_class":"C","_key":"","_value":{"_a":{"_class":"A","_key":"_a","_value":{"n":10}}}}'

const cc = deserialize(json, C, A)
cc.a.inc(5)
```
