import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { paraseHeaders } from './helpers/helpers'
import { createError } from './helpers/error';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {data = null, url, method = 'get', headers, responseType, timeout} = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      // readyState = 4是成功状态码
      if (request.readyState !== 4) {
        return
      }
      // 网络错误 超时错误status = 0
      if (request.status === 0) {
        return
      }

      const responseHeaders = paraseHeaders(request.getAllResponseHeaders()) // getAllResponseHeaders转为对象
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }

    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeoutof ${timeout}ms`, config, 'ECONNABORTEO', request))
    }

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

    // 辅助函数处理如果是 2xx 的状态码，则认为是一个正常的请求，否则抛错
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(createError(`Request failed with status code ${response.status}`, config, null, request, response))
      }
    }
  })
}