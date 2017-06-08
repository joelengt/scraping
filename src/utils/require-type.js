export const requireType = file => {
  let mod = require(`../types/${file}`)
  return mod
}
