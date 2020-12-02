// Primitive values
const primitive2string = new Map([[undefined, 'undefined'], [Infinity, 'Infinity'], [NaN, 'NaN'], [Math, 'Math']])
const string2primitive = new Map([['undefined', undefined], ['Infinity', Infinity], ['NaN', NaN], ['Math', Math]])
module.exports = {
  primitive2string,
  string2primitive
}