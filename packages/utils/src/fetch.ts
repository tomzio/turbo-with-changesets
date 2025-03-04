import qs from './qs'

export const timeout = 5000

export interface IRequestOptions extends RequestInit {
  timeout?: number
}

export const post = async (url: string, body?: any, options?: IRequestOptions) => {
  let controller = new AbortController()
  let timeoutId = setTimeout(() => {
    controller?.abort()
  }, timeout || options?.timeout)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
    signal: controller.signal,
    ...options,
  }). then((response) => {
    if (response.status === 401) {
      // TODO: handle 401
    }
    clearTimeout(timeoutId);
    return response
  })
  return response
}

export const get = async (url: string, params?: any, options?: IRequestOptions) => {
  let controller = new AbortController()
  let _url = url
  if (params) {
    _url = `${url}?${qs.stringify(params)}`
  }
  let timeoutId = setTimeout(() => {
    controller?.abort()
  }, timeout || options?.timeout)
  const response = await fetch(_url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
    ...options,
  }). then((response) => {
    if (response.status === 401) {
      // TODO: handle 401
    }
    clearTimeout(timeoutId);
    return response
  })
  timeoutId = setTimeout(() => {
    controller?.abort()
  }, timeout)
  return response
}
