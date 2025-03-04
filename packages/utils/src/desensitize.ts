function isNil(value: unknown) {
  return value == null || value == undefined;
}

export const DesensitizeType = {
  name: 'DESENSITIZE_NAME',
  phone: 'DESENSITIZE_PHONE',
  id: 'DESENSITIZE_ID',
};

function multiSplit(array: string[], separator: string) {
  if (isNil(array)) {
    return;
  }
  const result = <any>[];
  for (const str of array) {
    const _result = isNil(str) ? null : str.split(separator);
    if (_result) {
      result.push(..._result);
    } else {
      result.push(str);
    }
  }
  return result;
}

export function split(text: string, separator: string[]) {
  if (isNil(text)) {
    return;
  }
  let result = <any>[];
  const firstSep = separator.shift();
  if (firstSep) {
    result = text.split(firstSep) as [];
    for (const sep of separator) {
      result = result && multiSplit(result, sep);
    }
  }
  return result;
}

/**
 * 关键信息脱敏处理
 * @param str 字符串
 * @param startLen 字符串开始保留位数
 * @param endLen 字符串结尾保留位数
 * @returns {string}
 */
export function hideText(str: string, startLen = 0, endLen = 0) {
  if (typeof str !== 'string') {
    return str;
  }
  const len = str.length - startLen - endLen;
  let xing = '';
  for (let i = 0; i < len; i++) {
    xing += '*';
  }
  return str.substring(0, startLen) + xing + str.substring(str.length - endLen);
}

/**
 * 将文本按分隔符分段脱敏处理
 * @param {*} text 输入文本
 * @param {*} sep 分隔符数组，默认值[' ', '·', '.', '-', '_']
 * @param {*} cb 分隔后的每段字符串的回调处理
 */
export function desensitize(text: string, sep: string[] | null, cb: Function) {
  let result = text;
  if (!isNil(text)) {
    // 识别 中/英 文
    const iscn = /.*[\u4e00-\u9fa5]+.*$/.test(text);
    const lang = iscn ? 'cn' : 'en';

    // 分词处理
    const separator = sep || [' ', '·', '.', '-', '_'];
    const array = <any>split(text, separator);

    const replaceMapping = <any>[];
    if (array) {
      for (const str of array) {
        const replaceText = cb ? cb(str, lang, array) : str;
        replaceMapping.push({
          origin: str,
          replace: replaceText,
        });
      }

      for (const mapping of replaceMapping) {
        const { origin, replace } = mapping;
        result = result.replace(origin, replace);
      }
    }
  }
  return result;
}

/**
 * 人名脱敏处理
 * @param {string} name
 * @example 张三 | 王大民 | 上官婉儿 | 阿布·阿拔斯·阿卜杜拉·伊本·穆罕默德·萨法赫 | Osama bin Muhammad bin Awad bin Laden
 */
export function desensitizeName(name: any) {
  if (typeof name !== 'string') {
    return name;
  }
  return desensitize(name, null, (str: string, lang: string, array: string[]) => {
    let result = str;
    const len = typeof str === 'string' ? str.length : 0;
    if (lang === 'cn') {
      // 中文名字
      if (len >= 5) {
        result = hideText(str, 2, 0);
      } else if (len === 4) {
        result = hideText(str, 2, 0);
      } else if (len === 3) {
        result = hideText(str, 1, 1);
      } else if (len === 2) {
        result = hideText(str, 1, 0);
      }
    } else if (lang === 'en') {
      if (array.length > 1 && array.indexOf(str) === 0) {
        // 如果有多段，英文状态下第一段不作处理
      } else {
        // 英文名字
        if (len >= 5) {
          result = hideText(str, 2, 0);
        } else if (len === 4) {
          result = hideText(str, 1, 0);
        } else if (len === 3) {
          result = hideText(str, 1, 0);
        } else if (len === 2) {
          result = hideText(str, 1, 0);
        }
      }
    }
    return result;
  });
}

/**
 * 联系电话脱敏处理
 * @param {string} phone
 * @example +86 010-65505277 | +86 592 5390000 | +86 13720032753
 * @example 65505277 | 65505277-052 | 010-65505277 | 010 65505277 | (010)65505277 | 010-65505277-052
 */
export function desensitizePhone(phone: string) {
  if (typeof phone !== 'string') {
    return phone;
  }

  // 如果有两个连续的**,则不处理
  if (phone.indexOf('**') !== -1) {
    return phone;
  }

  // 处理 158-6868-8686 类似固定格式的手机号码
  const pattern = /(\d{3})-(\d{4})-(\d{4})/;
  if (pattern.test(phone)) {
    return phone.replace(pattern, '$1****$3');
  }

  // 处理手机和电话
  const hidePhone = (s: string, len: number) => {
    let result = s;
    if (len >= 11) {
      result = hideText(s, 3, 4);
    } else if (len >= 7) {
      result = hideText(s, 2, 3);
    }
    return result;
  };

  return desensitize(phone, ['(', ')', ' ', '-'], (str: string, _lang: any, array: string[]) => {
    let result = str;
    let len = 0;
    if (typeof str === 'string') {
      len = str.startsWith('+') ? str.length - 3 : str.length;
    }

    if (array.length === 1) {
      // 没国家、区号的手机号
      if (len >= 6) {
        result = hidePhone(str, len);
      } else {
        // 当只有一段号码, 且小于6位数时，按一定规则脱敏处理
        const hideLen = Math.floor(len / 2);
        const hideStart = Math.floor(hideLen / 2);
        result = hideText(str, 1, len - hideStart - hideLen);
      }
    } else if (array.length > 1) {
      // 电话号码包含 国家、区号、电话号码、分机号等多段组成，只处理分段大于6位数的号码部分
      if (len >= 6) {
        if (array.indexOf(str) === 0) {
          result = hidePhone(str, len);
        } else {
          // 如果号码前面有国家或区号, 则号码只显示后4位数
          result = hideText(str, 0, 4);
        }
      }
    }
    return result;
  });
}

/**
 * 证件号脱敏处理
 * @param {string} idNo
 * @example 445478199804254548
 */
export function desensitizeIdNo(idNo: string) {
  if (typeof idNo !== 'string') {
    return idNo;
  }
  return desensitize(idNo, null, (str: any, _lang: any, _array: any) => {
    let result = str;
    const len = typeof str === 'string' ? str.length : 0;
    if (len > 7) {
      result = hideText(str, 3, 4);
    } else if (len > 4) {
      result = hideText(str, 2, 2);
    }
    return result;
  });
}
