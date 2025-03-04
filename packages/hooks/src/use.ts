/**
 * @example
 * function DataComponent() {
 *   const resource = useMemo(() => use(fetchData()), [])
 *   const data = use(resource)
 *   return <div>{data}</div>
 * }
 * @param promise
 * @returns
 */
export function use<T>(promise: Promise<T>) {
  let status = 'pending'
  let result: T
  let error: Error

  const suspender = promise.then(
    (data) => {
      status = 'success'
      result = data
    },
    (err) => {
      status = 'error'
      error = err
    }
  )

  function read() {
    switch (status) {
      case 'pending':
        throw suspender
      case 'error':
        throw error
      case 'success':
        return result
    }
  }

  return { read }
}