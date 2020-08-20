import {reroute} from '../navigation/reroute';
import {
  shouldBeActive,
  BOOTSTRAPPING,
  LOADING_SOURCE_CODE, MOUNTING,
  NOT_BOOTSTRAPPED,
  NOT_LOADED, NOT_MOUNTED,
  SKIP_BECAUSE_BROKEN, MOUNTED,
} from './app.helper';

/* 用来存放所有的应用 */
const apps = [];

/**
 * 维护应用所有状态 状态机
 * @returns {{appsToLoad: Array, appsToUnmount: Array, appsToMount: Array}}
 */
export function getAppChanges() {
  const appsToUnmount = []; // 需要卸载的应用
  const appsToLoad = []; // 需要加载的应用
  const appsToMount = []; // 需要挂载的应用

  apps.forEach(app => {
    const appShouldBeActive = app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app);

    console.log('getAppChanges', app.name, app.status, appShouldBeActive);

    switch (app.status) {
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        if (appShouldBeActive) {
          appsToLoad.push(app);
        }
        break;
      case NOT_BOOTSTRAPPED:
      case BOOTSTRAPPING:
      case NOT_MOUNTED:
        if (appShouldBeActive) {
          appsToMount.push(app);
        }
        break;
      case MOUNTED:
        if (!appShouldBeActive) {
          appsToUnmount.push(app);
        }
        break;
    }
  });
  return {appsToLoad, appsToUnmount, appsToMount}
}

/**
 *
 * @param appName 应用名称
 * @param loadApp 加载函数。可以是函数也可以是数组, 需返回三个异步钩子函数
 * @param activeWhen  应用激活函数
 * @param customerProps 用户自定义参数, 可以传递给子应用
 */
export function registerApplication(appName, loadApp, activeWhen, customerProps) {
  apps.push({
    name: appName,
    loadApp,
    activeWhen,
    customerProps,
    status: NOT_LOADED,
  });
  reroute();
}
