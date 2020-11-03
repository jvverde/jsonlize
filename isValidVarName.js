module.exports = name => {
  // https://stackoverflow.com/a/19265747
  try {
    new Function(`let ${name} = 0; ${name}++`)
  } catch(e) {
    return false
  }
  return true
}
