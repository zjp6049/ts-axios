import { isPlainObject } from './util'
// 规范化headers content-type
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach((name) => {
    // 统一 Content-Type 大小写
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}
// 设置默认content-type
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) { // 若无data无需设置content-type否侧设置默认值
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=urf-8'
    }
  }
  return headers
}

export function paraseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  // 换行符回车符分割json对象
  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })
  return parsed
}