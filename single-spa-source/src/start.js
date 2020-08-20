import {reroute} from './navigation/reroute';

// 导出是否启动状态标示
export let started = false;

/**
 * 是否启动挂载
 * @returns {boolean}
 */
export function isStarted() {
  return started;
}

/**
 * 启动挂载
 */
export function start() {
  started = true;
  reroute();
}
