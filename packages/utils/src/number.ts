export function toNumber(value: unknown) {
  return value && !Number.isNaN(value) ? Number(value) : value
}

/**
 * 格式化小数位
 * @param {*} value 数值
 * @param {*} precision 小数位数
 */
export function toPrecision(value: unknown, precision: number) {
  if (value) {
    if (!Number.isNaN(precision)) {
      const _value = Number(value)
        .toFixed(precision)
        .replace(/(?:\.0+|(\.\d+?)0+)$/, '$1')
      return toNumber(_value)
    }
    const _value = Number(value)
      .toString()
      .replace(/(?:\.0+|(\.\d+?)0+)$/, '$1')
    return toNumber(_value)
  }
  return toNumber(value)
}
