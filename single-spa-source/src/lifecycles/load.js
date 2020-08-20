import {LOADING_SOURCE_CODE, NOT_BOOTSTRAPPED} from '../applications/app.helper';
import {flattenFnArray} from './lifecycle.helpers';

/**
 * 加载应用
 * @param app
 * @returns {Promise<void>}
 */
export async function toLoadPromise(app) {
  app.status = LOADING_SOURCE_CODE; // 开始加载资源
  const {bootstrap, mount, unmount} = await app.loadApp(app.customerProps);
  app.status = NOT_BOOTSTRAPPED;  // 还没有调用bootstrap方法
  app.bootstrap = flattenFnArray(bootstrap);
  app.mount = flattenFnArray(mount);
  app.unmount = flattenFnArray(unmount);
  return app;
}
