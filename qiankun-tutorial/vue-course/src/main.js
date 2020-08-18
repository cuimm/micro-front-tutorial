import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false


let vm
function render() {
  vm = new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
} else {
  /*
  修改webpack publicPath，否则加载图片时404
  使用 webpack 运行时 publicPath 配置
  qiankun 将会在微应用 bootstrap 之前注入一个运行时的 publicPath 变量，你需要做的是在微应用的 entry js 的顶部添加如下代码：
  */
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

export async function bootstrap() {
  console.log('course app bootstrap');
}

export async function mount(props) {
  console.log('course app mount');
  render()
}

export async function unmount() {
  console.log('course app unmount');
  vm.$destroy()
}
