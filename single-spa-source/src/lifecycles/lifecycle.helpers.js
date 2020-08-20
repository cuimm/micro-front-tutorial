/**
 * 通过promise链来链式调用，将多个promise方法组合成一个方法
 * const fns = [async () => {}, async () => {}];  flattenFnArray(fns);
 * @param fns
 * @returns {Function}
 */
export function flattenFnArray(fns) {
  fns = Array.isArray(fns) ? fns : [fns];
  return props => {
    fns.reduce((p, fn) => {
      return p.then(() => fn(props))
    }, Promise.resolve());
  };
}
