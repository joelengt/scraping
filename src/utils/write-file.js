import fs from 'fs'

export const writeFile = (path, buffer) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, buffer, (error) => {
      if (error) {
        reject(new Error(error))
      } else {
        resolve(path)
      }
    })
  })
}
