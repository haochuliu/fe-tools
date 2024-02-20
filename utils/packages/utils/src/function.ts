/**
 * @module Function
 * @author Wayne
 * @createTime 2022-03-12 14:44:00
 * @LastEditTime 2024-02-18 10:59:13
 */

export const NOOP = () => '';

/**
 * @funciton attempt
 * @description 试执行传入的函数 fn，并返回其执行结果。
 * @param {Function} fn
 * @param {unknown} args
 * @return {unknown}
 * @example
attempt((a, b) => a + b, 1, 2); // 3
 */
export function attempt<T extends unknown[], R>(fn: (...fnArgs: T) => R, ...args: T): Error | R {
  try {
    return fn(...args);
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * @function defer
 * @description 将指定的函数延迟执行，将其放到事件队列的最后，等待当前执行栈中的代码全部执行完毕后再执行
 * @param {Function} fn
 * @param  {...unknown[]} args
 * @return {number}
 * @example
function printHello() {
  console.log('Hello, world!');
}

defer(printHello);
console.log('This is printed first.');

// 输出：
// This is printed first.
// Hello, world!
 */
export function defer(fn: (...ks: unknown[]) => unknown, ...args: unknown[]) {
  return setTimeout(fn, 1, ...args);
}

/**
 * @function runPromisesInSeries
 * @description 队列执行promise
 * @param {Promise[]} ps
 * @return {Promise}
 * @example
async function fetchData(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

const urls = ['https://api.example.com/data1', 'https://api.example.com/data2', 'https://api.example.com/data3'];

runPromisesInSeries(urls.map(url => () => fetchData(url)))
  .then(results => console.log(results))
  .catch(error => console.error(error));
 */
export function runPromisesInSeries(ps: Array<(...args: unknown[]) => Promise<any>>) {
  return ps.reduce((p, next) => p?.then(next), Promise.resolve());
}

/**
 * @function timeTaken
 * @description 测量执行一个函数所需要的时间
 * @param {Function} fn
 * @return {any}
 * @example
async function fetchData(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

await timeTaken(fetchData, 'https://api.example.com/data');
 */
export function timeTaken(fn: (...ks: unknown[]) => unknown, ...args: unknown[]) {
  console.time('timeTaken');
  const res = fn(...args);
  console.timeEnd('timeTaken');
  return res;
}

/**
 * @function memoize
 * @description 缓存函数
 * @param {Function} fn
 * @return {Function}
 * @example
function expensiveCalculation(n: number) {
  console.log('Calculating...');
  return n * 2;
}
const cachedCalculation = memoize(expensiveCalculation);

console.log(cachedCalculation(5)); // 输出 "Calculating... 10"
console.log(cachedCalculation(5)); // 输出 "10"，没有输出 "Calculating..."
 */
export function memoize(fn: (...args: unknown[]) => unknown) {
  const cache = new Map();
  const cached = function (val: unknown) {
    return cache.has(val) ? cache.get(val) : cache.set(val, fn(val)) && cache.get(val);
  };
  cached.cache = cache;
  return cached;
}

/**
 * @function once
 * @description 单例执行的函数处理
 * @param {Function} fn
 * @return {Function}
 * @example
function log () { console.log('log'); }
const logOnce = once(log);
logOnce();  // 'log'
logOnce();  // 无日志
 */
export function once(fn: (...args: unknown[]) => unknown) {
  let _called = false;
  return function (...argus: unknown[]) {
    if (!_called) {
      _called = true;
      fn(...argus);
    }
  };
}

/**
 * @function chainAsync
 * @description 链式执行函数
 * @param {...Function[]} fns
 * @example 
chainAsync([next => { console.log(1); setTimeout(next, 1000)}, next => { console.log(2);} ])
 */
export function chainAsync(fns: Array<(...args: unknown[]) => unknown>) {
  let curr = 0;
  const next = () => fns[curr++](next);
  next();
}

/**
 * @function compose
 * @description 组合函数
 * @param  {...function} fns
 * @example
 * const add5 = x => x + 5;
 * const multiply = (x, y) => x * y;
 * const multiplyAndAdd5 = compose(add5, multiply);
 * multiplyAndAdd5(5, 2);
 */
export function compose<T>(...fns: Array<(...arg: T[]) => T>): (arg: T) => T {
  return fns.reduce(
    (f, g) =>
      (...arg) =>
        f(g(...arg))
  );
}

/**
 * @function pipe
 * @description 管道执行函数
 * @param  {...function} fns
 * @example
 * const add = (x, y) => x + y;
 * const multiply2 = (x) => x * 2;
 * const multiplyAndAdd = pipe(add, multiply2);
 * multiplyAndAdd(5, 2);
 */
export function pipe<T extends unknown[]>(...fns: Array<(...arg: any[]) => any>) {
  return fns.reduce(
    (f, g) =>
      (...arg: T[]) =>
        g(f(...arg))
  );
}

/**
 * @function curry
 * @description 柯里化
 * @param {Function} fn
 * @param {number} arity
 * @param  {...any} args
 * @return {Function}
 * @example
 * curry(Math.pow)(2)(10)
 */
export function curry<T extends unknown[], R>(
  fn: (...fnArgs: T) => R,
  arity: number = fn.length,
  ...args: T
) {
  return arity <= args.length ? fn(...args) : (curry as any).bind(null, fn, arity, ...args);
}

/**
 * @function functionName
 * @description 打印函数名称
 * @param {function} fn
 * @return {null}
 * @example
function add(a: number, b: number) {
  return a + b;
}

functionName(add);
 */
export function functionName<T extends (...ks: unknown[]) => unknown>(fn: T) {
  console.debug(fn.name, fn);
  return fn.name;
}

/**
 * @function promisify
 * @description 函数执行promise化
 * @param {Function} fn
 * @return {Function}
 * @example
import fs from 'fs';
const readFileAsync = promisify(fs.readFile);

async function main() {
  const data = await readFileAsync('file.txt', 'utf8');
  console.log(data);
}
main();
 */
export function promisify<T extends unknown[], R>(
  fn: (...args: [args: T, errHandler?: (err: Error | null, result?: R) => void]) => void
): (...args: T) => Promise<R> {
  return (...args: T) =>
    new Promise((resolve, reject) => {
      fn(args, (err: Error | null, result?: R) => {
        err ? reject(err) : resolve(result as R);
      });
    });
}

/**
 * @function sleep
 * @description 延迟ms执行
 * @param {number} ms
 * @return {Promise<null>}
 * @example
async function main() {
  console.log("Doing something...");
  await sleep(5000);
  console.log("Doing something else...");
}
main();
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const DEFAULT_INTERVAL = 500;

/**
 * @function throttle
 * @description 节流函数
 * @param {Function} fn
 * @param {Number} intervalTime
 * @returns {Function}
 * @example
function log(message: string) {
  console.log(message);
}
const logThrottled = throttle(log, 1000);

// 在 1 秒内连续调用函数，只会执行一次，并在 1 秒后再次执行
setInterval(() => logThrottled('Hello, world!'), 200);
 */
export function throttle<F extends (...args: any[]) => any>(
  fn: F,
  intervalTime = DEFAULT_INTERVAL
): (...args: Parameters<F>) => void {
  let flag = true;
  return function (this: any, ...args: Parameters<F>) {
    if (flag) {
      fn.apply(this, args);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, intervalTime);
    }
  };
}

type DebouncedFn<T extends unknown[]> = (...args: T) => void;

/**
 * @function debounce
 * @description 防抖函数
 * @param {Function} fn
 * @param {Number} intervalTime
 * @returns {Function}
 * @example
function search(query: string) {
  // 发送请求，搜索指定的查询字符串
  console.log(`Searching for "${query}"...`);
}

const searchDebounced = debounce(search, 500);

// 用户连续输入时，只会在最后一次输入后 500ms 执行搜索
searchDebounced('JavaScript'); // 不会执行
searchDebounced('TypeScript'); // 不会执行
searchDebounced('React'); // 不会执行
setTimeout(() => searchDebounced('Redux'), 600); // 执行搜索
 */
export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  intervalTime = DEFAULT_INTERVAL
): DebouncedFn<T> {
  let timeId: ReturnType<typeof setTimeout> | null = null;
  return function debouncedFn(this: unknown, ...args: T) {
    if (timeId) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      timeId = null;
      fn.apply(this, args);
    }, intervalTime);
  };
}
