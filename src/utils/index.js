import i18n from '@/lang'
import { ElMessage } from 'element-plus'

// 十六进制转ascii
export function hex2a (hexx) {
  var hex = hexx.toString()// force conversion
  var str = ''
  for (var i = 0; i < hex.length; i += 2) { str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)) }
  return str
}

// ascii转十六进制
export function a2hex (str) {
  var arr = []
  for (var i = 0, l = str.length; i < l; i++) {
    var hex = Number(str.charCodeAt(i)).toString(16)
    arr.push(hex)
  }
  return arr.join('')
}

export function hex2utf8 (str) {
  const buf = Buffer.from(str, 'hex')
  return buf.toString('utf8')
}

export function errCatch (type) {
  let result = true
  switch (type) {
    case 'invalidPath':
      ElMessage.error(i18n.global.t('error.invalidPath'))
      break
    case 'fileNotExist':
      ElMessage.error(i18n.global.t('error.fileNotExist'))
      break
    case 'saveNotFound':
      ElMessage.error(i18n.global.t('error.saveNotFound'))
      break
    default:
      result = false
      break
  }
  return result
}
