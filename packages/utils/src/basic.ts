import qs from './qs'
import { isEmpty, isNull, isUndefined } from './lodash'

export function randomNo(length: number) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let result = ''
  for (let i = 0; i < length; i++) {
    // eslint-disable-next-line no-bitwise
    result += chars[0 | (Math.random() * 62)]
  }
  return result
}

export function genInstanceId() {
  return randomNo(12)
}

// 生成唯一id
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * HTML转成转义符 (<> & ")
 * @param sHtml
 * @returns {*}
 */
export function html2Escape(sHtml: string) {
  if (isNull(sHtml) || isUndefined(sHtml)) {
    return ''
  }
  return sHtml.replace(/["&<>]/g, function (c) {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] || ''
  })
}

/**
 * 转义符转成HTML (&lt;&gt;&nbsp;&amp;&quot;)
 * @param str
 * @returns {*}
 */
export function escape2Html(string: string) {
  if (isNull(string) || isUndefined(string)) {
    return ''
  }
  const arrayEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' }
  return string.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
    // @ts-ignore
    return arrayEntities[t]
  })
}

export function getRgb(hex: string) {
  const result: any = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

/**
 * 获取文本字节长度
 * @param {*} value 文本
 * @returns 字节长度
 */
export function textLenByte(value: any) {
  let len = 0
  if (value && value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      const char = value.charAt(i)
      // eslint-disable-next-line no-control-regex
      if (/^[\u0000-\u00ffA-Za-z1-9]+$/.test(char)) {
        len += 1
      } else {
        len += 2
      }
    }
  }
  return len
}

/**
 * 地址栏变化时，保留URL参数、url参数处理
 * @param params 需要保留的参数名,默认为['debug']
 * @returns
 */
export function keepUrlParams(params: string[] = ['debug']): string {
  const search = window.location.search.substring(1)
  if (isEmpty(params) || isEmpty(search)) return ''

  const qsParams = qs.parse(search)
  let newParams = ''

  if (Array.isArray(params)) {
    const keepParamsObj: any = {}
    for (const _param of params) {
      const index = Object.keys(qsParams).indexOf(_param)
      if (index !== -1) {
        keepParamsObj[_param] = qsParams[_param]
      }
    }
    if (!isEmpty(keepParamsObj)) {
      newParams = qs.stringify({ ...keepParamsObj })
    }
  }
  console.log('keepUrlParams: ', search, newParams)

  return newParams ? `?${newParams}` : ''
}
