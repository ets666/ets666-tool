
import fs from 'fs'
// import path from 'path'
// import { exec } from 'child_process'

export default class handleFiles {
  static isExists (path, fileName) {
    fileName = '/' + fileName
    const pathStr = path.join(path, fileName)
    fs.access(pathStr, fs.F_OK, (err) => {
      if (err) {
        throw Error('file not exists!')
        // return false
      }
      return true
    })
  }
}
