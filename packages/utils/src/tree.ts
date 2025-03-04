import { isEmpty, isNil, isObject } from './lodash'

function iteratee(children: any[], parent: any, cb: Function) {
  if (!isNil(children)) {
    if (children.length > 0) {
      children.forEach((data) => {
        // 遍历执行回调方法
        cb && cb(data, parent)
        if (data.children) {
          if (isEmpty(data.children)) {
            delete data.children
          } else {
            data.children = iteratee(data.children, data, cb)
          }
        }
      })
    }
  }
  return children
}

/**
 * 递归遍历树形结构数据
 * @param {*} treeData
 * @param {*} cb
 */
export function iterateTree(treeData: any, cb: any) {
  if (isNil(treeData)) {
    return treeData
  }
  if (Array.isArray(treeData)) {
    iteratee(treeData, null, cb)
  } else if (isObject(treeData)) {
    iteratee([treeData], null, cb)
  }
  return treeData
}

function _mapTree(treeData: any, cb: Function) {
  if (isEmpty(treeData)) {
    return treeData
  }
  // 遍历执行回调方法
  if (treeData.children) {
    if (isEmpty(treeData.children)) {
      delete treeData.children
    } else {
      treeData.children = treeData.children && treeData.children.map((child: any) => _mapTree(child, cb))
    }
  }
  const newTreeData = cb && cb(treeData)
  return {
    // ...treeData,
    key: treeData.key,
    children: treeData.children,
    ...newTreeData,
  }
}

/**
 * @example
 *  const newTreeData = mapTree(menuTreeList, nodeData => {
      const { key, menuName, children } = nodeData;
      return { key, title: menuName, children }
    })
 * @param treeData
 * @param cb
 * @returns newTreeData
 */
export function mapTree(treeData: any, cb: Function) {
  let newTreeData
  if (Array.isArray(treeData)) {
    newTreeData = treeData && treeData.map((tree) => _mapTree(tree, cb))
  } else {
    newTreeData = _mapTree(treeData, cb)
  }
  return newTreeData
}

/**
 *
 * @param keyArray
 * @param array
 * @param valueField
 * @param childrenField
 */
function getChildField(keyArray: any[], array: any[], valueField: string, childrenField: string) {
  if (isEmpty(array) || !Array.isArray(array)) {
    return
  }
  array.map((value) => {
    if (value && !isEmpty(value[childrenField])) {
      keyArray.push(value[childrenField])
      getChildField(keyArray, value[childrenField], valueField, childrenField)
    }
  })
}

/**
 * @description 获取树的所有节点的key(不包含叶子节点)
 * @param {Array} array 树的数组
 * @param {String} valueField key的名称
 * @param {String} childrenField 孩子节点名称
 * @returns {Array}
 */
export function getTreeKeys(array: any, valueField: string = 'key', childrenField: string = 'children'): any[] {
  if (isEmpty(array) || !Array.isArray(array)) {
    return []
  }
  const keyArray: any[] = []
  getChildField(keyArray, array, valueField, childrenField)
  return keyArray
}
