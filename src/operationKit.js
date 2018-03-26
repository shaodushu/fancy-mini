/**
 * 封装常用的通用功能函数
 *    存在文件依赖的功能、业务强耦合功能，请勿放置于此，此类功能参考 funcKit 模块
 *    应保证此文件被任意模块引用时，都不会造成循环依赖 （e.g. A引用B，B又引用A）
 */

/**
 * 深度拷贝
 * @param source 源参数
 * @return {*}   源参数的深度拷贝
 */
export function deepClone(source){
  if (typeof source !== "object")
    return source;

  var clone = Array.isArray(source) ? [] : {};
  for (var p in source)
    clone[p] = deepClone(source[p]);

  return clone;
}

/**
 * 深度判等
 * 两个对象结构和数据完全一致，即认为相等，而不要求是同一引用
 * @param o1  参数1
 * @param o2  参数2
 * @return {boolean}  参数1、参数2 是否相等
 */
export function deepEqual(o1, o2) {
  if (typeof o1 !== "object" || typeof o2 !== "object")
    return o1 === o2;

  for (var p in o1) {
    if (!deepEqual(o1[p], o2[p]))
      return false;
  }

  for (var q in o2) {
    if (!(q in o1))
      return false;
  }

  return true;
}

/**
 * 深度覆盖
 * 将源对象的值覆盖目标对象，相同结构相同参数部分直接覆盖，其它部分保持不变
 * @param target 目标对象
 * @param sources  若干个源对象
 *
 * e.g.
 * 修改前：
 *    target = {x: 1, y: {a: 1, b:1 }, z: 1};
 *    source = {x: 2, y: {a: 2}};
 *
 * 修改后：
 *    target = {x: 2, y: {a: 2, b:1 }, z: 1}
 */
export function deepAssign(target, ...sources) {
  if (typeof target !== "object") {
    console.error('[deepAssign] bad parameters, target should be an object, parameters:', arguments);
    return target;
  }

  for (let source of sources) {
    if (source!=null && typeof source !== "object") {
      console.warn('[deepAssign] bad parameters, source should all be object, parameters:', arguments);
      continue;
    }

    for (var p in source) {
      if (typeof target[p] === "object" && typeof source[p] === "object")
        deepAssign(target[p], source[p]);
      else
        target[p] = source[p];
    }
  }

  return target;
}

/**
 * 设置延时
 * @param {number} ms  延迟时长，单位：ms
 * @return {Promise}
 */
export function delay(ms) {
  return new Promise((resolve, reject)=>{
    setTimeout(resolve, ms);
  });
}

/**
 * 版本号比较
 * @param {string} v1 版本号1，形如"2.2.3"
 * @param {string} v2 版本号2
 * @return {number} 比较结果： -1 小于 | 0 等于 | 1 大于
 */
function compareVersion(v1, v2) {
  var seq1 = v1.split(".").map(subVersion=>parseInt(subVersion));
  var seq2 = v2.split(".").map(subVersion=>parseInt(subVersion));

  var len1 = seq1.length, len2 = seq2.length, commonLen = Math.min(len1, len2);
  for (var i=0; i<commonLen; ++i) {
    if (seq1[i] != seq2[i])
      return seq1[i]<seq2[i] ? -1 : 1;
  }

  return len1==len2 ? 0 : (len1<len2 ? -1 : 1);
}
