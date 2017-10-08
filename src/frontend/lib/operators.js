import _ from "lodash";

export function objectMap(obj, valMap, keyMap: ?(key) => any) {
  return Object.keys(obj).reduce((val, x) => {
    const key = keyMap ? keyMap(x) : x;
    return Object.assign({}, val, {[key]: valMap(obj[x], key)});
  }, {});
}

/**
 * Returns if a list of objects has entries where every property is defined
 * @param array
 */
export function all(array: any[]): boolean {
  return array.every(obj => allProperties(obj));
}

export function allProperties(obj): boolean {
  return Object.keys(obj).every((key) => {
    if (!_.isNull(obj[key]) && _.isObject(obj[key])) {
      return allProperties(obj[key]);
    } else {
      return isDefined(obj[key]);
    }
  });
}

export function isDefined(x) {
  return !_.isNull(x) && !_.isUndefined(x);
}

/**
 * Returns a list of objects where items have all values defined
 * @param array
 */
export function filterUndefined(array: any[]): any[] {
  return isDefined(array) ? array.filter(allProperties) : [];
}

export function execEvery(fn, ms) {
  let now = new Date(), delay = ms - now % ms;
  let id;
  setTimeout(() => {
    fn();
    id = setInterval(fn, ms);
  }, delay);
  return () => clearInterval(id);
}
