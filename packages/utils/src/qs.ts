type Params = Record<string, any>;

function encode(value: any): string {
  return encodeURIComponent(value);
}

function decode(value: string): string {
  return decodeURIComponent(value.replace(/\+/g, " "));
}


function parseKeyValue(key: string, value: any, target: Params) {
  const keys = key.split(/\]\[|\[|\]/).filter(Boolean); // 解析键路径，例如 "address[city]" -> ["address", "city"]
  let current = target;

  keys.forEach((k, index) => {
    if (index === keys.length - 1) {
      // 最后一个键，设置值
      if (Array.isArray(current[k])) {
        current[k].push(value); // 如果已经是数组，追加值
      } else if (current[k] !== undefined) {
        current[k] = [current[k], value]; // 如果已存在值，转换为数组
      } else {
        current[k] = value; // 否则直接设置值
      }
    } else {
      // 非最后一个键，继续深入对象
      if (current[k] === undefined) {
        current[k] = /^\d+$/.test(keys[index + 1]) ? [] : {}; // 如果下一个键是数字，则当前键为数组
      }
      current = current[k];
    }
  });
}

export function parse(queryString: string): Params {
  const result: Params = {};

  if (!queryString) {
    return result;
  }

  queryString.split("&").forEach((pair) => {
    const [key, value] = pair.split("=").map(decode); // 解码键和值
    parseKeyValue(key, value, result);
  });

  return result;
}


export function stringify(params: Params, prefix: string = ""): string {
  const query = Object.keys(params).map((key) => {
    const value = params[key];
    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      // 递归处理嵌套对象
      return stringify(value, fullKey);
    } else if (Array.isArray(value)) {
      // 处理数组
      return value
        .map((item, index) => {
          const arrayKey = `${fullKey}[${index}]`;
          return `${encode(arrayKey)}=${encode(item)}`;
        })
        .join("&");
    } else {
      // 处理普通键值对
      return `${encode(fullKey)}=${encode(value)}`;
    }
  });

  return query.join("&");
}

export default {
  parse,
  stringify,
}