import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const {data = null, url, method = 'get', headers} = config

  const request = new XMLHttpRequest()

  request.open(method.toUpperCase(), url, true)
  // 设置headers['content-type']
  Object.keys(headers).forEach((name) => {
    // data为null时无需设置content-type
    if (data === null && name.toLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })
  request.send(data)
}