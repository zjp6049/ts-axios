import {isPlainObject, isDate} from './util'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/&3A/ig, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/ig, ',')
    .replace(/%20/g, '+') // 空格转+
    .replace(/%5B/ig, '[')
    .replace(/%5D/ig, ']')
}

export function bulidURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const parts: string[] = [] // 保存格式化后参数数组

  Object.keys(params).forEach(key => {
    const val = params[key]
    // 无值
    if (val === null || typeof val === 'undefined') {
      return
    }
    // 统一转换数组格式
    let values: string[]
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    // 转换val为对应格式
    values.forEach((val) => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })

  })
  // 拼接url
  let serializedParams  = parts.join('&')
  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}