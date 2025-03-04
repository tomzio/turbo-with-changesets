export function isNil(value: unknown) {
  return value == null
}

/**
 * Checks if `value` is `null`.
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
export function isNull(value: unknown) {
  return value === null
}

/**
 * Checks if `value` is `undefined`.
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
export function isUndefined(value: unknown) {
  return value === undefined
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
export function isObject(value: unknown) {
  var type = typeof value
  return value != null && (type == 'object' || type == 'function')
}

export function isObjectLike(value: unknown) {
  return value != null && typeof value == 'object'
}

export function isString(value: unknown) {
  return (
    typeof value == 'string' ||
    (!Array.isArray(value) && isObjectLike(value) && Object.prototype.toString.call(value) === '[object String]')
  )
}

export function isEmpty(obj: string | any[] | null | any) {
  // null and undefined are "empty"
  if (obj == null) return true

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false
  if (obj.length === 0) return true

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') return true

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false
  }
  return true
}

/**
 * Filters an object by including only properties that satisfy the predicate function.
 * @param object - The object to filter.
 * @param predicate - A function that tests each property value.
 * @returns A new object with only the properties that satisfy the predicate.
 */
export function pickBy<T extends Record<string, any>>(
  object: T,
  predicate: (value: any, key: string) => boolean
): Partial<T> {
  const result: Partial<T> = {}

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key]
      if (predicate(value, key)) {
        // Ensure 'value' is used here
        result[key] = value
      }
    }
  }

  return result
}

/**
 * 过滤对象中的无效值
 *
 * @export
 * @param {any} obj对象
 * @returns
 */
export function filterObj(object: any) {
  const result = pickBy(object, (v: any) => {
    return !isNil(v) && v !== undefined && String(v).trim() !== ''
  })
  return result
}
