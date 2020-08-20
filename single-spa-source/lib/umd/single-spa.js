(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.singleSpa = {}));
}(this, (function (exports) { 'use strict';

  // 导出是否启动状态标示
  let started = false;

  /**
   * 启动挂载
   */
  function start() {
    started = true;
    reroute();
  }

  /**
   * APP status
   */
  const NOT_LOADED = 'NOT_LOADED'; // 应用初始状态
  const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'; // 加载资源
  const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'; // 还没有调用 bootstrap 方法
  const BOOTSTRAPPING = 'BOOTSTRAPPING'; // 启动中
  const NOT_MOUNTED = 'NOT_MOUNTED'; // 没调用 mount 方法
  const MOUNTING = 'MOUNTING'; // 挂载中
  const MOUNTED = 'MOUNTED'; // 挂载完成
  const UNMOUNTING = 'UNMOUNTING'; // 解除挂载
  const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN';

  /**
   * 当前应用是否要被激活
   * @param app
   */
  function shouldBeActive(app) {
    return app.activeWhen(window.location)
  }

  /**
   * 通过promise链来链式调用，将多个promise方法组合成一个方法
   * const fns = [async () => {}, async () => {}];  flattenFnArray(fns);
   * @param fns
   * @returns {Function}
   */
  function flattenFnArray(fns) {
    fns = Array.isArray(fns) ? fns : [fns];
    return props => {
      fns.reduce((p, fn) => {
        return p.then(() => fn(props))
      }, Promise.resolve());
    };
  }

  /**
   * 加载应用
   * @param app
   * @returns {Promise<void>}
   */
  async function toLoadPromise(app) {
    app.status = LOADING_SOURCE_CODE; // 开始加载资源
    const {bootstrap, mount, unmount} = await app.loadApp(app.customerProps);
    app.status = NOT_BOOTSTRAPPED;  // 还没有调用bootstrap方法
    app.bootstrap = flattenFnArray(bootstrap);
    app.mount = flattenFnArray(mount);
    app.unmount = flattenFnArray(unmount);
    return app;
  }

  /**
   * 卸载应用
   * @param app
   * @returns {Promise<*>}
   */
  async function toUnmountPromise(app) {
    if (app.status !== MOUNTED) {
      return app;
    }
    app.status = UNMOUNTING;
    await app.unmount(app.customerProps);
    app.status = NOT_MOUNTED;
    return app;
  }

  /**
   * 加载应用
   * @param app
   * @returns {Promise<*>}
   */
  async function toBootstrapPromise(app) {
    if (app.status !== NOT_BOOTSTRAPPED) {
      return app;
    }
    app.status = BOOTSTRAPPING;
    await app.bootstrap(app.customerProps);
    app.status = NOT_MOUNTED;
    return app;
  }

  /**
   * 挂载应用
   * @param app
   * @returns {Promise<*>}
   */
  async function toMountPromise(app) {
    if (app.status !== NOT_MOUNTED) {
      return app;
    }
    app.status = MOUNTING;
    await app.mount(app.customerProps);
    app.status = MOUNTED;
    return app;
  }

  const isInBrowser = typeof window !== 'undefined';

  /* 路由拦截 */

  const capturedEventListeners = {
    hashchange: [],
    popstate: [],
  };

  const routingEventsListeningTo = ['hashchange', 'popstate'];

  function urlReroute() {
    reroute();
  }

  // history模式路由：h5 api
  function patchedUpdateState(updateState, methodName) {
    return function () {
      const urlBefore = window.location.href; // 路由切换前url地址
      const result = updateState.apply(this, arguments);  // 切换history路由
      const urlAfter = window.location.href;  // 路由切换后url地址

      // 路由有变化 => 加载应用程序
      if (urlBefore !== urlAfter) {
        urlReroute(new PopStateEvent('popstate'));
      }
      return result;
    }
  }

  if (isInBrowser) {
    // 保存原始addEventListener && addEventListener
    const originalAddEventListener = window.addEventListener;
    const originalRemoveEventListener = window.addEventListener;

    // 重写addEventListener
    window.addEventListener = function (eventName, fn) {
      if (typeof fn === 'function') {
        if (routingEventsListeningTo.indexOf(eventName) && !capturedEventListeners[eventName].some(listener => listener === fn)) {
          capturedEventListeners[eventName].push(fn);
          return;
        }
      }
      return originalAddEventListener.apply(this, arguments); // 执行原生addEventListener
    };
    // 重写 removeEventListener
    window.removeEventListener = function (eventName, fn) {
      if (typeof fn === 'function') {
        if (routingEventsListeningTo.indexOf(eventName)) {
          capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(listener => listener !== fn);
        }
      }
      return originalRemoveEventListener.apply(this, arguments); // 执行原生的removeEventListener
    };

    // hash路由切换时, 会触发hashchange事件
    window.addEventListener('hashchange', urlReroute);

    // popstate只有在作出浏览动作, 如：用户点击，或者执行history.back()或history.forward()方法 时才会触发（pushState和replaceState不会触发popstate）
    window.addEventListener('popstate', urlReroute);

    // history路由切换 pushState && replaceState => pushState和replaceState不会触发popstate事件（popstate只有在作出浏览动作, 如：用户点击，或者执行history.back()或history.forward()方法 时才会触发）
    window.history.pushState = patchedUpdateState(window.history.pushState);
    window.history.replaceState = patchedUpdateState(window.history.replaceState);
  }

  /**
   * 应用加载是异步的
   * 需要获取要加载的应用
   * 需要获取要卸载的应用
   * 需要获取要挂载的应用
   */
  function reroute() {
    // 获取应用状态机
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

  /* 用来存放所有的应用 */
  const apps = [];

  /**
   * 维护应用所有状态 状态机
   * @returns {{appsToLoad: Array, appsToUnmount: Array, appsToMount: Array}}
   */
  function getAppChanges() {
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
  function registerApplication(appName, loadApp, activeWhen, customerProps) {
    apps.push({
      name: appName,
      loadApp,
      activeWhen,
      customerProps,
      status: NOT_LOADED,
    });
    reroute();
  }

  exports.registerApplication = registerApplication;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=single-spa.js.map
