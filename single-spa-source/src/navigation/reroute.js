import {started} from '../start';
import {getAppChanges} from '../applications/apps';
import {toLoadPromise} from '../lifecycles/load';
import {toUnmountPromise} from '../lifecycles/unmount';
import {toBootstrapPromise} from '../lifecycles/bootstrap';
import {toMountPromise} from '../lifecycles/mount';

/**
 * 应用加载是异步的
 * 需要获取要加载的应用
 * 需要获取要卸载的应用
 * 需要获取要挂载的应用
 */
export function reroute() {
  const {appsToLoad, appsToMount, appsToUnmount} = getAppChanges();
  if (started) {
    return performAppChanges();
  } else {
    return loadApps(); // 注册应用时, 需要预先加载应用
  }

  /**
   * 装载应用
   * @returns {Promise<void>}
   */
  async function performAppChanges() {
    // 先卸载不需要的应用
    const unmountPromises = appsToUnmount.map(toUnmountPromise);
    // 加载需要加载的应用. 将需要加载的应用拿到=>加载=>启动=>挂载
    appsToLoad.forEach(async app => {
      app = await toLoadPromise(app);
      await toBootstrapPromise(app);
      return toMountPromise(app);
    });
    appsToMount.forEach(async app => {
      app = await toBootstrapPromise(app);
      return toMountPromise(app);
    });
  }

  /**
   * 预加载应用
   */
  async function loadApps() {
    appsToLoad.map(toLoadPromise);
  }
}
