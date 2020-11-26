// Global properties
const gp2string = new Map([[undefined, 'undefined'], [Infinity, 'Infinity'], [NaN, 'NaN'], [Math, 'Math']])
const string2gp = new Map([['undefined', undefined], ['Infinity', Infinity], ['NaN', NaN], ['Math', Math]])
module.exports = {
  gp2string,
  string2gp
}