/* 路由拦截 */
import {reroute} from './reroute';
import {isInBrowser} from '../utils/runtime-environment';

const capturedEventListeners = {
  hashchange: [],
  popstate: [],
};

export const routingEventsListeningTo = ['hashchange', 'popstate'];

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
        return;
      }
    }
    return originalRemoveEventListener.apply(this, arguments); // 执行原生的removeEventListener
  };

  // hash路由-----hash路由切换时, 会触发hashchange事件
  window.addEventListener('hashchange', urlReroute);


  // history路由-----popstate只有在作出浏览动作, 如：用户点击，或者执行history.back()或history.forward()方法 时才会触发（pushState和replaceState不会触发popstate）
  window.addEventListener('popstate', urlReroute);

  // history路由-----切换 pushState && replaceState => pushState和replaceState不会触发popstate事件（popstate只有在作出浏览动作, 如：用户点击，或者执行history.back()或history.forward()方法 时才会触发）
  window.history.pushState = patchedUpdateState(window.history.pushState, 'pushState');
  window.history.replaceState = patchedUpdateState(window.history.replaceState, 'replaceState');
}
